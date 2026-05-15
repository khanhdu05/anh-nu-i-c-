# 🚀 HƯỚNG DẪN DEPLOY AQUAFISH

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn deploy AquaFish lên production với:
- **Frontend**: Vercel
- **Backend**: Railway hoặc Render
- **Database**: Supabase hoặc Railway

---

## 🗄️ Deploy Database

### Option 1: Supabase (Recommended)

1. **Tạo tài khoản tại** [supabase.com](https://supabase.com)

2. **Tạo project mới**
   - Click "New Project"
   - Chọn organization
   - Đặt tên project: `aquafish`
   - Chọn region gần nhất
   - Tạo database password (lưu lại)

3. **Lấy connection string**
   - Vào Settings > Database
   - Copy "Connection string" (URI)
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

4. **Cập nhật schema**
   ```bash
   # Trong folder backend
   # Cập nhật DATABASE_URL trong .env
   DATABASE_URL="postgresql://postgres:password@host:5432/postgres"
   
   # Chạy migration
   npx prisma migrate deploy
   
   # Seed data (optional)
   npx prisma db seed
   ```

### Option 2: Railway

1. **Tạo tài khoản tại** [railway.app](https://railway.app)

2. **Tạo PostgreSQL database**
   - Click "New Project"
   - Chọn "Provision PostgreSQL"
   - Copy connection string từ Variables tab

3. **Chạy migration** (tương tự Supabase)

---

## 🔧 Deploy Backend

### Option 1: Railway (Recommended)

1. **Tạo tài khoản tại** [railway.app](https://railway.app)

2. **Deploy từ GitHub**
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository của bạn
   - Chọn folder `backend`

3. **Cấu hình Environment Variables**
   
   Vào Settings > Variables, thêm:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-database-url>
   JWT_SECRET=<your-secret-key>
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-secret>
   VNPAY_TMN_CODE=<your-vnpay-code>
   VNPAY_HASH_SECRET=<your-vnpay-secret>
   VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
   MOMO_PARTNER_CODE=<your-momo-code>
   MOMO_ACCESS_KEY=<your-momo-key>
   MOMO_SECRET_KEY=<your-momo-secret>
   FRONTEND_URL=<your-frontend-url>
   ```

4. **Cấu hình Build & Start**
   
   Railway sẽ tự động detect, nhưng bạn có thể custom:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

5. **Deploy**
   - Railway sẽ tự động deploy
   - Copy domain URL (ví dụ: `https://aquafish-backend.up.railway.app`)

### Option 2: Render

1. **Tạo tài khoản tại** [render.com](https://render.com)

2. **Tạo Web Service mới**
   - Click "New +" > "Web Service"
   - Connect GitHub repository
   - Chọn folder `backend`

3. **Cấu hình**
   - Name: `aquafish-backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: Free (hoặc paid)

4. **Environment Variables** (tương tự Railway)

5. **Deploy**
   - Click "Create Web Service"
   - Copy URL

---

## 🎨 Deploy Frontend

### Vercel (Recommended)

1. **Tạo tài khoản tại** [vercel.com](https://vercel.com)

2. **Import Project**
   - Click "Add New..." > "Project"
   - Import từ GitHub repository
   - Chọn folder `frontend`

3. **Cấu hình**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Environment Variables**
   
   Thêm trong Settings > Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel sẽ tự động build và deploy
   - Copy domain (ví dụ: `https://aquafish.vercel.app`)

6. **Cập nhật Backend CORS**
   
   Quay lại backend, cập nhật FRONTEND_URL:
   ```
   FRONTEND_URL=https://aquafish.vercel.app
   ```

7. **Custom Domain (Optional)**
   - Vào Settings > Domains
   - Add custom domain
   - Follow instructions để config DNS

---

## ✅ Checklist sau khi Deploy

### Backend
- [ ] Database migration đã chạy thành công
- [ ] Seed data (nếu cần)
- [ ] Environment variables đã đầy đủ
- [ ] API health check: `GET https://your-backend-url/`
- [ ] Test login: `POST https://your-backend-url/api/auth/login`
- [ ] CORS đã config đúng frontend URL

### Frontend
- [ ] Build thành công không có error
- [ ] Environment variables đã đầy đủ
- [ ] Kết nối được với backend API
- [ ] Test đăng nhập/đăng ký
- [ ] Test thêm sản phẩm vào giỏ
- [ ] Images load đúng
- [ ] Responsive trên mobile

### Database
- [ ] Connection string đúng
- [ ] Tables đã được tạo
- [ ] Data đã được seed (nếu cần)
- [ ] Backup strategy đã setup

---

## 🔒 Security Checklist

- [ ] JWT_SECRET là random string mạnh
- [ ] Database password mạnh
- [ ] CORS chỉ allow frontend domain
- [ ] Rate limiting đã enable
- [ ] Helmet security headers đã enable
- [ ] Environment variables không bị expose
- [ ] HTTPS đã enable (auto với Vercel/Railway)
- [ ] API keys không bị commit vào Git

---

## 📊 Monitoring & Logs

### Railway
- Vào project > Deployments > View Logs
- Monitor CPU, Memory, Network usage

### Vercel
- Vào project > Deployments > View Function Logs
- Analytics tab để xem traffic

### Database
- Supabase: Database > Logs
- Railway: PostgreSQL > Metrics

---

## 🔄 CI/CD

### Auto Deploy on Push

**Vercel:**
- Tự động deploy khi push lên main branch
- Preview deployments cho pull requests

**Railway:**
- Tự động deploy khi push lên main branch
- Config trong Settings > Service

### Manual Deploy

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
```

---

## 🐛 Troubleshooting

### Build Failed

**Frontend:**
```bash
# Check build locally
cd frontend
npm run build

# Fix TypeScript errors
npm run lint
```

**Backend:**
```bash
# Check build locally
cd backend
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

### Database Connection Failed

1. Check DATABASE_URL format
2. Check database is running
3. Check IP whitelist (Supabase)
4. Test connection locally:
   ```bash
   npx prisma db pull
   ```

### CORS Errors

1. Check FRONTEND_URL in backend .env
2. Check CORS config in `backend/src/server.ts`
3. Make sure frontend URL matches exactly (no trailing slash)

### Environment Variables Not Working

1. Restart service after adding variables
2. Check variable names (NEXT_PUBLIC_ prefix for frontend)
3. Rebuild and redeploy

---

## 📈 Performance Optimization

### Frontend
- [ ] Enable Next.js Image Optimization
- [ ] Enable caching headers
- [ ] Minimize bundle size
- [ ] Use CDN for static assets
- [ ] Enable compression

### Backend
- [ ] Enable response compression
- [ ] Add database indexes
- [ ] Implement caching (Redis)
- [ ] Optimize database queries
- [ ] Use connection pooling

### Database
- [ ] Add indexes on frequently queried fields
- [ ] Optimize slow queries
- [ ] Regular vacuum/analyze
- [ ] Monitor query performance

---

## 💰 Cost Estimation

### Free Tier
- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month credit (enough for small apps)
- **Supabase**: Free (up to 500MB database)

### Paid Plans (for production)
- **Vercel Pro**: $20/month
- **Railway**: Pay as you go (~$10-20/month)
- **Supabase Pro**: $25/month

---

## 📝 Post-Deployment Tasks

1. **Setup Monitoring**
   - Sentry for error tracking
   - Google Analytics for traffic
   - Uptime monitoring (UptimeRobot)

2. **Setup Backups**
   - Database daily backups
   - Code backups (Git)

3. **Setup Alerts**
   - Downtime alerts
   - Error rate alerts
   - Performance alerts

4. **Documentation**
   - Update README with production URLs
   - Document deployment process
   - Create runbook for common issues

5. **Testing**
   - Test all features in production
   - Load testing
   - Security testing

---

## 🎉 Congratulations!

Your AquaFish application is now live! 🚀

**Production URLs:**
- Frontend: `https://your-site.vercel.app`
- Backend: `https://your-backend.railway.app`
- Database: Managed by Supabase/Railway

**Next Steps:**
1. Share with users
2. Gather feedback
3. Monitor performance
4. Iterate and improve

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs
