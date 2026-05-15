# SỬA LỖI DATABASE - KHÔNG CÓ BẢNG

## Vấn đề
Database không có bảng nào vì chưa chạy migration lần đầu.

## Giải pháp

### Bước 1: Tắt tất cả terminal đang chạy backend/frontend

### Bước 2: Chạy lệnh tạo migration lần đầu
```cmd
cd backend
npx prisma migrate dev --name init
```

**Lưu ý**: Lệnh này sẽ:
1. Tạo thư mục `prisma/migrations`
2. Tạo file migration SQL
3. Chạy migration (tạo tất cả bảng)
4. Tự động chạy seed (thêm dữ liệu)

**Nếu lệnh bị treo quá 2 phút**, nhấn Ctrl+C và thử cách khác bên dưới.

---

## Cách khác: Tạo migration thủ công

### Bước 1: Tạo migration file
```cmd
cd backend
npx prisma migrate dev --name init --create-only
```

### Bước 2: Áp dụng migration
```cmd
npx prisma migrate deploy
```

### Bước 3: Generate Prisma Client
```cmd
npx prisma generate
```

### Bước 4: Chạy seed
```cmd
npm run seed
```

---

## Nếu vẫn bị treo

Có thể do kết nối Supabase bị chậm hoặc timeout. Hãy thử:

### Kiểm tra kết nối
```cmd
npx prisma db pull
```

Nếu lệnh này cũng bị treo, có thể:
1. Supabase đang bảo trì
2. Connection string sai
3. Firewall chặn kết nối

### Kiểm tra DATABASE_URL
Mở file `.env` và kiểm tra:
```
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

Đảm bảo:
- Password đúng
- Không có khoảng trắng thừa
- Có `?pgbouncer=true` ở cuối
