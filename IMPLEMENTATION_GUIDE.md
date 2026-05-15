# 🐠 HƯỚNG DẪN TRIỂN KHAI AQUAFISH

## 📋 Tổng quan dự án

Dự án AquaFish đã được khởi tạo với cấu trúc cơ bản bao gồm:

### ✅ Đã hoàn thành:

#### Backend:
- ✅ Cấu trúc thư mục backend
- ✅ Database schema (Prisma) với đầy đủ các bảng
- ✅ Authentication system (JWT + bcrypt)
- ✅ Product API (CRUD + filters + search)
- ✅ Category API (CRUD)
- ✅ Middleware authentication & authorization
- ✅ Seed data mẫu
- ✅ Server setup với Express

#### Frontend:
- ✅ Cấu trúc Next.js 14 với App Router
- ✅ Tailwind CSS configuration
- ✅ Auth store (Zustand)
- ✅ Cart store (Zustand)
- ✅ Axios configuration
- ✅ Utility functions
- ✅ Trang chủ với giao diện đẹp, chuyên nghiệp
- ✅ Responsive design
- ✅ Dark mode support

## 🚀 Cài đặt và chạy dự án

### 1. Cài đặt Backend

```bash
cd backend
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Cập nhật DATABASE_URL trong .env
# DATABASE_URL="postgresql://user:password@localhost:5432/aquafish"

# Chạy migration
npx prisma migrate dev --name init

# Seed data mẫu
npx prisma db seed

# Chạy backend
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

### 2. Cài đặt Frontend

```bash
cd frontend
npm install

# Tạo file .env.local
cp .env.example .env.local

# Chạy frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## 📝 Các phần cần hoàn thiện

### Backend - Controllers cần implement:

#### 1. Cart Controller (`backend/src/controllers/cart.controller.ts`)
```typescript
- getCart() - Lấy giỏ hàng của user
- addToCart() - Thêm sản phẩm vào giỏ
- updateCartItem() - Cập nhật số lượng
- removeFromCart() - Xóa sản phẩm khỏi giỏ
- clearCart() - Xóa toàn bộ giỏ hàng
```

#### 2. Order Controller (`backend/src/controllers/order.controller.ts`)
```typescript
- createOrder() - Tạo đơn hàng mới
- getOrders() - Lấy danh sách đơn hàng (customer)
- getOrderById() - Chi tiết đơn hàng
- getAllOrders() - Lấy tất cả đơn hàng (admin)
- updateOrderStatus() - Cập nhật trạng thái (admin)
- cancelOrder() - Hủy đơn hàng
```

#### 3. Payment Controller (`backend/src/controllers/payment.controller.ts`)
```typescript
- createVNPayPayment() - Tạo link thanh toán VNPay
- vnpayReturn() - Xử lý callback VNPay
- createMoMoPayment() - Tạo link thanh toán MoMo
- momoNotify() - Xử lý webhook MoMo
```

#### 4. User Controller (`backend/src/controllers/user.controller.ts`)
```typescript
- getProfile() - Lấy thông tin user
- updateProfile() - Cập nhật thông tin
- getAddresses() - Lấy danh sách địa chỉ
- createAddress() - Thêm địa chỉ mới
- updateAddress() - Cập nhật địa chỉ
- deleteAddress() - Xóa địa chỉ
- setDefaultAddress() - Đặt địa chỉ mặc định
```

#### 5. Review Controller (`backend/src/controllers/review.controller.ts`)
```typescript
- createReview() - Tạo đánh giá
- getProductReviews() - Lấy đánh giá của sản phẩm
- updateReview() - Cập nhật đánh giá
- deleteReview() - Xóa đánh giá
- toggleVisibility() - Ẩn/hiện đánh giá (admin)
```

#### 6. Coupon Controller (`backend/src/controllers/coupon.controller.ts`)
```typescript
- getCoupons() - Lấy danh sách mã giảm giá (admin)
- createCoupon() - Tạo mã giảm giá (admin)
- updateCoupon() - Cập nhật mã (admin)
- deleteCoupon() - Xóa mã (admin)
- validateCoupon() - Kiểm tra mã hợp lệ
- applyCoupon() - Áp dụng mã giảm giá
```

#### 7. Blog Controller (`backend/src/controllers/blog.controller.ts`)
```typescript
- getPosts() - Lấy danh sách bài viết
- getPost() - Chi tiết bài viết
- createPost() - Tạo bài viết (admin)
- updatePost() - Cập nhật bài viết (admin)
- deletePost() - Xóa bài viết (admin)
```

#### 8. Analytics Controller (`backend/src/controllers/analytics.controller.ts`)
```typescript
- getDashboardStats() - Thống kê tổng quan
- getRevenueStats() - Thống kê doanh thu
- getTopProducts() - Sản phẩm bán chạy
- getTopCustomers() - Khách hàng mua nhiều
- getLowStockProducts() - Sản phẩm sắp hết hàng
```

### Frontend - Pages cần tạo:

#### 1. Authentication Pages
- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký
- `/forgot-password` - Quên mật khẩu

#### 2. Product Pages
- `/products` - Danh sách sản phẩm (với filter, search, sort)
- `/products/[slug]` - Chi tiết sản phẩm

#### 3. Cart & Checkout
- `/cart` - Giỏ hàng
- `/checkout` - Thanh toán
- `/checkout/success` - Đặt hàng thành công

#### 4. User Account
- `/account` - Trang tài khoản
- `/account/profile` - Thông tin cá nhân
- `/account/orders` - Lịch sử đơn hàng
- `/account/orders/[id]` - Chi tiết đơn hàng
- `/account/addresses` - Quản lý địa chỉ
- `/account/wishlist` - Sản phẩm yêu thích

#### 5. Admin Dashboard
- `/admin` - Tổng quan
- `/admin/products` - Quản lý sản phẩm
- `/admin/products/new` - Thêm sản phẩm
- `/admin/products/[id]/edit` - Sửa sản phẩm
- `/admin/categories` - Quản lý danh mục
- `/admin/orders` - Quản lý đơn hàng
- `/admin/orders/[id]` - Chi tiết đơn hàng
- `/admin/customers` - Quản lý khách hàng
- `/admin/coupons` - Quản lý mã giảm giá
- `/admin/blog` - Quản lý blog
- `/admin/analytics` - Thống kê doanh thu

#### 6. Other Pages
- `/blog` - Danh sách bài viết
- `/blog/[slug]` - Chi tiết bài viết
- `/contact` - Liên hệ
- `/about` - Giới thiệu

### Frontend - Components cần tạo:

#### Layout Components
- `Header.tsx` - Header với navigation
- `Footer.tsx` - Footer
- `Sidebar.tsx` - Sidebar cho admin
- `MobileMenu.tsx` - Menu mobile

#### Product Components
- `ProductCard.tsx` - Card sản phẩm
- `ProductGrid.tsx` - Grid sản phẩm
- `ProductFilter.tsx` - Bộ lọc sản phẩm
- `ProductSort.tsx` - Sắp xếp sản phẩm
- `ProductGallery.tsx` - Gallery ảnh sản phẩm
- `ProductInfo.tsx` - Thông tin sản phẩm
- `RelatedProducts.tsx` - Sản phẩm liên quan

#### Cart Components
- `CartItem.tsx` - Item trong giỏ hàng
- `CartSummary.tsx` - Tóm tắt giỏ hàng
- `CartDrawer.tsx` - Drawer giỏ hàng

#### UI Components
- `Button.tsx` - Button component
- `Input.tsx` - Input component
- `Select.tsx` - Select component
- `Modal.tsx` - Modal component
- `Toast.tsx` - Toast notification
- `Loading.tsx` - Loading spinner
- `Skeleton.tsx` - Skeleton loader
- `Pagination.tsx` - Pagination
- `Badge.tsx` - Badge
- `Card.tsx` - Card component
- `Tabs.tsx` - Tabs component
- `Dropdown.tsx` - Dropdown menu

#### Admin Components
- `DashboardCard.tsx` - Card thống kê
- `RevenueChart.tsx` - Biểu đồ doanh thu
- `OrderTable.tsx` - Bảng đơn hàng
- `ProductTable.tsx` - Bảng sản phẩm
- `CustomerTable.tsx` - Bảng khách hàng

## 🎨 Design System

### Colors
```css
Primary: #0ea5e9 (Blue)
Secondary: #06b6d4 (Cyan)
Accent: #14b8a6 (Teal)
Success: #10b981 (Green)
Warning: #f59e0b (Yellow)
Error: #ef4444 (Red)
```

### Typography
```css
Font Family: Inter
Headings: font-bold
Body: font-normal
Small: text-sm
Base: text-base
Large: text-lg
XL: text-xl
2XL: text-2xl
```

### Spacing
```css
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

## 🔐 Authentication Flow

1. User đăng ký/đăng nhập
2. Backend trả về JWT token
3. Frontend lưu token vào localStorage và Zustand store
4. Mọi request sau đó đều gửi kèm token trong header
5. Backend verify token và trả về data

## 🛒 Shopping Flow

1. User browse sản phẩm
2. Thêm sản phẩm vào giỏ hàng (lưu local nếu chưa login)
3. Đăng nhập (nếu chưa)
4. Xem giỏ hàng và cập nhật số lượng
5. Checkout: nhập thông tin giao hàng
6. Chọn phương thức thanh toán
7. Tạo đơn hàng
8. Thanh toán (nếu online)
9. Xác nhận đơn hàng

## 📦 API Endpoints Summary

### Auth
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập
- GET `/api/auth/me` - Lấy thông tin user
- POST `/api/auth/change-password` - Đổi mật khẩu

### Products
- GET `/api/products` - Danh sách sản phẩm
- GET `/api/products/:id` - Chi tiết sản phẩm
- POST `/api/products` - Tạo sản phẩm (admin)
- PUT `/api/products/:id` - Cập nhật sản phẩm (admin)
- DELETE `/api/products/:id` - Xóa sản phẩm (admin)

### Categories
- GET `/api/categories` - Danh sách danh mục
- GET `/api/categories/:id` - Chi tiết danh mục
- POST `/api/categories` - Tạo danh mục (admin)
- PUT `/api/categories/:id` - Cập nhật danh mục (admin)
- DELETE `/api/categories/:id` - Xóa danh mục (admin)

### Cart
- GET `/api/cart` - Lấy giỏ hàng
- POST `/api/cart` - Thêm vào giỏ
- PUT `/api/cart/:id` - Cập nhật số lượng
- DELETE `/api/cart/:id` - Xóa khỏi giỏ

### Orders
- GET `/api/orders` - Danh sách đơn hàng
- GET `/api/orders/:id` - Chi tiết đơn hàng
- POST `/api/orders` - Tạo đơn hàng
- PUT `/api/orders/:id/status` - Cập nhật trạng thái (admin)
- DELETE `/api/orders/:id` - Hủy đơn hàng

### Payment
- POST `/api/payment/vnpay/create` - Tạo thanh toán VNPay
- GET `/api/payment/vnpay/return` - Callback VNPay
- POST `/api/payment/momo/create` - Tạo thanh toán MoMo
- POST `/api/payment/momo/notify` - Webhook MoMo

## 🚀 Next Steps

### Phase 1: Core Features (Week 1-2)
1. Hoàn thiện Cart API và UI
2. Hoàn thiện Order API và UI
3. Trang sản phẩm với filter/search
4. Trang chi tiết sản phẩm

### Phase 2: User Features (Week 3)
1. User profile management
2. Address management
3. Order tracking
4. Review system

### Phase 3: Admin Dashboard (Week 4)
1. Dashboard overview
2. Product management
3. Order management
4. Analytics

### Phase 4: Advanced Features (Week 5-6)
1. Payment integration (VNPay/MoMo)
2. Blog system
3. Coupon system
4. Email notifications
5. Image upload (Cloudinary)

### Phase 5: Polish & Deploy (Week 7-8)
1. Testing
2. Performance optimization
3. SEO optimization
4. Deploy to production

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/)
- [MoMo Documentation](https://developers.momo.vn/)

## 🐛 Troubleshooting

### Backend không chạy được
- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra DATABASE_URL trong .env
- Chạy lại migration: `npx prisma migrate dev`

### Frontend không kết nối được Backend
- Kiểm tra NEXT_PUBLIC_API_URL trong .env.local
- Kiểm tra CORS settings trong backend

### Prisma errors
- Xóa folder `node_modules` và `package-lock.json`
- Chạy lại `npm install`
- Chạy `npx prisma generate`

## 💡 Tips

1. **Code Organization**: Giữ code clean và có tổ chức
2. **Error Handling**: Luôn handle errors properly
3. **Validation**: Validate data ở cả frontend và backend
4. **Security**: Không bao giờ expose sensitive data
5. **Performance**: Optimize images, lazy load components
6. **Testing**: Test thoroughly trước khi deploy
7. **Documentation**: Document code và API endpoints

## 📞 Support

Nếu gặp vấn đề, hãy:
1. Check documentation
2. Search for similar issues
3. Ask for help

---

**Happy Coding! 🚀**
