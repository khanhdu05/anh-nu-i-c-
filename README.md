# AquaFish - E-commerce Website for Aquarium Fish & Supplies

Trang web thương mại điện tử chuyên cung cấp cá cảnh, phụ kiện thủy sinh và dịch vụ tư vấn chuyên nghiệp.

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** (Supabase)
- **Prisma ORM**
- **JWT Authentication**
- **Bcrypt** for password hashing

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (State Management)
- **Framer Motion** (Animations)
- **React Hot Toast** (Notifications)

## 📋 Prerequisites

- Node.js 18+ 
- npm hoặc yarn
- PostgreSQL database (hoặc Supabase account)
- Git

## 🛠️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/AquaFish.git
cd AquaFish
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Update .env with your database credentials
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env.local

# Update .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5001/api

# Start frontend server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🗄️ Database Setup (Supabase)

1. Tạo account tại [Supabase](https://supabase.com)
2. Tạo project mới
3. Vào Settings → Database → Connection String
4. Copy **Connection Pooling** string (port 6543)
5. Thay đổi port từ `6543` → `5432` cho migrations
6. Paste vào `backend/.env`:

```env
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

## 📦 Project Structure

```
AquaFish/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Sample data
│   ├── src/
│   │   ├── controllers/       # API controllers
│   │   ├── middleware/        # Auth middleware
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utilities
│   │   └── server.ts          # Express server
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   ├── components/        # React components
│   │   ├── stores/            # Zustand stores
│   │   └── lib/               # Utilities
│   ├── public/
│   │   └── picture/           # Product images
│   ├── .env.local             # Environment variables
│   └── package.json
│
└── README.md
```

## 🔑 Demo Accounts

### Admin
- Email: `admin@aquafish.com`
- Password: `admin123`

### Customer
- Email: `customer@example.com`
- Password: `customer123`

## 🎯 Features

### Customer Features
- ✅ Browse products by category
- ✅ Search and filter products
- ✅ View product details
- ✅ Shopping cart
- ✅ User authentication (Login/Register)
- ✅ User profile management
- ✅ Order history
- ✅ Blog posts
- ✅ Contact form

### Admin Features
- ✅ Admin dashboard
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ User management
- ✅ Analytics & statistics

## 📱 Pages

- `/` - Home page
- `/products` - Product listing
- `/products?category=ca-neon` - Filtered products
- `/categories` - Category listing
- `/blog` - Blog posts
- `/contact` - Contact page
- `/login` - Login page
- `/register` - Register page
- `/profile` - User profile
- `/orders` - Order history
- `/cart` - Shopping cart
- `/admin` - Admin dashboard (Admin only)

## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database
npx prisma studio    # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products?category=slug` - Filter by category
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :5001
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:5001 | xargs kill -9
```

### Database connection error
- Kiểm tra DATABASE_URL trong `.env`
- Đảm bảo dùng port 5432 cho migrations
- Kiểm tra Supabase project có đang chạy

### Frontend không load được data
- Kiểm tra backend đang chạy tại port 5001
- Kiểm tra NEXT_PUBLIC_API_URL trong `.env.local`
- Clear browser cache và localStorage

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://..."
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Supabase for free PostgreSQL hosting
