# 📡 AQUAFISH API DOCUMENTATION

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

Tất cả các protected endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

---

## 👤 Authentication Endpoints

### 1. Register
Đăng ký tài khoản mới

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phone": "0987654321"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "phone": "0987654321",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

### 2. Login
Đăng nhập

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "role": "CUSTOMER"
    },
    "token": "jwt-token"
  }
}
```

### 3. Get Current User
Lấy thông tin user hiện tại

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0987654321",
    "avatar": "url",
    "role": "CUSTOMER",
    "status": "ACTIVE"
  }
}
```

### 4. Change Password
Đổi mật khẩu

**Endpoint:** `POST /auth/change-password`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 📦 Product Endpoints

### 1. Get All Products
Lấy danh sách sản phẩm với filter, search, pagination

**Endpoint:** `GET /products`

**Query Parameters:**
- `page` (number, default: 1) - Trang hiện tại
- `limit` (number, default: 12) - Số sản phẩm mỗi trang
- `search` (string) - Tìm kiếm theo tên, mô tả
- `categoryId` (uuid) - Lọc theo danh mục
- `minPrice` (number) - Giá tối thiểu
- `maxPrice` (number) - Giá tối đa
- `careLevel` (EASY|MODERATE|DIFFICULT|EXPERT) - Độ khó chăm sóc
- `isFeatured` (boolean) - Sản phẩm nổi bật
- `isActive` (boolean, default: true) - Sản phẩm đang hoạt động
- `sortBy` (createdAt|price|soldCount|viewCount) - Sắp xếp theo
- `sortOrder` (asc|desc, default: desc) - Thứ tự sắp xếp

**Example:**
```
GET /products?page=1&limit=12&search=betta&categoryId=xxx&minPrice=100000&maxPrice=500000&sortBy=price&sortOrder=asc
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Cá Betta Halfmoon",
        "slug": "ca-betta-halfmoon",
        "description": "Mô tả sản phẩm",
        "price": 150000,
        "salePrice": 120000,
        "stock": 50,
        "images": ["url1", "url2"],
        "speciesName": "Betta splendens",
        "size": "5-7cm",
        "lifespan": "2-3 năm",
        "waterTemperature": "24-28°C",
        "phLevel": "6.5-7.5",
        "foodType": "Ăn tạp",
        "careLevel": "EASY",
        "compatibility": "Nuôi đơn độc",
        "isFeatured": true,
        "isActive": true,
        "category": {
          "id": "uuid",
          "name": "Cá Cảnh",
          "slug": "ca-canh"
        },
        "averageRating": 4.5,
        "reviewCount": 10,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "totalPages": 9
    }
  }
}
```

### 2. Get Single Product
Lấy chi tiết sản phẩm

**Endpoint:** `GET /products/:identifier`

**Parameters:**
- `identifier` - Product ID hoặc slug

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Cá Betta Halfmoon",
    "slug": "ca-betta-halfmoon",
    "description": "Mô tả chi tiết",
    "price": 150000,
    "salePrice": 120000,
    "stock": 50,
    "images": ["url1", "url2"],
    "speciesName": "Betta splendens",
    "size": "5-7cm",
    "lifespan": "2-3 năm",
    "waterTemperature": "24-28°C",
    "phLevel": "6.5-7.5",
    "foodType": "Ăn tạp",
    "careLevel": "EASY",
    "compatibility": "Nuôi đơn độc",
    "category": {
      "id": "uuid",
      "name": "Cá Cảnh",
      "slug": "ca-canh"
    },
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Cá rất đẹp!",
        "images": [],
        "user": {
          "id": "uuid",
          "fullName": "Nguyễn Văn A",
          "avatar": "url"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "averageRating": 4.5,
    "reviewCount": 10
  }
}
```

### 3. Create Product (Admin)
Tạo sản phẩm mới

**Endpoint:** `POST /products`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "Cá Betta Halfmoon",
  "slug": "ca-betta-halfmoon",
  "description": "Mô tả sản phẩm",
  "price": 150000,
  "salePrice": 120000,
  "stock": 50,
  "categoryId": "uuid",
  "images": ["url1", "url2"],
  "speciesName": "Betta splendens",
  "size": "5-7cm",
  "lifespan": "2-3 năm",
  "waterTemperature": "24-28°C",
  "phLevel": "6.5-7.5",
  "foodType": "Ăn tạp",
  "careLevel": "EASY",
  "compatibility": "Nuôi đơn độc",
  "isFeatured": true,
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "Cá Betta Halfmoon",
    ...
  }
}
```

### 4. Update Product (Admin)
Cập nhật sản phẩm

**Endpoint:** `PUT /products/:id`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:** (Tương tự Create, tất cả fields đều optional)

**Response:** `200 OK`

### 5. Delete Product (Admin)
Xóa sản phẩm

**Endpoint:** `DELETE /products/:id`

**Headers:** `Authorization: Bearer <admin-token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 6. Get Related Products
Lấy sản phẩm liên quan

**Endpoint:** `GET /products/:id/related`

**Query Parameters:**
- `limit` (number, default: 4) - Số sản phẩm

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Sản phẩm liên quan",
      ...
    }
  ]
}
```

---

## 📂 Category Endpoints

### 1. Get All Categories
Lấy danh sách danh mục

**Endpoint:** `GET /categories`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cá Cảnh",
      "slug": "ca-canh",
      "description": "Các loại cá cảnh",
      "image": "url",
      "parentId": null,
      "parent": null,
      "children": [
        {
          "id": "uuid",
          "name": "Cá Betta",
          "slug": "ca-betta"
        }
      ],
      "_count": {
        "products": 50
      }
    }
  ]
}
```

### 2. Get Single Category
Lấy chi tiết danh mục

**Endpoint:** `GET /categories/:identifier`

**Parameters:**
- `identifier` - Category ID hoặc slug

**Response:** `200 OK`

### 3. Create Category (Admin)
Tạo danh mục mới

**Endpoint:** `POST /categories`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "Cá Cảnh",
  "slug": "ca-canh",
  "description": "Các loại cá cảnh",
  "image": "url",
  "parentId": "uuid" // optional
}
```

**Response:** `201 Created`

### 4. Update Category (Admin)
Cập nhật danh mục

**Endpoint:** `PUT /categories/:id`

**Headers:** `Authorization: Bearer <admin-token>`

**Response:** `200 OK`

### 5. Delete Category (Admin)
Xóa danh mục

**Endpoint:** `DELETE /categories/:id`

**Headers:** `Authorization: Bearer <admin-token>`

**Response:** `200 OK`

---

## 🛒 Cart Endpoints (To be implemented)

### 1. Get Cart
**Endpoint:** `GET /cart`

### 2. Add to Cart
**Endpoint:** `POST /cart`

### 3. Update Cart Item
**Endpoint:** `PUT /cart/:id`

### 4. Remove from Cart
**Endpoint:** `DELETE /cart/:id`

### 5. Clear Cart
**Endpoint:** `DELETE /cart`

---

## 📋 Order Endpoints (To be implemented)

### 1. Get Orders
**Endpoint:** `GET /orders`

### 2. Get Order by ID
**Endpoint:** `GET /orders/:id`

### 3. Create Order
**Endpoint:** `POST /orders`

### 4. Update Order Status (Admin)
**Endpoint:** `PUT /orders/:id/status`

### 5. Cancel Order
**Endpoint:** `DELETE /orders/:id`

---

## 💳 Payment Endpoints (To be implemented)

### 1. Create VNPay Payment
**Endpoint:** `POST /payment/vnpay/create`

### 2. VNPay Return
**Endpoint:** `GET /payment/vnpay/return`

### 3. Create MoMo Payment
**Endpoint:** `POST /payment/momo/create`

### 4. MoMo Notify
**Endpoint:** `POST /payment/momo/notify`

---

## ⭐ Review Endpoints (To be implemented)

### 1. Get Product Reviews
**Endpoint:** `GET /reviews?productId=xxx`

### 2. Create Review
**Endpoint:** `POST /reviews`

### 3. Update Review
**Endpoint:** `PUT /reviews/:id`

### 4. Delete Review
**Endpoint:** `DELETE /reviews/:id`

---

## 🎫 Coupon Endpoints (To be implemented)

### 1. Get Coupons (Admin)
**Endpoint:** `GET /coupons`

### 2. Validate Coupon
**Endpoint:** `POST /coupons/validate`

### 3. Create Coupon (Admin)
**Endpoint:** `POST /coupons`

---

## 📊 Analytics Endpoints (To be implemented)

### 1. Dashboard Stats (Admin)
**Endpoint:** `GET /analytics/dashboard`

### 2. Revenue Stats (Admin)
**Endpoint:** `GET /analytics/revenue`

### 3. Top Products (Admin)
**Endpoint:** `GET /analytics/top-products`

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [...]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📝 Notes

- Tất cả timestamps theo format ISO 8601
- Tất cả IDs là UUID v4
- Pagination bắt đầu từ page 1
- Default limit là 12 items per page
- Tất cả prices là VND (số nguyên)
- Images là array of URLs

---

**API Version:** 1.0.0

**Last Updated:** 2024
