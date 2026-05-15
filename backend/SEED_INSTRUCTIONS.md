# Hướng Dẫn Seed Database

## Bước 1: Đảm bảo backend server đã TẮT
```cmd
# Nếu backend đang chạy, nhấn Ctrl+C để tắt
```

## Bước 2: Reset database và chạy migration + seed
```cmd
cd backend
npx prisma migrate reset --force
```

Lệnh này sẽ:
1. Xóa toàn bộ database
2. Chạy lại tất cả migrations (tạo bảng)
3. Tự động chạy seed (thêm dữ liệu)

**Lưu ý**: Lệnh này có thể mất 1-2 phút, hãy đợi cho đến khi thấy:
```
✅ Admin user created
✅ Customer users created
✅ Categories created
✅ Products created: 36
✅ Reviews created
✅ Coupons created
✅ Blog posts created
🎉 Seed completed successfully!
```

## Bước 3: Nếu lệnh trên bị treo hoặc lỗi

### Cách 1: Chạy từng bước
```cmd
# Bước 3.1: Xóa database
npx prisma migrate reset --skip-seed

# Bước 3.2: Chạy seed riêng
npm run seed
```

### Cách 2: Chạy migration rồi seed
```cmd
# Bước 3.1: Chạy migration
npx prisma migrate deploy

# Bước 3.2: Generate Prisma Client
npx prisma generate

# Bước 3.3: Chạy seed
npm run seed
```

## Bước 4: Kiểm tra dữ liệu
```cmd
node check-data.js
```

Kết quả mong đợi:
```
=== DATABASE CHECK ===
Products: 36
Categories: 6
Users: 3
Blog Posts: 4

✅ Database has data!
```

## Bước 5: Khởi động lại backend
```cmd
npm run dev
```

## Bước 6: Kiểm tra frontend
1. Mở http://localhost:3000
2. Vào trang Products - sẽ thấy 36 sản phẩm
3. Vào trang Categories - sẽ thấy 6 danh mục
4. Vào trang Blog - sẽ thấy 4 bài viết

## Nếu vẫn gặp lỗi

### Lỗi: "The table `public.products` does not exist"
→ Migration chưa chạy, chạy lại: `npx prisma migrate deploy`

### Lỗi: "EPERM: operation not permitted"
→ Backend server đang chạy, tắt nó đi rồi chạy lại

### Lỗi: Seed chạy nhưng không có output
→ Có thể có lỗi trong seed.ts, kiểm tra bằng: `npm run seed 2>&1`

### Lỗi: Connection timeout
→ Kiểm tra DATABASE_URL trong .env có đúng không
