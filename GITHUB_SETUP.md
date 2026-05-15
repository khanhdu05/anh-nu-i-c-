# 📤 Hướng dẫn Push lên GitHub

## Bước 1: Cài đặt Git

### Windows
1. Tải Git từ: https://git-scm.com/download/win
2. Chạy file cài đặt
3. Restart terminal sau khi cài xong

### Kiểm tra Git đã cài
```bash
git --version
```

## Bước 2: Cấu hình Git (Lần đầu tiên)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Bước 3: Tạo Repository trên GitHub

1. Vào https://github.com
2. Click nút **"New"** hoặc **"+"** → **"New repository"**
3. Đặt tên: `AquaFish`
4. Chọn **Public** hoặc **Private**
5. **KHÔNG** chọn "Initialize with README" (vì đã có sẵn)
6. Click **"Create repository"**

## Bước 4: Push Code lên GitHub

Mở terminal trong thư mục `AquaFish`:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AquaFish E-commerce Website"

# Add remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/AquaFish.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Bước 5: Xác thực GitHub

Nếu được hỏi username/password:

### Option 1: Personal Access Token (Khuyến nghị)
1. Vào GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Đặt tên: `AquaFish`
4. Chọn scope: `repo` (full control)
5. Click **"Generate token"**
6. **Copy token** (chỉ hiện 1 lần!)
7. Khi push, dùng token làm password

### Option 2: GitHub CLI
```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Login
gh auth login
```

## Bước 6: Verify

Vào https://github.com/YOUR_USERNAME/AquaFish để xem code đã lên chưa.

---

## 🔄 Update Code sau này

Khi có thay đổi:

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push
```

---

## 📝 .gitignore đã có

File `.gitignore` đã được tạo sẵn, các file sau sẽ KHÔNG được push:

- `node_modules/` - Dependencies
- `.env` - Environment variables (bảo mật)
- `.env.local` - Local environment
- `dist/`, `build/` - Build files
- `.next/` - Next.js build
- `*.log` - Log files

---

## ⚠️ LƯU Ý QUAN TRỌNG

### ❌ KHÔNG push các file này:
- `.env` - Chứa database password, JWT secret
- `.env.local` - Chứa API URLs
- `node_modules/` - Quá lớn, không cần thiết

### ✅ CẦN push:
- `.env.example` - Template không có password
- Source code
- README.md
- package.json

---

## 🔐 Bảo mật

Nếu vô tình push `.env`:

```bash
# Remove from git
git rm --cached .env
git commit -m "Remove .env from git"
git push

# Đổi tất cả passwords và secrets trong .env
# Vì đã bị public trên GitHub!
```

---

## 📦 Clone về máy khác

```bash
git clone https://github.com/YOUR_USERNAME/AquaFish.git
cd AquaFish

# Setup theo QUICK_START.md
```

---

## 🎯 Workflow chuẩn

1. **Làm việc local** → Code, test
2. **Commit thường xuyên** → `git commit -m "message"`
3. **Push lên GitHub** → `git push`
4. **Clone về máy khác** → `git clone`
5. **Pull updates** → `git pull`

---

## 🆘 Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/AquaFish.git
```

### "failed to push"
```bash
git pull origin main --rebase
git push
```

### "Permission denied"
- Kiểm tra GitHub username/password
- Hoặc dùng Personal Access Token
