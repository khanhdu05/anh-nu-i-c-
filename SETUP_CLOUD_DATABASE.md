# ☁️ HƯỚNG DẪN SETUP DATABASE TRÊN CLOUD (CHO MÁY NET)

## 🎯 Vấn đề

Bạn đang dùng máy net → Tắt máy = mất dữ liệu
→ **Giải pháp: Dùng Cloud Database (MIỄN PHÍ)**

---

## ⭐ OPTION 1: SUPABASE (RECOMMENDED)

### ✅ Ưu điểm
- 🆓 **Miễn phí mãi mãi** (500MB database)
- ☁️ Dữ liệu lưu trên cloud
- 🔒 Bảo mật cao
- 🚀 Nhanh, ổn định
- 📊 Có GUI để xem data
- 🌍 Truy cập từ bất kỳ đâu

### 📝 Hướng dẫn chi tiết (5 phút)

#### Bước 1: Tạo tài khoản Supabase

1. Truy cập: **https://supabase.com**
2. Click **"Start your project"**
3. Sign up bằng **GitHub** (hoặc email)
4. Xác nhận email (nếu dùng email)

#### Bước 2: Tạo Project

1. Click **"New Project"**
2. Chọn Organization (hoặc tạo mới)
3. Điền thông tin:
   - **Name**: `aquafish`
   - **Database Password**: Tạo password mạnh (LƯU LẠI!)
   - **Region**: Chọn `Southeast Asia (Singapore)` (gần VN nhất)
   - **Pricing Plan**: Free (đã chọn sẵn)
4. Click **"Create new project"**
5. Đợi 2-3 phút để setup

#### Bước 3: Lấy Connection String

1. Vào project vừa tạo
2. Click **Settings** (icon bánh răng bên trái)
3. Click **Database**
4. Scroll xuống phần **"Connection string"**
5. Chọn tab **"URI"**
6. Copy connection string (dạng: `postgresql://postgres:[YOUR-PASSWORD]@...`)
7. Thay `[YOUR-PASSWORD]` bằng password bạn đã tạo ở bước 2

**Ví dụ:**
```
postgresql://postgres:MyPassword123@db.abcdefghijk.supabase.co:5432/postgres
```

#### Bước 4: Cập nhật Backend

1. Mở file `backend/.env`
2. Thay đổi `DATABASE_URL`:

```env
# Thay dòng này
DATABASE_URL="postgresql://user:password@localhost:5432/aquafish"

# Thành connection string từ Supabase
DATABASE_URL="postgresql://postgres:MyPassword123@db.abcdefghijk.supabase.co:5432/postgres"
```

3. Lưu file

#### Bước 5: Chạy Migration

```bash
# Mở terminal trong folder backend
cd backend

# Chạy migration để tạo tables
npx prisma migrate dev --name init

# Seed data mẫu
npx prisma db seed

# Khởi động backend
npm run dev
```

#### Bước 6: Kiểm tra dữ liệu

1. Quay lại Supabase Dashboard
2. Click **"Table Editor"** (bên trái)
3. Bạn sẽ thấy các tables: users, products, categories, etc.
4. Click vào từng table để xem data

✅ **XONG!** Dữ liệu giờ lưu trên cloud, tắt máy vẫn còn!

---

## 🔄 OPTION 2: RAILWAY (Có $5 credit miễn phí)

### 📝 Hướng dẫn

#### Bước 1: Tạo tài khoản

1. Truy cập: **https://railway.app**
2. Click **"Login"**
3. Sign in bằng **GitHub**

#### Bước 2: Tạo PostgreSQL Database

1. Click **"New Project"**
2. Click **"Provision PostgreSQL"**
3. Đợi vài giây

#### Bước 3: Lấy Connection String

1. Click vào PostgreSQL service vừa tạo
2. Click tab **"Variables"**
3. Copy giá trị của **"DATABASE_URL"**

#### Bước 4: Cập nhật Backend

Paste connection string vào `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"
```

#### Bước 5: Chạy Migration

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

✅ **XONG!**

---

## 🌟 OPTION 3: NEON (Miễn phí)

### 📝 Hướng dẫn

#### Bước 1: Tạo tài khoản

1. Truy cập: **https://neon.tech**
2. Click **"Sign Up"**
3. Sign up bằng **GitHub**

#### Bước 2: Tạo Project

1. Click **"Create a project"**
2. Chọn region: **AWS / Singapore**
3. Đặt tên: `aquafish`
4. Click **"Create project"**

#### Bước 3: Lấy Connection String

1. Copy **"Connection string"** hiển thị
2. Nó có dạng: `postgresql://username:password@ep-xxx.aws.neon.tech/neondb`

#### Bước 4: Cập nhật Backend

```env
DATABASE_URL="postgresql://username:password@ep-xxx.aws.neon.tech/neondb"
```

#### Bước 5: Chạy Migration

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

✅ **XONG!**

---

## 📊 SO SÁNH

| Feature | Supabase | Railway | Neon |
|---------|----------|---------|------|
| **Miễn phí** | ✅ Mãi mãi | ⚠️ $5 credit | ✅ Mãi mãi |
| **Storage** | 500MB | 1GB | 512MB |
| **GUI** | ✅ Rất đẹp | ❌ Không | ⚠️ Cơ bản |
| **Region VN** | 🇸🇬 Singapore | 🇺🇸 US | 🇸🇬 Singapore |
| **Dễ dùng** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**→ Khuyến nghị: SUPABASE** ⭐

---

## 💾 LƯU CODE LÊN GITHUB

Để code không bị mất khi tắt máy:

### Bước 1: Tạo GitHub Repository

1. Truy cập: **https://github.com**
2. Sign in (hoặc Sign up)
3. Click **"New repository"**
4. Đặt tên: `aquafish`
5. Chọn **Private** (nếu không muốn public)
6. Click **"Create repository"**

### Bước 2: Push code lên GitHub

```bash
# Trong folder aquafish
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aquafish.git
git push -u origin main
```

### Bước 3: Lần sau vào máy net khác

```bash
# Clone code về
git clone https://github.com/YOUR_USERNAME/aquafish.git
cd aquafish

# Cài dependencies
cd backend && npm install
cd ../frontend && npm install

# Tạo file .env với connection string từ Supabase
# Chạy project
cd backend && npm run dev
cd ../frontend && npm run dev
```

---

## 🔐 BẢO MẬT

### ⚠️ QUAN TRỌNG: Không commit .env lên GitHub!

File `.gitignore` đã có sẵn để bảo vệ:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 💡 Cách lưu .env an toàn

**Option 1: Lưu vào file riêng (không push lên GitHub)**

Tạo file `CREDENTIALS.txt` (local only):
```
SUPABASE_DATABASE_URL=postgresql://postgres:password@...
JWT_SECRET=your-secret-key
CLOUDINARY_API_KEY=...
```

**Option 2: Lưu vào GitHub Secrets (nếu dùng GitHub Actions)**

1. Vào repository → Settings → Secrets
2. Add secrets: DATABASE_URL, JWT_SECRET, etc.

**Option 3: Lưu vào note app (Google Keep, Notion)**

Copy toàn bộ nội dung file `.env` vào note app để dùng lại.

---

## ✅ CHECKLIST

- [ ] Tạo tài khoản Supabase
- [ ] Tạo project trên Supabase
- [ ] Copy connection string
- [ ] Cập nhật `backend/.env`
- [ ] Chạy `npx prisma migrate dev`
- [ ] Chạy `npx prisma db seed`
- [ ] Kiểm tra data trên Supabase Dashboard
- [ ] Tạo GitHub repository
- [ ] Push code lên GitHub
- [ ] Lưu file .env vào nơi an toàn

---

## 🎉 KẾT QUẢ

✅ **Database trên cloud** → Tắt máy vẫn còn data
✅ **Code trên GitHub** → Vào máy nào cũng được
✅ **Miễn phí 100%** → Không tốn tiền
✅ **Truy cập mọi lúc** → Từ bất kỳ đâu

---

## 🆘 XỬ LÝ LỖI

### Lỗi: "Can't reach database server"

**Nguyên nhân:** Connection string sai hoặc mạng bị chặn

**Giải pháp:**
1. Kiểm tra connection string
2. Thử đổi mạng (4G thay vì WiFi quán net)
3. Kiểm tra firewall

### Lỗi: "Authentication failed"

**Nguyên nhân:** Password sai

**Giải pháp:**
1. Kiểm tra lại password trong connection string
2. Reset password trên Supabase Dashboard

### Lỗi: "Migration failed"

**Nguyên nhân:** Database đã có tables

**Giải pháp:**
```bash
# Reset database
npx prisma migrate reset

# Chạy lại
npx prisma migrate dev
npx prisma db seed
```

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Check Supabase Dashboard → Logs
2. Check terminal errors
3. Google error message
4. Ask ChatGPT/Claude

---

**Chúc bạn setup thành công! 🚀**
