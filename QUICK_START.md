# 🚀 Quick Start Guide

## Cài đặt nhanh trong 5 phút

### Bước 1: Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/AquaFish.git
cd AquaFish

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### Bước 2: Setup Database (Supabase)

1. Vào https://supabase.com → Tạo project mới
2. Settings → Database → Connection String
3. Copy **Connection Pooling** string
4. Đổi port `6543` → `5432`

### Bước 3: Configure Backend

```bash
cd backend
copy .env.example .env
```

Sửa file `.env`:
```env
PORT=5001
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET=aquafish-super-secret-key-2024
```

### Bước 4: Setup Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed data
npm run seed
```

### Bước 5: Configure Frontend

```bash
cd ../frontend
copy .env.example .env.local
```

Sửa file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Bước 6: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Bước 7: Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### Đăng nhập

**Admin:**
- Email: admin@aquafish.com
- Password: admin123

**Customer:**
- Email: customer@example.com
- Password: customer123

---

## ✅ Checklist

- [ ] Node.js 18+ đã cài
- [ ] Git đã cài
- [ ] Supabase account đã tạo
- [ ] Backend dependencies đã install
- [ ] Frontend dependencies đã install
- [ ] Database đã migrate
- [ ] Database đã seed
- [ ] Backend đang chạy (port 5001)
- [ ] Frontend đang chạy (port 3000)
- [ ] Đăng nhập thành công

---

## 🐛 Lỗi thường gặp

### "Port already in use"
```bash
netstat -ano | findstr :5001
taskkill /F /PID <PID>
```

### "Cannot connect to database"
- Kiểm tra DATABASE_URL
- Đảm bảo dùng port 5432 (không phải 6543)

### "No products showing"
- Chạy: `npm run seed` trong thư mục backend
- Restart backend server

### "Login failed"
- Kiểm tra backend đang chạy
- Kiểm tra NEXT_PUBLIC_API_URL trong .env.local
- Clear browser cache (Ctrl+Shift+Delete)
