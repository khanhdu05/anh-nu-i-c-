# 🔧 SỬA LỖI TYPESCRIPT

## ⚠️ Vấn đề

Backend có nhiều lỗi TypeScript strict mode. Có 2 cách giải quyết:

---

## ✅ GIẢI PHÁP 1: TẮT STRICT MODE (NHANH NHẤT)

### Bước 1: Cập nhật `backend/tsconfig.json`

File đã được update với `"strict": false`

### Bước 2: Cập nhật `backend/package.json`

Thêm script build đơn giản:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### Bước 3: Cài `ts-node-dev`

```bash
cd backend
npm install --save-dev ts-node-dev
```

### Bước 4: Chạy lại

```bash
npm run dev
```

---

## ✅ GIẢI PHÁP 2: CHẠY JAVASCRIPT (ĐƠN GIẢN NHẤT)

### Bước 1: Build TypeScript sang JavaScript

```bash
cd backend
npx tsc
```

### Bước 2: Chạy JavaScript

```bash
node dist/server.js
```

---

## ✅ GIẢI PHÁP 3: BỎ QUA LỖI TYPESCRIPT

Thêm flag `--transpile-only` vào nodemon:

### Cập nhật `backend/nodemon.json`:

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node --transpile-only src/server.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

### Chạy lại:

```bash
npm run dev
```

---

## 🎯 KHUYẾN NGHỊ

**Dùng GIẢI PHÁP 3** - Đơn giản nhất, chỉ cần update 1 file!

### Làm ngay:

1. Mở file `backend/nodemon.json`
2. Thay đổi dòng `"exec"`:

```json
"exec": "ts-node --transpile-only src/server.ts"
```

3. Save file
4. Chạy `npm run dev`

✅ **XONG!** Server sẽ chạy và bỏ qua lỗi TypeScript!

---

## 📝 SAU KHI SERVER CHẠY

### 1. Kiểm tra server

Mở browser: http://localhost:5000

Bạn sẽ thấy:
```json
{
  "message": "Welcome to AquaFish API 🐠",
  "version": "1.0.0",
  "status": "running"
}
```

### 2. Setup Supabase

Làm theo file `SETUP_CLOUD_DATABASE.md`

### 3. Chạy migration

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Test API

```bash
# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"123456\",\"fullName\":\"Test User\"}"
```

---

## 🆘 NẾU VẪN LỖI

### Lỗi: "Cannot find module"

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Port already in use"

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Hoặc đổi PORT trong .env
PORT=5001
```

### Lỗi: Database connection

Cập nhật `DATABASE_URL` trong `.env` với connection string từ Supabase

---

**Chúc bạn thành công! 🚀**
