const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'AquaFish_BaoCao_CauTruc.pptx');
const COVER_IMAGE = path.join(__dirname, 'picture', 'catonghop', '42-ca-cau-vong-xanh-do.jpg');

const NS = {
  a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
  p: 'http://schemas.openxmlformats.org/presentationml/2006/main',
  r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
};

const W = 12192000;
const H = 6858000;
const inch = (n) => Math.round(n * 914400);

function xmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clampText(text, max = 160) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean;
}

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosTimeDate(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const year = Math.max(date.getFullYear(), 1980);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: dosDate };
}

function createZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  const dt = dosTimeDate();

  for (const file of files) {
    const name = Buffer.from(file.path.replace(/\\/g, '/'), 'utf8');
    const data = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data, 'utf8');
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(dt.time, 10);
    local.writeUInt16LE(dt.date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, name, data);

    const head = Buffer.alloc(46);
    head.writeUInt32LE(0x02014b50, 0);
    head.writeUInt16LE(20, 4);
    head.writeUInt16LE(20, 6);
    head.writeUInt16LE(0x0800, 8);
    head.writeUInt16LE(0, 10);
    head.writeUInt16LE(dt.time, 12);
    head.writeUInt16LE(dt.date, 14);
    head.writeUInt32LE(crc, 16);
    head.writeUInt32LE(data.length, 20);
    head.writeUInt32LE(data.length, 24);
    head.writeUInt16LE(name.length, 28);
    head.writeUInt16LE(0, 30);
    head.writeUInt16LE(0, 32);
    head.writeUInt16LE(0, 34);
    head.writeUInt16LE(0, 36);
    head.writeUInt32LE(0, 38);
    head.writeUInt32LE(offset, 42);
    central.push(head, name);
    offset += local.length + name.length + data.length;
  }

  const cd = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cd.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...chunks, cd, end]);
}

class Slide {
  constructor(title, opts = {}) {
    this.title = title;
    this.bg = opts.bg || 'F8FAFC';
    this.parts = [];
    this.rels = [];
    this.id = 10;
  }

  nextId() {
    this.id += 1;
    return this.id;
  }

  rect(x, y, w, h, opts = {}) {
    const id = this.nextId();
    const fill = opts.fill === 'none'
      ? '<a:noFill/>'
      : `<a:solidFill><a:srgbClr val="${opts.fill || 'FFFFFF'}"/></a:solidFill>`;
    const line = opts.line === 'none'
      ? '<a:ln><a:noFill/></a:ln>'
      : `<a:ln w="${opts.lineWidth || 12700}"><a:solidFill><a:srgbClr val="${opts.line || opts.fill || 'CBD5E1'}"/></a:solidFill></a:ln>`;
    const geom = opts.round ? 'roundRect' : 'rect';
    const tx = opts.text ? txBody(opts.text, opts) : '';
    this.parts.push(`
      <p:sp>
        <p:nvSpPr><p:cNvPr id="${id}" name="${xmlEscape(opts.name || 'Shape')}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="${inch(x)}" y="${inch(y)}"/><a:ext cx="${inch(w)}" cy="${inch(h)}"/></a:xfrm>
          <a:prstGeom prst="${geom}"><a:avLst/></a:prstGeom>
          ${fill}${line}
        </p:spPr>
        ${tx}
      </p:sp>`);
  }

  text(x, y, w, h, text, opts = {}) {
    const id = this.nextId();
    this.parts.push(`
      <p:sp>
        <p:nvSpPr><p:cNvPr id="${id}" name="${xmlEscape(opts.name || 'TextBox')}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="${inch(x)}" y="${inch(y)}"/><a:ext cx="${inch(w)}" cy="${inch(h)}"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/><a:ln><a:noFill/></a:ln>
        </p:spPr>
        ${txBody(text, opts)}
      </p:sp>`);
  }

  line(x1, y1, x2, y2, opts = {}) {
    const id = this.nextId();
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const w = Math.abs(x2 - x1) || 0.01;
    const h = Math.abs(y2 - y1) || 0.01;
    const flipH = x2 < x1 ? ' flipH="1"' : '';
    const flipV = y2 < y1 ? ' flipV="1"' : '';
    const arrow = opts.arrow ? '<a:headEnd type="triangle"/>' : '';
    this.parts.push(`
      <p:cxnSp>
        <p:nvCxnSpPr><p:cNvPr id="${id}" name="${xmlEscape(opts.name || 'Connector')}"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr>
        <p:spPr>
          <a:xfrm${flipH}${flipV}><a:off x="${inch(x)}" y="${inch(y)}"/><a:ext cx="${inch(w)}" cy="${inch(h)}"/></a:xfrm>
          <a:prstGeom prst="straightConnector1"><a:avLst/></a:prstGeom>
          <a:ln w="${opts.width || 25400}" cap="round">
            <a:solidFill><a:srgbClr val="${opts.color || '64748B'}"/></a:solidFill>
            ${arrow}
          </a:ln>
        </p:spPr>
      </p:cxnSp>`);
  }

  picture(x, y, w, h, filePath, opts = {}) {
    if (!fs.existsSync(filePath)) return;
    const id = this.nextId();
    const relId = `rId${this.rels.length + 2}`;
    const ext = path.extname(filePath).toLowerCase().replace('.', '') || 'jpg';
    const mediaName = `image${opts.mediaIndex || id}.${ext === 'jpeg' ? 'jpg' : ext}`;
    this.rels.push({ id: relId, target: `../media/${mediaName}`, type: 'image', source: filePath, mediaName });
    this.parts.push(`
      <p:pic>
        <p:nvPicPr><p:cNvPr id="${id}" name="${xmlEscape(opts.name || mediaName)}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr>
        <p:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
        <p:spPr>
          <a:xfrm><a:off x="${inch(x)}" y="${inch(y)}"/><a:ext cx="${inch(w)}" cy="${inch(h)}"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:ln><a:noFill/></a:ln>
        </p:spPr>
      </p:pic>`);
  }

  header(title = this.title, subtitle = '') {
    this.text(0.55, 0.28, 8.9, 0.45, title, { fontSize: 22, bold: true, color: '0F172A' });
    if (subtitle) this.text(0.58, 0.76, 8.9, 0.28, subtitle, { fontSize: 10.5, color: '64748B' });
    this.rect(0.55, 1.02, 2.0, 0.04, { fill: '0891B2', line: 'none' });
  }

  footer(n) {
    this.text(0.55, 7.05, 5.5, 0.25, 'AquaFish - Báo cáo dự án môn học', { fontSize: 8.5, color: '64748B' });
    this.text(12.0, 7.05, 0.75, 0.25, String(n), { fontSize: 8.5, color: '64748B', align: 'r' });
  }

  xml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="${NS.a}" xmlns:r="${NS.r}" xmlns:p="${NS.p}">
  <p:cSld>
    <p:bg><p:bgPr><a:solidFill><a:srgbClr val="${this.bg}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      ${this.parts.join('\n')}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
  }

  relsXml() {
    const imageRels = this.rels.map((rel) =>
      `<Relationship Id="${rel.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${xmlEscape(rel.target)}"/>`
    ).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  ${imageRels}
</Relationships>`;
  }
}

function txBody(text, opts = {}) {
  const lines = Array.isArray(text) ? text : String(text).split('\n');
  const fontSize = Math.round((opts.fontSize || 16) * 100);
  const color = opts.color || '0F172A';
  const bold = opts.bold ? ' b="1"' : '';
  const italic = opts.italic ? ' i="1"' : '';
  const align = opts.align || 'l';
  const anchorMap = { top: 't', t: 't', mid: 'ctr', middle: 'ctr', ctr: 'ctr', center: 'ctr', bottom: 'b', b: 'b' };
  const anchor = anchorMap[opts.valign || 'top'] || 't';
  const paragraphs = lines.map((line) => {
    let t = String(line);
    const bullet = opts.bullet || t.startsWith('- ');
    if (t.startsWith('- ')) t = t.slice(2);
    const pPr = bullet
      ? `<a:pPr algn="${align}" marL="228600" indent="-114300"><a:buChar char="•"/></a:pPr>`
      : `<a:pPr algn="${align}"/>`;
    return `<a:p>${pPr}<a:r><a:rPr lang="vi-VN" sz="${fontSize}"${bold}${italic}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="${opts.font || 'Arial'}"/></a:rPr><a:t>${xmlEscape(t)}</a:t></a:r></a:p>`;
  }).join('');
  return `<p:txBody><a:bodyPr wrap="square" anchor="${anchor}" lIns="${opts.padL ?? 91440}" tIns="${opts.padT ?? 45720}" rIns="${opts.padR ?? 91440}" bIns="${opts.padB ?? 45720}"/><a:lstStyle/>${paragraphs}</p:txBody>`;
}

function addPill(slide, x, y, w, label, color = '0891B2') {
  slide.rect(x, y, w, 0.36, { fill: color, line: color, round: true, text: label, fontSize: 10.5, bold: true, color: 'FFFFFF', align: 'ctr', valign: 'mid', padL: 10000, padR: 10000 });
}

function addCard(slide, x, y, w, h, title, body, accent = '0891B2') {
  slide.rect(x, y, w, h, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
  slide.rect(x, y, 0.07, h, { fill: accent, line: 'none' });
  slide.text(x + 0.18, y + 0.15, w - 0.32, 0.28, title, { fontSize: 13.5, bold: true, color: '0F172A' });
  slide.text(x + 0.18, y + 0.54, w - 0.32, h - 0.68, body, { fontSize: 10.5, color: '334155' });
}

function addEntity(slide, x, y, w, h, name, fields, color = '0891B2') {
  slide.rect(x, y, w, h, { fill: 'FFFFFF', line: color, round: true, lineWidth: 15240 });
  slide.rect(x, y, w, 0.34, { fill: color, line: color, round: true });
  slide.text(x + 0.04, y + 0.04, w - 0.08, 0.22, name, { fontSize: 8.8, bold: true, color: 'FFFFFF', align: 'ctr', padL: 0, padR: 0, padT: 0, padB: 0 });
  slide.text(x + 0.08, y + 0.43, w - 0.16, h - 0.5, fields.join('\n'), { fontSize: 6.8, color: '334155', padL: 0, padR: 0, padT: 0, padB: 0 });
}

const slides = [];

// 1. Cover
{
  const s = new Slide('AquaFish', { bg: 'E6F7FB' });
  s.picture(7.15, 0, 6.2, 7.5, COVER_IMAGE, { mediaIndex: 1 });
  s.rect(0, 0, 13.33, 7.5, { fill: 'E6F7FB', line: 'none' });
  s.rect(7.0, 0, 6.33, 7.5, { fill: 'D9F3F8', line: 'none' });
  s.picture(7.2, 0.55, 5.5, 5.9, COVER_IMAGE, { mediaIndex: 1 });
  s.rect(7.2, 0.55, 5.5, 5.9, { fill: 'none', line: 'FFFFFF', lineWidth: 22860 });
  addPill(s, 0.75, 0.75, 2.0, 'Báo cáo dự án', '0891B2');
  s.text(0.75, 1.35, 5.8, 1.25, 'AQUAFISH', { fontSize: 42, bold: true, color: '0F172A' });
  s.text(0.78, 2.35, 5.8, 0.72, 'Website thương mại điện tử cá cảnh và phụ kiện thủy sinh', { fontSize: 19, color: '0F766E' });
  s.text(0.78, 3.35, 5.65, 1.0, 'Nội dung bám theo lộ trình môn học: phân tích yêu cầu, actor, use case, mô hình dữ liệu, frontend, backend, kết nối hệ thống, kiểm thử và triển khai.', { fontSize: 14, color: '334155' });
  addPill(s, 0.78, 4.8, 1.5, 'Next.js', '0EA5E9');
  addPill(s, 2.45, 4.8, 1.7, 'Express API', '14B8A6');
  addPill(s, 4.32, 4.8, 1.55, 'Prisma DB', 'F59E0B');
  s.text(0.78, 6.7, 4.7, 0.25, 'Tài liệu nguồn: Tiến độ môn học, rubric đánh giá, source AquaFish', { fontSize: 9.5, color: '64748B' });
  slides.push(s);
}

// 2. Overview and objectives
{
  const s = new Slide('Tổng quan đề tài');
  s.header('Tổng quan đề tài', 'AquaFish giải quyết nhu cầu mua bán cá cảnh, phụ kiện thủy sinh và quản trị đơn hàng trên một nền tảng web.');
  addCard(s, 0.7, 1.35, 3.85, 1.55, 'Mục tiêu nghiệp vụ', '- Người dùng xem, tìm kiếm, lọc sản phẩm\n- Đăng ký, đăng nhập, quản lý hồ sơ\n- Giỏ hàng, đặt hàng và theo dõi đơn\n- Admin quản lý dữ liệu và thống kê', '0891B2');
  addCard(s, 4.75, 1.35, 3.85, 1.55, 'Yêu cầu phi chức năng', '- Giao diện responsive\n- Dữ liệu đồng bộ FE-BE\n- Bảo mật bằng JWT, bcrypt, phân quyền\n- API có phân trang, lọc, xử lý lỗi', '14B8A6');
  addCard(s, 8.8, 1.35, 3.85, 1.55, 'Phạm vi hiện tại', '- Core API: Auth, Product, Category, Order\n- Frontend: home, sản phẩm, cart, checkout, admin\n- Database schema đủ 12 nhóm bảng\n- Một số module nâng cao còn hoàn thiện', 'F59E0B');
  s.rect(0.7, 3.35, 11.95, 2.45, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
  s.text(0.95, 3.62, 11.35, 0.35, 'Các điểm bám sát rubric', { fontSize: 16, bold: true, color: '0F172A' });
  const items = [
    ['Phân tích yêu cầu', 'Chức năng và phi chức năng cho hệ thống thương mại điện tử'],
    ['Actor & Use Case', 'Khách vãng lai, khách hàng, admin, hệ thống thanh toán'],
    ['ER/Class Diagram', 'Thiết kế bảng, quan hệ và luồng dữ liệu cốt lõi'],
    ['Frontend/Backend', 'Giao diện, API, CRUD, kết nối DB, bảo mật'],
    ['Test & triển khai', 'Manual test, sửa lỗi, hướng deploy cloud/local']
  ];
  items.forEach((item, i) => {
    const x = 0.95 + i * 2.28;
    s.rect(x, 4.18, 2.02, 1.18, { fill: ['E0F2FE', 'CCFBF1', 'FEF3C7', 'ECFDF5', 'FEE2E2'][i], line: 'FFFFFF', round: true });
    s.text(x + 0.08, 4.31, 1.86, 0.22, item[0], { fontSize: 10.5, bold: true, color: '0F172A', align: 'ctr', padL: 0, padR: 0 });
    s.text(x + 0.12, 4.65, 1.78, 0.48, item[1], { fontSize: 7.8, color: '334155', align: 'ctr', padL: 0, padR: 0 });
  });
  s.footer(2);
  slides.push(s);
}

// 3. Roadmap
{
  const s = new Slide('Lộ trình thực hiện');
  s.header('Lộ trình thực hiện', 'Tóm tắt theo file Tiến độ môn học.docx và gắn vào tiến độ dự án AquaFish.');
  const phases = [
    ['Tuần 1', 'Khởi động & phân tích yêu cầu', 'Chọn đề tài, xác định chức năng, phi chức năng'],
    ['Tuần 2', 'Phân tích hệ thống', 'Xác định actor, vẽ sơ đồ Use Case'],
    ['Tuần 3', 'Thiết kế dữ liệu', 'ER/Class diagram, triển khai CSDL'],
    ['Tuần 4-7', 'Phát triển hệ thống', 'Xây dựng frontend, backend, kiểm tra giữa kỳ'],
    ['Tuần 8', 'Kiểm thử & sửa lỗi', 'Manual test, fix bug, ổn định dữ liệu'],
    ['Tuần 9-12', 'Hoàn thiện & báo cáo', 'Deploy, tài liệu hướng dẫn, demo trước lớp']
  ];
  const y = 1.35;
  phases.forEach((p, i) => {
    const x = 0.65 + i * 2.08;
    s.rect(x, y, 1.72, 3.95, { fill: i % 2 ? 'FFFFFF' : 'ECFEFF', line: 'D7E3EA', round: true });
    s.rect(x + 0.2, y + 0.25, 1.32, 0.46, { fill: ['0891B2', '14B8A6', 'F59E0B', '0EA5E9', '10B981', '6366F1'][i], line: 'none', round: true, text: p[0], color: 'FFFFFF', bold: true, fontSize: 11, align: 'ctr', valign: 'mid' });
    s.text(x + 0.16, y + 0.95, 1.42, 0.75, p[1], { fontSize: 11.2, bold: true, color: '0F172A', align: 'ctr', padL: 0, padR: 0 });
    s.text(x + 0.18, y + 1.92, 1.38, 1.18, p[2], { fontSize: 8.5, color: '475569', align: 'ctr', padL: 0, padR: 0 });
    if (i < phases.length - 1) s.line(x + 1.72, y + 2.0, x + 2.05, y + 2.0, { color: '94A3B8', arrow: true, width: 19050 });
  });
  s.rect(0.75, 5.75, 11.8, 0.72, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
  s.text(0.95, 5.92, 11.4, 0.32, 'Kết quả cần thể hiện khi thuyết trình: kiến trúc hệ thống, tính năng chính, quy trình phát triển, demo và giải thích quyết định kỹ thuật.', { fontSize: 12, color: '334155', align: 'ctr' });
  s.footer(3);
  slides.push(s);
}

// 4. Actors
{
  const s = new Slide('Actor và vai trò');
  s.header('Actor và vai trò', 'Các nhóm người dùng chính và phạm vi thao tác trong hệ thống.');
  const actors = [
    ['Khách vãng lai', 'Xem trang chủ, xem danh mục, tìm kiếm/lọc sản phẩm, đọc blog, liên hệ tư vấn.', '0EA5E9'],
    ['Khách hàng', 'Đăng ký/đăng nhập, quản lý hồ sơ, thêm giỏ hàng, đặt hàng, xem lịch sử đơn, đánh giá sản phẩm.', '14B8A6'],
    ['Quản trị viên', 'Quản lý sản phẩm, danh mục, người dùng, đơn hàng, mã giảm giá, bài viết và thống kê.', 'F59E0B'],
    ['Hệ thống thanh toán', 'VNPay/MoMo hoặc COD tiếp nhận yêu cầu thanh toán, phản hồi trạng thái giao dịch.', '6366F1']
  ];
  actors.forEach((a, i) => {
    const x = 0.8 + (i % 2) * 6.1;
    const y = 1.45 + Math.floor(i / 2) * 2.25;
    s.rect(x, y, 5.55, 1.68, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
    s.rect(x + 0.25, y + 0.28, 0.62, 0.62, { fill: a[2], line: 'none', round: true, text: String(i + 1), color: 'FFFFFF', bold: true, fontSize: 15, align: 'ctr', valign: 'mid' });
    s.text(x + 1.05, y + 0.25, 4.2, 0.32, a[0], { fontSize: 15, bold: true, color: '0F172A' });
    s.text(x + 1.05, y + 0.72, 4.15, 0.62, a[1], { fontSize: 10.2, color: '475569' });
  });
  s.rect(0.8, 6.02, 11.65, 0.46, { fill: 'ECFEFF', line: 'BAE6FD', round: true });
  s.text(1.02, 6.12, 11.1, 0.2, 'Phân quyền chính: CUSTOMER thao tác mua hàng; ADMIN có quyền quản trị dữ liệu và nghiệp vụ.', { fontSize: 10.5, color: '075985', align: 'ctr' });
  s.footer(4);
  slides.push(s);
}

// 5. Use Case diagram
{
  const s = new Slide('Sơ đồ Use Case tổng quan');
  s.header('Sơ đồ Use Case tổng quan', 'Sơ đồ rút gọn để trình bày các chức năng chính theo actor.');
  const actors = [
    ['Khách', 0.6, 1.55, '0EA5E9'],
    ['Khách hàng', 0.6, 3.15, '14B8A6'],
    ['Admin', 0.6, 4.75, 'F59E0B']
  ];
  actors.forEach(([name, x, y, c]) => {
    s.rect(x, y, 1.45, 0.55, { fill: c, line: 'none', round: true, text: name, fontSize: 11.5, bold: true, color: 'FFFFFF', align: 'ctr', valign: 'mid' });
  });
  s.rect(2.7, 1.15, 9.95, 4.95, { fill: 'FFFFFF', line: 'CBD5E1', round: true });
  s.text(3.0, 1.35, 9.35, 0.28, 'AquaFish System', { fontSize: 14, bold: true, color: '0F172A', align: 'ctr' });
  const cases = [
    ['Xem sản phẩm', 3.1, 2.0, 'E0F2FE'],
    ['Tìm kiếm / lọc', 5.2, 2.0, 'E0F2FE'],
    ['Đăng ký / đăng nhập', 7.3, 2.0, 'CCFBF1'],
    ['Quản lý hồ sơ', 9.4, 2.0, 'CCFBF1'],
    ['Thêm giỏ hàng', 3.1, 3.15, 'CCFBF1'],
    ['Đặt hàng', 5.2, 3.15, 'CCFBF1'],
    ['Theo dõi đơn', 7.3, 3.15, 'CCFBF1'],
    ['Đánh giá sản phẩm', 9.4, 3.15, 'CCFBF1'],
    ['CRUD sản phẩm', 3.1, 4.3, 'FEF3C7'],
    ['CRUD danh mục', 5.2, 4.3, 'FEF3C7'],
    ['Quản lý đơn / user', 7.3, 4.3, 'FEF3C7'],
    ['Thống kê dashboard', 9.4, 4.3, 'FEF3C7']
  ];
  cases.forEach(([label, x, y, fill]) => {
    s.rect(x, y, 1.62, 0.55, { fill, line: 'FFFFFF', round: true, text: label, fontSize: 9.2, color: '0F172A', align: 'ctr', valign: 'mid', padL: 10000, padR: 10000 });
  });
  [[2.05, 1.82, 3.1, 2.27], [2.05, 1.82, 5.2, 2.27], [2.05, 3.42, 7.3, 2.27], [2.05, 3.42, 3.1, 3.42], [2.05, 3.42, 5.2, 3.42], [2.05, 3.42, 7.3, 3.42], [2.05, 4.98, 3.1, 4.57], [2.05, 4.98, 5.2, 4.57], [2.05, 4.98, 7.3, 4.57], [2.05, 4.98, 9.4, 4.57]].forEach((l) => s.line(...l, { color: '94A3B8', width: 12700 }));
  s.footer(5);
  slides.push(s);
}

// 6. System structure
{
  const s = new Slide('Sơ đồ cấu trúc hệ thống');
  s.header('Sơ đồ cấu trúc hệ thống', 'Luồng chính: người dùng thao tác trên UI, frontend gọi REST API, backend xử lý nghiệp vụ và lưu dữ liệu.');
  const layers = [
    ['Người dùng', 'Khách vãng lai\nKhách hàng\nAdmin', 0.65, 2.2, 1.8, 1.35, '0EA5E9'],
    ['Frontend', 'Next.js 14\nApp Router\nTailwind CSS\nZustand store', 3.0, 1.45, 2.2, 2.85, '14B8A6'],
    ['API Layer', 'REST API\nAxios / fetch\nJWT token', 5.8, 2.0, 1.8, 1.75, '6366F1'],
    ['Backend', 'Express + TS\nRoutes\nControllers\nMiddleware\nZod validation', 8.05, 1.45, 2.2, 2.85, 'F59E0B'],
    ['Database', 'Prisma ORM\nPostgreSQL/Supabase\nlocal-db seed\nẢnh sản phẩm', 10.85, 1.65, 1.95, 2.45, '10B981']
  ];
  layers.forEach(([title, body, x, y, w, h, c]) => {
    s.rect(x, y, w, h, { fill: 'FFFFFF', line: c, round: true, lineWidth: 19050 });
    s.rect(x, y, w, 0.46, { fill: c, line: c, round: true, text: title, fontSize: 11.8, bold: true, color: 'FFFFFF', align: 'ctr', valign: 'mid' });
    s.text(x + 0.12, y + 0.66, w - 0.24, h - 0.82, body, { fontSize: 10, color: '334155', align: 'ctr', valign: 'mid', padL: 0, padR: 0 });
  });
  [[2.45, 2.9, 3.0, 2.9], [5.2, 2.9, 5.8, 2.9], [7.6, 2.9, 8.05, 2.9], [10.25, 2.9, 10.85, 2.9]].forEach((l) => s.line(...l, { color: '0F172A', arrow: true, width: 22860 }));
  s.rect(3.0, 4.85, 7.25, 1.12, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
  s.text(3.25, 5.03, 6.75, 0.62, 'Module nghiệp vụ: Auth, Product, Category, Cart, Order, Payment, Coupon, Review, Blog, Analytics. Các module đã có route rõ ràng; một số phần nâng cao đang ở trạng thái hoàn thiện.', { fontSize: 10.8, color: '334155', align: 'ctr' });
  s.footer(6);
  slides.push(s);
}

// 7. Source structure
{
  const s = new Slide('Cấu trúc source code');
  s.header('Cấu trúc source code', 'Tổ chức thư mục tách biệt frontend/backend, dễ bảo trì và mở rộng.');
  s.rect(0.8, 1.35, 5.65, 4.95, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
  s.text(1.05, 1.62, 5.15, 0.32, 'Backend', { fontSize: 17, bold: true, color: '0F172A' });
  s.text(1.05, 2.1, 5.05, 3.7, [
    'backend/',
    '  prisma/schema.prisma - mô hình dữ liệu',
    '  src/server.ts - Express server',
    '  src/routes - định tuyến REST API',
    '  src/controllers - xử lý nghiệp vụ',
    '  src/middleware - auth/authorization',
    '  src/utils - Prisma, JWT, password',
    '  data/local-db.json - dữ liệu local'
  ].join('\n'), { fontSize: 10.7, color: '334155', font: 'Consolas' });
  s.rect(6.85, 1.35, 5.65, 4.95, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
  s.text(7.1, 1.62, 5.15, 0.32, 'Frontend', { fontSize: 17, bold: true, color: '0F172A' });
  s.text(7.1, 2.1, 5.05, 3.7, [
    'frontend/',
    '  src/app - các trang Next.js',
    '  src/components - Navbar, ProductCard',
    '  src/stores - authStore, cartStore',
    '  src/lib - axios, utils',
    '  public/picture - ảnh sản phẩm',
    '  tailwind.config.ts - design system',
    '  .env.local - API URL'
  ].join('\n'), { fontSize: 10.7, color: '334155', font: 'Consolas' });
  s.footer(7);
  slides.push(s);
}

// 8. ER/Class diagram
{
  const s = new Slide('ER/Class Diagram rút gọn');
  s.header('ER/Class Diagram rút gọn', 'Mô hình dữ liệu chính được thiết kế trong Prisma schema.');
  addEntity(s, 0.55, 1.35, 1.6, 1.18, 'User', ['id', 'email', 'role', 'status'], '0EA5E9');
  addEntity(s, 2.55, 1.0, 1.7, 1.05, 'Address', ['userId', 'phone', 'province', 'isDefault'], '0EA5E9');
  addEntity(s, 2.55, 2.5, 1.7, 1.05, 'Cart', ['userId', 'items', 'updatedAt'], '14B8A6');
  addEntity(s, 4.7, 2.5, 1.85, 1.05, 'CartItem', ['cartId', 'productId', 'quantity', 'priceAtTime'], '14B8A6');
  addEntity(s, 7.05, 2.0, 1.9, 1.38, 'Product', ['categoryId', 'price', 'stock', 'careLevel', 'images'], 'F59E0B');
  addEntity(s, 9.55, 1.05, 1.75, 1.1, 'Category', ['name', 'slug', 'parentId'], 'F59E0B');
  addEntity(s, 2.55, 4.45, 1.75, 1.22, 'Order', ['userId', 'orderCode', 'total', 'status'], '6366F1');
  addEntity(s, 4.75, 4.45, 1.85, 1.05, 'OrderItem', ['orderId', 'productId', 'quantity', 'price'], '6366F1');
  addEntity(s, 7.05, 4.45, 1.75, 1.05, 'Payment', ['orderId', 'provider', 'status', 'paidAt'], '6366F1');
  addEntity(s, 9.55, 3.0, 1.75, 1.05, 'Review', ['userId', 'productId', 'rating', 'comment'], '10B981');
  addEntity(s, 11.25, 4.45, 1.45, 1.05, 'Coupon', ['code', 'type', 'value', 'active'], 'EF4444');
  addEntity(s, 11.25, 1.05, 1.45, 1.05, 'BlogPost', ['authorId', 'slug', 'status'], '10B981');
  const lines = [
    [2.15, 1.82, 2.55, 1.52], [1.35, 2.53, 2.55, 3.02],
    [4.25, 3.02, 4.7, 3.02], [6.55, 3.02, 7.05, 2.65],
    [8.95, 2.35, 9.55, 1.62], [1.65, 2.53, 2.55, 5.02],
    [4.3, 5.05, 4.75, 4.95], [6.6, 4.95, 7.05, 4.98],
    [6.6, 4.95, 7.05, 2.8], [8.95, 2.75, 9.55, 3.52],
    [2.15, 1.85, 9.55, 3.52], [2.15, 1.82, 11.25, 1.52]
  ];
  lines.forEach((l) => s.line(...l, { color: '94A3B8', width: 10160 }));
  s.footer(8);
  slides.push(s);
}

// 9. Frontend
{
  const s = new Slide('Frontend');
  s.header('Frontend', 'Giao diện Next.js 14 đáp ứng tiêu chí đủ màn hình chính, dễ thao tác, responsive và có kiểm tra nhập liệu cơ bản.');
  addCard(s, 0.75, 1.3, 3.7, 1.55, 'Công nghệ', '- Next.js 14 App Router\n- TypeScript\n- Tailwind CSS\n- Zustand\n- Framer Motion, Lucide icons', '0EA5E9');
  addCard(s, 4.8, 1.3, 3.7, 1.55, 'Màn hình chính', '- Home, Products, Detail\n- Cart, Checkout, Orders\n- Login/Register/Profile\n- Admin, Blog, Contact', '14B8A6');
  addCard(s, 8.85, 1.3, 3.7, 1.55, 'Trải nghiệm', '- Search/sort/filter sản phẩm\n- ProductCard có badge, rating\n- Loading states\n- Mobile/tablet/desktop', 'F59E0B');
  s.rect(0.75, 3.35, 11.8, 2.3, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
  s.text(1.0, 3.62, 11.3, 0.28, 'Luồng giao diện tiêu biểu', { fontSize: 15, bold: true, color: '0F172A' });
  const flow = [
    ['Trang chủ', 'Tìm kiếm / CTA', 'E0F2FE'],
    ['Danh sách SP', 'Lọc, sắp xếp', 'CCFBF1'],
    ['Chi tiết SP', 'Thông tin, đánh giá', 'FEF3C7'],
    ['Giỏ hàng', 'Cập nhật số lượng', 'FDE68A'],
    ['Checkout', 'Tạo đơn hàng', 'DBEAFE'],
    ['Đơn hàng', 'Theo dõi trạng thái', 'DCFCE7']
  ];
  flow.forEach((f, i) => {
    const x = 1.0 + i * 1.85;
    s.rect(x, 4.18, 1.45, 0.84, { fill: f[2], line: 'FFFFFF', round: true });
    s.text(x + 0.05, 4.3, 1.35, 0.18, f[0], { fontSize: 8.8, bold: true, color: '0F172A', align: 'ctr', padL: 0, padR: 0, padT: 0, padB: 0 });
    s.text(x + 0.05, 4.58, 1.35, 0.24, f[1], { fontSize: 7.3, color: '475569', align: 'ctr', padL: 0, padR: 0, padT: 0, padB: 0 });
    if (i < flow.length - 1) s.line(x + 1.45, 4.6, x + 1.83, 4.6, { color: '94A3B8', arrow: true, width: 12700 });
  });
  s.footer(9);
  slides.push(s);
}

// 10. Backend
{
  const s = new Slide('Backend và API');
  s.header('Backend và API', 'RESTful API dùng Express + TypeScript, có middleware bảo mật và phân quyền.');
  addCard(s, 0.75, 1.35, 3.75, 1.6, 'Core đã có', '- Auth: register, login, me, change password\n- Products: CRUD, search, filter, sort, pagination\n- Categories: CRUD, danh mục cha/con\n- Orders: tạo/xem đơn cơ bản', '14B8A6');
  addCard(s, 4.8, 1.35, 3.75, 1.6, 'Bảo mật & ổn định', '- JWT Authentication\n- Role-based admin access\n- bcrypt hash password\n- helmet, cors, rate-limit\n- Zod validation & error response', '0EA5E9');
  addCard(s, 8.85, 1.35, 3.75, 1.6, 'Module cần hoàn thiện', '- Cart API đồng bộ server\n- Payment VNPay/MoMo\n- Review/Coupon/Blog/Analytics\n- Upload ảnh sản phẩm\n- Kiểm thử tự động', 'F59E0B');
  s.rect(0.75, 3.42, 11.85, 2.25, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
  s.text(1.0, 3.66, 11.35, 0.28, 'Nhóm endpoint chính', { fontSize: 15, bold: true, color: '0F172A' });
  const endpoints = [
    ['Auth', 'POST /auth/register\nPOST /auth/login\nGET /auth/me', 'E0F2FE'],
    ['Products', 'GET /products\nPOST /products\nPUT/DELETE /products/:id', 'CCFBF1'],
    ['Categories', 'GET /categories\nPOST /categories\nPUT/DELETE /categories/:id', 'FEF3C7'],
    ['Orders', 'GET /orders\nGET /orders/:id\nPOST /orders', 'DBEAFE'],
    ['Future', 'Cart, Payment,\nReview, Coupon,\nAnalytics', 'FEE2E2']
  ];
  endpoints.forEach((e, i) => {
    const x = 1.0 + i * 2.25;
    s.rect(x, 4.18, 1.85, 1.02, { fill: e[2], line: 'FFFFFF', round: true });
    s.text(x + 0.08, 4.3, 1.69, 0.18, e[0], { fontSize: 9.3, bold: true, color: '0F172A', align: 'ctr', padL: 0, padR: 0, padT: 0, padB: 0 });
    s.text(x + 0.08, 4.58, 1.69, 0.42, e[1], { fontSize: 6.8, color: '334155', align: 'ctr', padL: 0, padR: 0, padT: 0, padB: 0 });
  });
  s.footer(10);
  slides.push(s);
}

// 11. Data flow
{
  const s = new Slide('Kết nối Frontend - Backend');
  s.header('Kết nối Frontend - Backend', 'Dữ liệu đi qua API thống nhất, phản hồi JSON success/data/message, token gửi trong Authorization header.');
  const flow = [
    ['1. UI Action', 'Search, login,\nadd cart, checkout', '0EA5E9'],
    ['2. State/Form', 'Zustand + form state\nvalidate cơ bản', '14B8A6'],
    ['3. API Request', 'fetch/Axios\nBearer JWT', '6366F1'],
    ['4. Controller', 'Xử lý nghiệp vụ\nCRUD/search/filter', 'F59E0B'],
    ['5. Data Store', 'Prisma/localStore\nPostgreSQL/local JSON', '10B981'],
    ['6. UI Update', 'Render data,\ntoast/loading/error', 'EF4444']
  ];
  flow.forEach((f, i) => {
    const x = 0.75 + i * 2.05;
    s.rect(x, 2.0, 1.58, 1.22, { fill: 'FFFFFF', line: f[2], round: true, lineWidth: 15240 });
    s.rect(x, 2.0, 1.58, 0.38, { fill: f[2], line: f[2], round: true, text: f[0], fontSize: 8.7, bold: true, color: 'FFFFFF', align: 'ctr', valign: 'mid', padL: 0, padR: 0 });
    s.text(x + 0.08, 2.52, 1.42, 0.42, f[1], { fontSize: 7.7, color: '334155', align: 'ctr', padL: 0, padR: 0 });
    if (i < flow.length - 1) s.line(x + 1.58, 2.61, x + 2.0, 2.61, { color: '64748B', arrow: true, width: 12700 });
  });
  addCard(s, 1.0, 4.15, 3.45, 1.2, 'Ví dụ: tìm sản phẩm', 'Products page gửi query search/sort/category tới GET /api/products, backend trả danh sách và pagination để UI render lưới sản phẩm.', '0EA5E9');
  addCard(s, 4.95, 4.15, 3.45, 1.2, 'Ví dụ: đặt hàng', 'Checkout gửi thông tin nhận hàng và items tới POST /api/orders; backend validate, tính tổng tiền và lưu đơn.', '14B8A6');
  addCard(s, 8.9, 4.15, 3.45, 1.2, 'Ví dụ: admin CRUD', 'Admin dùng token role ADMIN để tạo/cập nhật/xóa sản phẩm, danh mục và theo dõi dữ liệu quản trị.', 'F59E0B');
  s.footer(11);
  slides.push(s);
}

// 12. Testing
{
  const s = new Slide('Kiểm thử, sửa lỗi và triển khai');
  s.header('Kiểm thử, sửa lỗi và triển khai', 'Nội dung bám rubric: manual test chức năng chính, fix bug, cải thiện hệ thống và chuẩn bị deploy.');
  const checks = [
    ['Authentication', 'Đăng ký, đăng nhập, đổi mật khẩu, token hết hạn, quyền admin/customer'],
    ['Product flow', 'Danh sách, tìm kiếm, lọc, chi tiết, thêm giỏ, kiểm tra tồn kho'],
    ['Order flow', 'Checkout, tạo đơn, xem lịch sử, xử lý dữ liệu thiếu/sai'],
    ['Admin flow', 'CRUD sản phẩm/danh mục, cập nhật đơn, kiểm tra phân quyền'],
    ['Responsive UI', 'Mobile, tablet, desktop; form, navigation, trạng thái loading/error'],
    ['Deploy checklist', 'ENV, build FE/BE, database migration/seed, API URL, tài liệu cài đặt']
  ];
  checks.forEach((c, i) => {
    const x = 0.8 + (i % 2) * 6.0;
    const y = 1.35 + Math.floor(i / 2) * 1.55;
    s.rect(x, y, 5.55, 1.05, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
    s.rect(x + 0.18, y + 0.24, 0.36, 0.36, { fill: ['0EA5E9', '14B8A6', 'F59E0B', '6366F1', '10B981', 'EF4444'][i], line: 'none', round: true });
    s.text(x + 0.72, y + 0.18, 4.55, 0.22, c[0], { fontSize: 11.5, bold: true, color: '0F172A' });
    s.text(x + 0.72, y + 0.52, 4.55, 0.3, c[1], { fontSize: 8.4, color: '475569' });
  });
  s.footer(12);
  slides.push(s);
}

// 13. Team assignment
{
  const s = new Slide('Phân chia công việc');
  s.header('Phân chia công việc', 'Có thể thay “Thành viên” bằng tên thật của nhóm trước khi nộp.');
  const roles = [
    ['Thành viên 1', 'Phân tích yêu cầu, actor, use case, tài liệu báo cáo', '0EA5E9'],
    ['Thành viên 2', 'Thiết kế CSDL, Prisma schema, seed data, ER/Class diagram', '14B8A6'],
    ['Thành viên 3', 'Backend API, auth, CRUD sản phẩm/danh mục/đơn hàng, bảo mật', 'F59E0B'],
    ['Thành viên 4', 'Frontend UI, responsive, state management, kết nối API', '6366F1'],
    ['Cả nhóm', 'Manual test, fix bug, deploy, chuẩn bị demo và thuyết trình', '10B981']
  ];
  roles.forEach((r, i) => {
    const x = i < 3 ? 0.8 + i * 4.15 : 2.85 + (i - 3) * 4.15;
    const y = i < 3 ? 1.6 : 4.05;
    s.rect(x, y, 3.55, 1.38, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
    s.rect(x, y, 3.55, 0.42, { fill: r[2], line: r[2], round: true, text: r[0], fontSize: 11.5, bold: true, color: 'FFFFFF', align: 'ctr', valign: 'mid' });
    s.text(x + 0.18, y + 0.62, 3.2, 0.48, r[1], { fontSize: 9.4, color: '334155', align: 'ctr' });
  });
  s.footer(13);
  slides.push(s);
}

// 14. Conclusion
{
  const s = new Slide('Kết luận');
  s.header('Kết luận', 'AquaFish có nền tảng full-stack rõ ràng, phù hợp để demo và tiếp tục hoàn thiện các module nâng cao.');
  s.rect(0.85, 1.45, 11.65, 3.1, { fill: 'FFFFFF', line: 'D7E3EA', round: true });
  s.text(1.15, 1.8, 11.05, 0.35, 'Điểm nổi bật khi báo cáo', { fontSize: 20, bold: true, color: '0F172A', align: 'ctr' });
  s.text(1.35, 2.55, 10.55, 1.05, [
    '- Kiến trúc tách lớp: Frontend Next.js, Backend Express, Database Prisma/PostgreSQL',
    '- CSDL có đủ nhóm bảng cho thương mại điện tử: user, product, cart, order, payment, coupon, review, blog',
    '- API có auth, CRUD, tìm kiếm, lọc, phân trang, xử lý lỗi và bảo mật cơ bản',
    '- Giao diện có nhiều màn hình chính, responsive, có store giỏ hàng và kết nối API'
  ], { fontSize: 13, color: '334155', bullet: false });
  s.rect(2.1, 5.15, 9.15, 0.72, { fill: '0891B2', line: 'none', round: true, text: 'Demo đề xuất: Home → Products/Search → Product Detail → Cart → Checkout → Orders → Admin', fontSize: 13, bold: true, color: 'FFFFFF', align: 'ctr', valign: 'mid' });
  s.footer(14);
  slides.push(s);
}

function presentationXml() {
  const slideIds = slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="${NS.a}" xmlns:r="${NS.r}" xmlns:p="${NS.p}">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
  <p:sldIdLst>${slideIds}</p:sldIdLst>
  <p:sldSz cx="${W}" cy="${H}" type="wide"/>
  <p:notesSz cx="6858000" cy="9144000"/>
  <p:defaultTextStyle>
    <a:defPPr><a:defRPr lang="vi-VN"/></a:defPPr>
  </p:defaultTextStyle>
</p:presentation>`;
}

function presentationRelsXml() {
  const rels = [
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>',
    ...slides.map((_, i) => `<Relationship Id="rId${i + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`)
  ].join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels}</Relationships>`;
}

function contentTypesXml() {
  const slideOverrides = slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  ${slideOverrides}
</Types>`;
}

function rootRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

function slideMasterXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="${NS.a}" xmlns:r="${NS.r}" xmlns:p="${NS.p}">
  <p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
  <p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles>
</p:sldMaster>`;
}

function slideMasterRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`;
}

function slideLayoutXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="${NS.a}" xmlns:r="${NS.r}" xmlns:p="${NS.p}" type="blank" preserve="1">
  <p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sldLayout>`;
}

function slideLayoutRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`;
}

function themeXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="${NS.a}" name="AquaFish">
  <a:themeElements>
    <a:clrScheme name="AquaFish">
      <a:dk1><a:srgbClr val="0F172A"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="334155"/></a:dk2><a:lt2><a:srgbClr val="F8FAFC"/></a:lt2>
      <a:accent1><a:srgbClr val="0891B2"/></a:accent1><a:accent2><a:srgbClr val="14B8A6"/></a:accent2>
      <a:accent3><a:srgbClr val="F59E0B"/></a:accent3><a:accent4><a:srgbClr val="6366F1"/></a:accent4>
      <a:accent5><a:srgbClr val="10B981"/></a:accent5><a:accent6><a:srgbClr val="EF4444"/></a:accent6>
      <a:hlink><a:srgbClr val="0EA5E9"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="AquaFish">
      <a:majorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>
      <a:minorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="AquaFish">
      <a:fillStyleLst>
        <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
        <a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="90000"/><a:satMod val="105000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill>
        <a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="80000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill>
      </a:fillStyleLst>
      <a:lnStyleLst>
        <a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>
        <a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>
      </a:lnStyleLst>
      <a:effectStyleLst>
        <a:effectStyle><a:effectLst/></a:effectStyle>
        <a:effectStyle><a:effectLst/></a:effectStyle>
        <a:effectStyle><a:effectLst/></a:effectStyle>
      </a:effectStyleLst>
      <a:bgFillStyleLst>
        <a:solidFill><a:schemeClr val="phClr"/></a:solidFill>
        <a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/></a:schemeClr></a:solidFill>
        <a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="98000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill>
      </a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
</a:theme>`;
}

function coreXml() {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>AquaFish - Báo cáo cấu trúc hệ thống</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

function appXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex PPTX Generator</Application>
  <PresentationFormat>On-screen Show (16:9)</PresentationFormat>
  <Slides>${slides.length}</Slides>
</Properties>`;
}

const files = [
  { path: '[Content_Types].xml', data: contentTypesXml() },
  { path: '_rels/.rels', data: rootRelsXml() },
  { path: 'docProps/core.xml', data: coreXml() },
  { path: 'docProps/app.xml', data: appXml() },
  { path: 'ppt/presentation.xml', data: presentationXml() },
  { path: 'ppt/_rels/presentation.xml.rels', data: presentationRelsXml() },
  { path: 'ppt/slideMasters/slideMaster1.xml', data: slideMasterXml() },
  { path: 'ppt/slideMasters/_rels/slideMaster1.xml.rels', data: slideMasterRelsXml() },
  { path: 'ppt/slideLayouts/slideLayout1.xml', data: slideLayoutXml() },
  { path: 'ppt/slideLayouts/_rels/slideLayout1.xml.rels', data: slideLayoutRelsXml() },
  { path: 'ppt/theme/theme1.xml', data: themeXml() },
];

const addedMedia = new Map();
slides.forEach((slide, idx) => {
  files.push({ path: `ppt/slides/slide${idx + 1}.xml`, data: slide.xml() });
  files.push({ path: `ppt/slides/_rels/slide${idx + 1}.xml.rels`, data: slide.relsXml() });
  for (const rel of slide.rels) {
    if (!addedMedia.has(rel.mediaName)) {
      addedMedia.set(rel.mediaName, true);
      files.push({ path: `ppt/media/${rel.mediaName}`, data: fs.readFileSync(rel.source) });
    }
  }
});

fs.writeFileSync(OUT, createZip(files));
console.log(`Created ${OUT}`);
