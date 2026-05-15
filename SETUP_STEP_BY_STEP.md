# 🚀 HƯỚNG DẪN SETUP TỪNG BƯỚC

## ✅ Đã hoàn thành:
- [x] Cài Node.js
- [x] Cài dependencies
- [x] Backend đang chạy tại http://localhost:5000

## 📝 Bước tiếp theo:

---

## BƯỚC 1: SETUP SUPABASE (5 phút)

### 1.1. Tạo tài khoản Supabase

1. Mở browser, vào: **https://supabase.com**
2. Click **"Start your project"**
3. Click **"Sign in with GitHub"** (hoặc email)
4. Đăng nhập GitHub và cho phép

### 1.2. Tạo Project

1. Click **"New Project"**
2. Chọn Organization (hoặc tạo mới nếu lần đầu)
3. Điền thông tin:
   - **Name**: `aquafish`
   - **Database Password**: Tạo password mạnh (VD: `AquaFish2024!`)
   - **Region**: Chọn `Southeast Asia (Singapore)`
   - **Pricing Plan**: Free (đã chọn sẵn)
4. Click **"Create new project"**
5. **Đợi 2-3 phút** để Supabase setup database

### 1.3. Lấy Connection String

1. Sau khi project được tạo, click **Settings** (icon bánh răng bên trái)
2. Click **Database** trong menu
3. Scroll xuống phần **"Connection string"**
4. Chọn tab **"URI"**
5. Copy connection string (dạng: `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@...`)

**Ví dụ connection string:**
```
postgresql://postgres.abcdefghijk:AquaFish2024!@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

6. **LƯU LẠI** connection string này!

---

## BƯỚC 2: CẬP NHẬT DATABASE_URL

### 2.1. Mở file `.env`

Mở file `backend/.env` (đã có sẵn)

### 2.2. Thay đổi DATABASE_URL

Tìm dòng:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/aquafish"
```

Thay bằng connection string từ Supabase:
```env
DATABASE_URL="postgresql://postgres.abcdefghijk:AquaFish2024!@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### 2.3. Save file

Nhấn `Ctrl + S` để lưu

---

## BƯỚC 3: CHẠY MIGRATION

Migration sẽ tạo tất cả tables trong database.

### 3.1. Mở PowerShell mới

Mở PowerShell mới (giữ cái cũ đang chạy server)

### 3.2. Di chuyển vào folder backend

```powershell
cd C:\Users\Administrator\Downloads\AquaFish\backend
```

### 3.3. Chạy migration

```powershell
npx prisma migrate dev --name init
```

**Bạn sẽ thấy:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "postgres"

Applying migration `20240101000000_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240101000000_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client
```

### 3.4. Kiểm tra trên Supabase

1. Quay lại Supabase Dashboard
2. Click **"Table Editor"** (bên trái)
3. Bạn sẽ thấy các tables: `users`, `products`, `categories`, etc.

✅ **Migration thành công!**

---

## BƯỚC 4: SEED DATA MẪU

Seed sẽ tạo data mẫu: admin user, customer user, categories, products.

### 4.1. Chạy seed

```powershell
npx prisma db seed
```

**Hoặc:**
```powershell
npm run seed
```

**Bạn sẽ thấy:**
```
🌱 Starting seed...
✅ Admin user created
✅ Customer user created
✅ Categories created
✅ Products created
✅ Reviews created
✅ Coupon created
🎉 Seed completed successfully!

📝 Login credentials:
Admin: admin@aquafish.com / admin123
Customer: customer@example.com / customer123
```

### 4.2. Kiểm tra data

1. Quay lại Supabase Dashboard
2. Click **"Table Editor"**
3. Click vào table `users` → Thấy 2 users
4. Click vào table `products` → Thấy 10+ sản phẩm
5. Click vào table `categories` → Thấy 6 categories

✅ **Seed thành công!**

---

## BƯỚC 5: TEST API

### 5.1. Test API root

Mở browser: **http://localhost:5000**

Bạn sẽ thấy:
```json
{
  "message": "Welcome to AquaFish API 🐠",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "auth": "/api/auth",
    "products": "/api/products",
    ...
  }
}
```

### 5.2. Test Login API

Mở browser: **http://localhost:5000/api/auth/login**

Hoặc dùng PowerShell:
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@aquafish.com\",\"password\":\"admin123\"}'
```

### 5.3. Test Products API

Mở browser: **http://localhost:5000/api/products**

Bạn sẽ thấy danh sách sản phẩm!

✅ **API hoạt động!**

---

## BƯỚC 6: CHẠY FRONTEND

### 6.1. Mở PowerShell mới

Mở PowerShell thứ 3 (giữ 2 cái cũ)

### 6.2. Di chuyển vào folder frontend

```powershell
cd C:\Users\Administrator\Downloads\AquaFish\frontend
```

### 6.3. Cài dependencies

```powershell
npm install
```

### 6.4. Tạo file .env.local

```powershell
Copy-Item .env.example .env.local
```

### 6.5. Chạy frontend

```powershell
npm run dev
```

**Bạn sẽ thấy:**
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

### 6.6. Mở website

Mở browser: **http://localhost:3000**

Bạn sẽ thấy trang chủ AquaFish đẹp! 🎉

---

## ✅ HOÀN TẤT!

Bây giờ bạn có:

✅ **Backend API**: http://localhost:5000
✅ **Frontend Website**: http://localhost:3000
✅ **Database**: Supabase (cloud)
✅ **Data mẫu**: Admin, Customer, Products

---

## 🔑 TÀI KHOẢN TEST

### Admin
- Email: `admin@aquafish.com`
- Password: `admin123`

### Customer
- Email: `customer@example.com`
- Password: `customer123`

---

## 📊 XEM DATA TRÊN SUPABASE

1. Vào Supabase Dashboard
2. Click **"Table Editor"**
3. Xem các tables:
   - `users` - 2 users
   - `products` - 10+ sản phẩm cá cảnh
   - `categories` - 6 danh mục
   - `reviews` - Đánh giá mẫu
   - `coupons` - Mã giảm giá

---

## 🎯 BƯỚC TIẾP THEO

1. **Khám phá website** tại http://localhost:3000
2. **Test đăng nhập** với tài khoản admin/customer
3. **Xem sản phẩm** đã được seed
4. **Đọc documentation** để tiếp tục phát triển

---

## 🆘 XỬ LÝ LỖI

### Lỗi: "Can't reach database server"

**Nguyên nhân:** Connection string sai hoặc mạng bị chặn

**Giải pháp:**
1. Kiểm tra lại connection string trong `.env`
2. Kiểm tra password có đúng không
3. Thử đổi mạng (4G thay vì WiFi)

### Lỗi: "Migration failed"

**Nguyên nhân:** Database đã có tables

**Giải pháp:**
```powershell
npx prisma migrate reset
npx prisma migrate dev --name init
npx prisma db seed
```

### Lỗi: "Port already in use"

**Giải pháp:**
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

---

## 💾 LƯU CODE LÊN GITHUB

Để code không bị mất:

```powershell
cd C:\Users\Administrator\Downloads\AquaFish

git init
git add .
git commit -m "Initial commit - AquaFish project"

# Tạo repo trên github.com rồi:
git remote add origin https://github.com/YOUR_USERNAME/aquafish.git
git push -u origin main
```

**LƯU Ý:** File `.env` sẽ KHÔNG được push lên GitHub (đã có trong .gitignore)

**Lưu connection string** vào:
- Google Keep
- Notion
- Note trên điện thoại

---

## 🎉 CHÚC MỪNG!

Bạn đã setup thành công AquaFish! 🚀

**Giờ bạn có thể:**
- ✅ Phát triển thêm tính năng
- ✅ Customize giao diện
- ✅ Deploy lên production
- ✅ Chia sẻ với bạn bè

---

**Happy Coding! 🐠**
