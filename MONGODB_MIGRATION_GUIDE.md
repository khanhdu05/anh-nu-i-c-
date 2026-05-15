# 🍃 HƯỚNG DẪN CHUYỂN SANG MONGODB

## ⚠️ Lưu ý quan trọng

Dự án hiện tại được thiết kế cho **PostgreSQL** (relational database). Nếu muốn chuyển sang MongoDB (NoSQL), cần:

1. Thay đổi Prisma schema
2. Thay đổi cách query
3. Thay đổi relationships
4. Re-seed data

## 🔄 Cách chuyển đổi

### Bước 1: Cài đặt MongoDB

**Option A: MongoDB Local**
```bash
# Download MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Hoặc dùng Docker
docker run --name aquafish-mongo -p 27017:27017 -d mongo
```

**Option B: MongoDB Atlas (Cloud - Free)**
```bash
# 1. Tạo account tại https://www.mongodb.com/cloud/atlas
# 2. Tạo free cluster
# 3. Copy connection string
```

### Bước 2: Cập nhật Prisma Schema

Thay đổi `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// MongoDB requires @id with @default(auto()) @map("_id") @db.ObjectId
model User {
  id           String      @id @default(auto()) @map("_id") @db.ObjectId
  email        String      @unique
  passwordHash String
  fullName     String
  phone        String?
  avatar       String?
  role         UserRole    @default(CUSTOMER)
  status       UserStatus  @default(ACTIVE)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  // Relations - MongoDB style
  addressIds   String[]    @db.ObjectId
  addresses    Address[]   @relation(fields: [addressIds], references: [id])
  
  cartId       String?     @db.ObjectId
  cart         Cart?       @relation(fields: [cartId], references: [id])
  
  orderIds     String[]    @db.ObjectId
  orders       Order[]     @relation(fields: [orderIds], references: [id])
  
  reviewIds    String[]    @db.ObjectId
  reviews      Review[]    @relation(fields: [reviewIds], references: [id])
  
  blogPostIds  String[]    @db.ObjectId
  blogPosts    BlogPost[]  @relation(fields: [blogPostIds], references: [id])

  @@map("users")
}

model Product {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  slug        String    @unique
  description String?
  price       Float
  salePrice   Float?
  stock       Int       @default(0)
  
  categoryId  String    @db.ObjectId
  category    Category  @relation(fields: [categoryId], references: [id])
  
  images      String[]
  
  // Fish-specific fields
  speciesName      String?
  size             String?
  lifespan         String?
  waterTemperature String?
  phLevel          String?
  foodType         String?
  careLevel        CareLevel?
  compatibility    String?
  
  isFeatured Boolean  @default(false)
  isActive   Boolean  @default(true)
  soldCount  Int      @default(0)
  viewCount  Int      @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("products")
}

// ... Các models khác tương tự
```

### Bước 3: Cập nhật .env

```env
# MongoDB Connection String
DATABASE_URL="mongodb://localhost:27017/aquafish"

# Hoặc MongoDB Atlas
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/aquafish?retryWrites=true&w=majority"
```

### Bước 4: Chạy lại migration

```bash
cd backend

# Xóa migrations cũ
rm -rf prisma/migrations

# Generate Prisma Client mới
npx prisma generate

# Push schema to MongoDB
npx prisma db push

# Seed data
npx prisma db seed
```

### Bước 5: Cập nhật queries

MongoDB với Prisma có một số khác biệt:

```typescript
// PostgreSQL (hiện tại)
const products = await prisma.product.findMany({
  where: {
    name: { contains: 'betta', mode: 'insensitive' }
  }
});

// MongoDB (cần thay đổi)
const products = await prisma.product.findMany({
  where: {
    name: { contains: 'betta' } // MongoDB case-sensitive by default
  }
});
```

## 🤔 Nên dùng PostgreSQL hay MongoDB?

### Dùng PostgreSQL khi:
✅ E-commerce với transactions phức tạp
✅ Cần ACID compliance
✅ Có nhiều relationships
✅ Cần JOIN queries
✅ Data có structure rõ ràng

### Dùng MongoDB khi:
✅ Cần flexibility trong schema
✅ Data không có structure cố định
✅ Cần scale horizontal dễ dàng
✅ Làm việc với JSON documents
✅ Real-time applications

## 💡 Khuyến nghị

**Cho dự án AquaFish, tôi khuyên dùng PostgreSQL vì:**

1. ✅ E-commerce cần transactions
2. ✅ Có nhiều relationships (User-Order-Product)
3. ✅ Schema rõ ràng, ít thay đổi
4. ✅ Prisma hoạt động tốt hơn với PostgreSQL
5. ✅ Đã setup xong, không cần thay đổi

## 🚀 Cách setup PostgreSQL nhanh

### Option 1: Supabase (Recommended - Free)

1. Truy cập https://supabase.com
2. Tạo account
3. New Project
4. Copy connection string
5. Paste vào `.env`:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

### Option 2: Railway (Free $5 credit)

1. Truy cập https://railway.app
2. New Project → Provision PostgreSQL
3. Copy connection string
4. Paste vào `.env`

### Option 3: Neon (Free tier)

1. Truy cập https://neon.tech
2. Sign up
3. Create project
4. Copy connection string
5. Paste vào `.env`

## ✅ Kết luận

**Không cần MongoDB!** Dùng PostgreSQL với một trong các cloud providers trên là đủ và tốt hơn cho dự án này.

Nếu vẫn muốn dùng MongoDB, follow guide trên, nhưng tôi **strongly recommend** giữ PostgreSQL.
