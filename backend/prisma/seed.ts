import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aquafish.com' },
    update: {},
    create: {
      email: 'admin@aquafish.com',
      passwordHash: adminPassword,
      fullName: 'Admin AquaFish',
      phone: '0901234567',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Admin user created');

  // Create customer users
  const customerPassword = await hashPassword('customer123');
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPassword,
      fullName: 'Nguyễn Văn A',
      phone: '0987654321',
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      email: 'customer2@example.com',
      passwordHash: customerPassword,
      fullName: 'Trần Thị B',
      phone: '0912345678',
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Customer users created');

  // Create categories
  const catNeon = await prisma.category.upsert({
    where: { slug: 'ca-neon' },
    update: {},
    create: {
      name: 'Cá Neon',
      slug: 'ca-neon',
      description: 'Các loại cá Neon đẹp, màu sắc rực rỡ, dễ nuôi',
      image: '/picture/neon/bongxanhneon.webp',
    },
  });

  const catChuot = await prisma.category.upsert({
    where: { slug: 'ca-chuot' },
    update: {},
    create: {
      name: 'Cá Chuột',
      slug: 'ca-chuot',
      description: 'Cá Chuột các loại, dọn dẹp bể cá hiệu quả',
      image: '/picture/cachuot/16-ca-chuot-xanh.jpg',
    },
  });

  const catCombo = await prisma.category.upsert({
    where: { slug: 'combo-ca' },
    update: {},
    create: {
      name: 'Combo Cá & Tép',
      slug: 'combo-ca',
      description: 'Combo cá và tép cảnh giá ưu đãi',
      image: '/picture/comboca/02-combo-ca-neon-vua.jpg',
    },
  });

  const catTongHop = await prisma.category.upsert({
    where: { slug: 'ca-canh-tong-hop' },
    update: {},
    create: {
      name: 'Cá Cảnh Tổng Hợp',
      slug: 'ca-canh-tong-hop',
      description: 'Các loại cá cảnh đa dạng: Cá Đĩa, Phượng Hoàng, Thiên Thần...',
      image: '/picture/catonghop/21-ca-dia-do-trang.jpg',
    },
  });

  const catBeKinh = await prisma.category.upsert({
    where: { slug: 'be-kinh' },
    update: {},
    create: {
      name: 'Bể Kính',
      slug: 'be-kinh',
      description: 'Bể kính các kích thước, chất lượng cao',
      image: '/picture/bekinh/be1.jfif',
    },
  });

  const catThucAn = await prisma.category.upsert({
    where: { slug: 'thuc-an-ca' },
    update: {},
    create: {
      name: 'Thức Ăn Cá',
      slug: 'thuc-an-ca',
      description: 'Thức ăn dinh dưỡng cho cá cảnh',
      image: '/picture/thucan/betta.webp',
    },
  });

  console.log('✅ Categories created');

  // Create products - Cá Neon
  const products = [];

  // Cá Neon
  products.push(await prisma.product.upsert({
    where: { slug: 'ca-neon-xanh' },
    update: {},
    create: {
      name: 'Cá Neon Xanh',
      slug: 'ca-neon-xanh',
      description: 'Cá Neon xanh với sọc phát sáng đặc trưng, nuôi đàn rất đẹp',
      price: 8000,
      stock: 300,
      categoryId: catNeon.id,
      images: ['/picture/neon/bongxanhneon.webp'],
      speciesName: 'Paracheirodon innesi',
      size: '3-4cm',
      lifespan: '5-8 năm',
      waterTemperature: '20-26°C',
      phLevel: '6.0-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-neon-do' },
    update: {},
    create: {
      name: 'Cá Neon Đỏ',
      slug: 'ca-neon-do',
      description: 'Cá Neon đỏ màu sắc rực rỡ, dễ nuôi',
      price: 10000,
      stock: 250,
      categoryId: catNeon.id,
      images: ['/picture/neon/redneon.webp'],
      speciesName: 'Paracheirodon axelrodi',
      size: '3-4cm',
      lifespan: '5-8 năm',
      waterTemperature: '23-27°C',
      phLevel: '5.5-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-neon-bung-do' },
    update: {},
    create: {
      name: 'Cá Neon Bụng Đỏ',
      slug: 'ca-neon-bung-do',
      description: 'Cá Neon bụng đỏ đẹp mắt, phù hợp bể thủy sinh',
      price: 9000,
      stock: 200,
      categoryId: catNeon.id,
      images: ['/picture/neon/caneonbungdo.webp'],
      size: '3-4cm',
      lifespan: '5-8 năm',
      waterTemperature: '22-26°C',
      phLevel: '6.0-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-cardinal-tetra' },
    update: {},
    create: {
      name: 'Cá Cardinal Tetra',
      slug: 'ca-cardinal-tetra',
      description: 'Cá Cardinal Tetra với màu đỏ xanh đẹp mắt',
      price: 12000,
      stock: 180,
      categoryId: catNeon.id,
      images: ['/picture/neon/cardinaltetrabred.webp'],
      size: '4-5cm',
      lifespan: '5-10 năm',
      waterTemperature: '23-27°C',
      phLevel: '5.0-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-gold-tetra' },
    update: {},
    create: {
      name: 'Cá Gold Tetra',
      slug: 'ca-gold-tetra',
      description: 'Cá Gold Tetra màu vàng óng ánh',
      price: 15000,
      stock: 150,
      categoryId: catNeon.id,
      images: ['/picture/neon/goldtetra.webp'],
      size: '4-5cm',
      lifespan: '5-8 năm',
      waterTemperature: '22-28°C',
      phLevel: '6.0-7.5',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-black-neon-tetra' },
    update: {},
    create: {
      name: 'Cá Black Neon Tetra',
      slug: 'ca-black-neon-tetra',
      description: 'Cá Black Neon với sọc đen trắng độc đáo',
      price: 11000,
      stock: 200,
      categoryId: catNeon.id,
      images: ['/picture/neon/blackneontera.webp'],
      size: '3-4cm',
      lifespan: '5-8 năm',
      waterTemperature: '23-27°C',
      phLevel: '6.0-7.5',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  // Cá Chuột
  products.push(await prisma.product.upsert({
    where: { slug: 'ca-chuot-xanh' },
    update: {},
    create: {
      name: 'Cá Chuột Xanh',
      slug: 'ca-chuot-xanh',
      description: 'Cá Chuột xanh dọn dẹp bể cá hiệu quả, ăn rêu tảo',
      price: 25000,
      stock: 100,
      categoryId: catChuot.id,
      images: ['/picture/cachuot/16-ca-chuot-xanh.jpg'],
      size: '5-7cm',
      lifespan: '5-10 năm',
      waterTemperature: '22-26°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp, rêu tảo',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-chuot-anh-xanh' },
    update: {},
    create: {
      name: 'Cá Chuột Anh Xanh',
      slug: 'ca-chuot-anh-xanh',
      description: 'Cá Chuột Anh xanh với màu sắc đẹp mắt',
      price: 30000,
      stock: 80,
      categoryId: catChuot.id,
      images: ['/picture/cachuot/17-ca-chuot-anh-xanh.jpg'],
      size: '6-8cm',
      lifespan: '5-10 năm',
      waterTemperature: '22-26°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp, rêu tảo',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-chuot-zebra' },
    update: {},
    create: {
      name: 'Cá Chuột Zebra',
      slug: 'ca-chuot-zebra',
      description: 'Cá Chuột Zebra với sọc đen trắng đặc trưng',
      price: 28000,
      stock: 90,
      categoryId: catChuot.id,
      images: ['/picture/cachuot/18-ca-chuot-zebra.jpg'],
      size: '5-7cm',
      lifespan: '5-10 năm',
      waterTemperature: '22-26°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp, rêu tảo',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-chuot-bach-tang' },
    update: {},
    create: {
      name: 'Cá Chuột Bạch Tạng',
      slug: 'ca-chuot-bach-tang',
      description: 'Cá Chuột Bạch Tạng màu trắng độc đáo',
      price: 35000,
      stock: 70,
      categoryId: catChuot.id,
      images: ['/picture/cachuot/19-ca-chuot-bach-tang.jpg'],
      size: '5-7cm',
      lifespan: '5-10 năm',
      waterTemperature: '22-26°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp, rêu tảo',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-chuot-julii' },
    update: {},
    create: {
      name: 'Cá Chuột Julii',
      slug: 'ca-chuot-julii',
      description: 'Cá Chuột Julii với hoa văn đẹp mắt',
      price: 32000,
      stock: 75,
      categoryId: catChuot.id,
      images: ['/picture/cachuot/20-ca-chuot-julii.jpg'],
      size: '5-6cm',
      lifespan: '5-10 năm',
      waterTemperature: '22-26°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp, rêu tảo',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  // Combo Cá & Tép
  products.push(await prisma.product.upsert({
    where: { slug: 'combo-ca-neon-vua' },
    update: {},
    create: {
      name: 'Combo Cá Neon Vua',
      slug: 'combo-ca-neon-vua',
      description: 'Combo 10 con cá Neon Vua đẹp, giá ưu đãi',
      price: 150000,
      salePrice: 120000,
      stock: 50,
      categoryId: catCombo.id,
      images: ['/picture/comboca/02-combo-ca-neon-vua.jpg'],
      size: '3-4cm',
      waterTemperature: '22-26°C',
      phLevel: '6.0-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'combo-ca-neon-xanh' },
    update: {},
    create: {
      name: 'Combo Cá Neon Xanh',
      slug: 'combo-ca-neon-xanh',
      description: 'Combo 20 con cá Neon xanh, giá tốt',
      price: 140000,
      salePrice: 110000,
      stock: 60,
      categoryId: catCombo.id,
      images: ['/picture/comboca/03-combo-ca-neon-xanh.jpg'],
      size: '3-4cm',
      waterTemperature: '20-26°C',
      phLevel: '6.0-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'combo-tep-rilli-do' },
    update: {},
    create: {
      name: 'Combo Tép Rilli Đỏ',
      slug: 'combo-tep-rilli-do',
      description: 'Combo 10 con tép Rilli đỏ đẹp',
      price: 180000,
      salePrice: 150000,
      stock: 40,
      categoryId: catCombo.id,
      images: ['/picture/comboca/13-combo-tep-rilli-do.jpg'],
      size: '2-3cm',
      waterTemperature: '22-26°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'combo-tep-rilli-vang' },
    update: {},
    create: {
      name: 'Combo Tép Rilli Vàng',
      slug: 'combo-tep-rilli-vang',
      description: 'Combo 10 con tép Rilli vàng óng ánh',
      price: 200000,
      salePrice: 170000,
      stock: 35,
      categoryId: catCombo.id,
      images: ['/picture/comboca/14-combo-tep-rilli-vang.jpg'],
      size: '2-3cm',
      waterTemperature: '22-26°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'combo-ca-diec-anh-dao' },
    update: {},
    create: {
      name: 'Combo Cá Điếc Anh Đào',
      slug: 'combo-ca-diec-anh-dao',
      description: 'Combo 10 con cá Điếc Anh Đào màu hồng đẹp',
      price: 160000,
      salePrice: 130000,
      stock: 45,
      categoryId: catCombo.id,
      images: ['/picture/comboca/05-combo-ca-diec-anh-dao.jpg'],
      size: '4-5cm',
      waterTemperature: '23-27°C',
      phLevel: '6.0-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  // Cá Cảnh Tổng Hợp
  products.push(await prisma.product.upsert({
    where: { slug: 'ca-dia-do-trang' },
    update: {},
    create: {
      name: 'Cá Đĩa Đỏ Trắng',
      slug: 'ca-dia-do-trang',
      description: 'Cá Đĩa đỏ trắng đẹp mắt, sang trọng',
      price: 350000,
      salePrice: 300000,
      stock: 25,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/21-ca-dia-do-trang.jpg'],
      size: '12-15cm',
      lifespan: '10-15 năm',
      waterTemperature: '26-30°C',
      phLevel: '6.0-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'MODERATE',
      compatibility: 'Nuôi đàn nhỏ',
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-dia-do' },
    update: {},
    create: {
      name: 'Cá Đĩa Đỏ',
      slug: 'ca-dia-do',
      description: 'Cá Đĩa đỏ thuần chủng, màu sắc rực rỡ',
      price: 320000,
      stock: 30,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/24-ca-dia-do.jpg'],
      size: '12-15cm',
      lifespan: '10-15 năm',
      waterTemperature: '26-30°C',
      phLevel: '6.0-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'MODERATE',
      compatibility: 'Nuôi đàn nhỏ',
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-dia-xanh-hoa-van' },
    update: {},
    create: {
      name: 'Cá Đĩa Xanh Hoa Văn',
      slug: 'ca-dia-xanh-hoa-van',
      description: 'Cá Đĩa xanh với hoa văn độc đáo',
      price: 380000,
      stock: 20,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/26-ca-dia-xanh-hoa-van.jpg'],
      size: '12-15cm',
      lifespan: '10-15 năm',
      waterTemperature: '26-30°C',
      phLevel: '6.0-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'MODERATE',
      compatibility: 'Nuôi đàn nhỏ',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-phuong-hoang-lua' },
    update: {},
    create: {
      name: 'Cá Phượng Hoàng Lửa',
      slug: 'ca-phuong-hoang-lua',
      description: 'Cá Phượng Hoàng lửa màu đỏ cam rực rỡ',
      price: 180000,
      salePrice: 150000,
      stock: 40,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/34-ca-phuong-hoang-lua.jpg'],
      size: '8-10cm',
      lifespan: '5-8 năm',
      waterTemperature: '24-28°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đơn hoặc cặp',
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-phuong-hoang-xanh' },
    update: {},
    create: {
      name: 'Cá Phượng Hoàng Xanh',
      slug: 'ca-phuong-hoang-xanh',
      description: 'Cá Phượng Hoàng xanh điện đẹp mắt',
      price: 200000,
      stock: 35,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/36-ca-phuong-hoang-xanh.jpg'],
      size: '8-10cm',
      lifespan: '5-8 năm',
      waterTemperature: '24-28°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đơn hoặc cặp',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-phuong-hoang-vang' },
    update: {},
    create: {
      name: 'Cá Phượng Hoàng Vàng',
      slug: 'ca-phuong-hoang-vang',
      description: 'Cá Phượng Hoàng vàng óng ánh',
      price: 190000,
      stock: 38,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/39-ca-phuong-hoang-vang.jpg'],
      size: '8-10cm',
      lifespan: '5-8 năm',
      waterTemperature: '24-28°C',
      phLevel: '6.5-7.5',
      foodType: 'Ăn tạp',
      careLevel: 'EASY',
      compatibility: 'Nuôi đơn hoặc cặp',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'tep-cherry-do' },
    update: {},
    create: {
      name: 'Tép Cherry Đỏ',
      slug: 'tep-cherry-do',
      description: 'Tép Cherry đỏ tươi, dễ nuôi',
      price: 15000,
      stock: 200,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/43-tep-cherry-do.jpg'],
      size: '2-3cm',
      lifespan: '1-2 năm',
      waterTemperature: '22-28°C',
      phLevel: '6.5-8.0',
      foodType: 'Ăn tạp, rêu tảo',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'tep-blue-dream' },
    update: {},
    create: {
      name: 'Tép Blue Dream',
      slug: 'tep-blue-dream',
      description: 'Tép Blue Dream xanh dương đẹp mắt',
      price: 25000,
      stock: 150,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/44-tep-blue-dream.jpg'],
      size: '2-3cm',
      lifespan: '1-2 năm',
      waterTemperature: '22-28°C',
      phLevel: '6.5-8.0',
      foodType: 'Ăn tạp, rêu tảo',
      careLevel: 'EASY',
      compatibility: 'Nuôi đàn',
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-than-tien-vay-dai' },
    update: {},
    create: {
      name: 'Cá Thần Tiên Vây Dài',
      slug: 'ca-than-tien-vay-dai',
      description: 'Cá Thần Tiên vây dài uyển chuyển',
      price: 250000,
      salePrice: 220000,
      stock: 30,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/51-ca-than-tien-vay-dai.jpg'],
      size: '15-20cm',
      lifespan: '8-10 năm',
      waterTemperature: '24-28°C',
      phLevel: '6.5-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'MODERATE',
      compatibility: 'Nuôi đàn nhỏ',
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'ca-than-tien-xanh' },
    update: {},
    create: {
      name: 'Cá Thần Tiên Xanh',
      slug: 'ca-than-tien-xanh',
      description: 'Cá Thần Tiên xanh ngọc đẹp mắt',
      price: 280000,
      stock: 25,
      categoryId: catTongHop.id,
      images: ['/picture/catonghop/52-ca-than-tien-xanh.jpg'],
      size: '15-20cm',
      lifespan: '8-10 năm',
      waterTemperature: '24-28°C',
      phLevel: '6.5-7.0',
      foodType: 'Ăn tạp',
      careLevel: 'MODERATE',
      compatibility: 'Nuôi đàn nhỏ',
      isActive: true,
    },
  }));

  // Bể Kính
  products.push(await prisma.product.upsert({
    where: { slug: 'be-kinh-30cm' },
    update: {},
    create: {
      name: 'Bể Kính 30cm',
      slug: 'be-kinh-30cm',
      description: 'Bể kính 30x20x25cm, phù hợp nuôi cá nhỏ',
      price: 180000,
      stock: 50,
      categoryId: catBeKinh.id,
      images: ['/picture/bekinh/be1.jfif'],
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'be-kinh-40cm' },
    update: {},
    create: {
      name: 'Bể Kính 40cm',
      slug: 'be-kinh-40cm',
      description: 'Bể kính 40x25x30cm, kính dày 5mm',
      price: 280000,
      stock: 40,
      categoryId: catBeKinh.id,
      images: ['/picture/bekinh/be2.jfif'],
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'be-kinh-50cm' },
    update: {},
    create: {
      name: 'Bể Kính 50cm',
      slug: 'be-kinh-50cm',
      description: 'Bể kính 50x30x35cm, chất lượng cao',
      price: 380000,
      salePrice: 350000,
      stock: 35,
      categoryId: catBeKinh.id,
      images: ['/picture/bekinh/be3.jfif'],
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'be-kinh-60cm' },
    update: {},
    create: {
      name: 'Bể Kính 60cm',
      slug: 'be-kinh-60cm',
      description: 'Bể kính 60x35x40cm, kính siêu trong',
      price: 550000,
      salePrice: 500000,
      stock: 30,
      categoryId: catBeKinh.id,
      images: ['/picture/bekinh/be4.jfif'],
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'be-kinh-80cm' },
    update: {},
    create: {
      name: 'Bể Kính 80cm',
      slug: 'be-kinh-80cm',
      description: 'Bể kính 80x40x45cm, phù hợp bể thủy sinh',
      price: 850000,
      salePrice: 780000,
      stock: 20,
      categoryId: catBeKinh.id,
      images: ['/picture/bekinh/be5.jfif'],
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'be-kinh-100cm' },
    update: {},
    create: {
      name: 'Bể Kính 100cm',
      slug: 'be-kinh-100cm',
      description: 'Bể kính 100x45x50cm, bể lớn cao cấp',
      price: 1200000,
      salePrice: 1100000,
      stock: 15,
      categoryId: catBeKinh.id,
      images: ['/picture/bekinh/be6.jfif'],
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'be-kinh-120cm' },
    update: {},
    create: {
      name: 'Bể Kính 120cm',
      slug: 'be-kinh-120cm',
      description: 'Bể kính 120x50x55cm, bể siêu lớn',
      price: 1800000,
      salePrice: 1650000,
      stock: 10,
      categoryId: catBeKinh.id,
      images: ['/picture/bekinh/be7.jfif'],
      isFeatured: true,
      isActive: true,
    },
  }));

  // Thức Ăn Cá
  products.push(await prisma.product.upsert({
    where: { slug: 'thuc-an-betta' },
    update: {},
    create: {
      name: 'Thức Ăn Betta',
      slug: 'thuc-an-betta',
      description: 'Thức ăn chuyên dụng cho cá Betta, tăng màu sắc',
      price: 45000,
      stock: 100,
      categoryId: catThucAn.id,
      images: ['/picture/thucan/betta.webp'],
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'thuc-an-neon' },
    update: {},
    create: {
      name: 'Thức Ăn Neon',
      slug: 'thuc-an-neon',
      description: 'Thức ăn viên nhỏ cho cá Neon và cá nhỏ',
      price: 35000,
      stock: 120,
      categoryId: catThucAn.id,
      images: ['/picture/thucan/neon.webp'],
      isFeatured: true,
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'thuc-an-cadia' },
    update: {},
    create: {
      name: 'Thức Ăn Cadia',
      slug: 'thuc-an-cadia',
      description: 'Thức ăn cao cấp cho cá cảnh, giàu protein',
      price: 55000,
      stock: 90,
      categoryId: catThucAn.id,
      images: ['/picture/thucan/cadia.webp'],
      isActive: true,
    },
  }));

  products.push(await prisma.product.upsert({
    where: { slug: 'thuc-an-ali' },
    update: {},
    create: {
      name: 'Thức Ăn Ali',
      slug: 'thuc-an-ali',
      description: 'Thức ăn tổng hợp cho mọi loại cá cảnh',
      price: 40000,
      stock: 110,
      categoryId: catThucAn.id,
      images: ['/picture/thucan/ali.webp'],
      isActive: true,
    },
  }));

  console.log('✅ Products created:', products.length);

  // Create reviews
  await prisma.review.createMany({
    data: [
      {
        userId: customer.id,
        productId: products[0].id,
        rating: 5,
        comment: 'Cá Neon đẹp lắm, khỏe mạnh. Shop giao hàng cẩn thận!',
        isVisible: true,
      },
      {
        userId: customer2.id,
        productId: products[0].id,
        rating: 5,
        comment: 'Cá về còn sống 100%, màu sắc đẹp',
        isVisible: true,
      },
      {
        userId: customer.id,
        productId: products[6].id,
        rating: 5,
        comment: 'Cá Chuột xanh dọn bể sạch sẽ, rất hài lòng',
        isVisible: true,
      },
      {
        userId: customer2.id,
        productId: products[11].id,
        rating: 4,
        comment: 'Combo tốt, giá hợp lý. Cá khỏe',
        isVisible: true,
      },
      {
        userId: customer.id,
        productId: products[16].id,
        rating: 5,
        comment: 'Cá Đĩa đẹp xuất sắc, đáng tiền!',
        isVisible: true,
      },
      {
        userId: customer2.id,
        productId: products[19].id,
        rating: 5,
        comment: 'Cá Phượng Hoàng lửa màu sắc rực rỡ, rất đẹp',
        isVisible: true,
      },
      {
        userId: customer.id,
        productId: products[28].id,
        rating: 5,
        comment: 'Bể kính chất lượng tốt, kính trong, không bị méo',
        isVisible: true,
      },
      {
        userId: customer2.id,
        productId: products[32].id,
        rating: 4,
        comment: 'Thức ăn tốt, cá ăn ngon',
        isVisible: true,
      },
    ],
  });

  console.log('✅ Reviews created');

  // Create coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME2024' },
    update: {},
    create: {
      code: 'WELCOME2024',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 300000,
      maxDiscount: 100000,
      usageLimit: 100,
      usedCount: 0,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      discountType: 'FIXED',
      discountValue: 30000,
      minOrderValue: 500000,
      usageLimit: 50,
      usedCount: 0,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
    },
  });

  console.log('✅ Coupons created');

  // Create blog posts
  await prisma.blogPost.create({
    data: {
      title: 'Hướng Dẫn Nuôi Cá Neon Cho Người Mới Bắt Đầu',
      slug: 'huong-dan-nuoi-ca-neon',
      excerpt: 'Cá Neon là loại cá cảnh dễ nuôi, phù hợp cho người mới. Bài viết này sẽ hướng dẫn chi tiết cách nuôi cá Neon.',
      content: `
# Hướng Dẫn Nuôi Cá Neon Cho Người Mới Bắt Đầu

Cá Neon là một trong những loại cá cảnh phổ biến nhất, được yêu thích bởi màu sắc rực rỡ và tính cách hiền lành.

## 1. Chuẩn Bị Bể Cá

- Kích thước bể: Tối thiểu 40cm (20 lít)
- Nhiệt độ nước: 20-26°C
- pH: 6.0-7.0
- Lọc nước: Cần có máy lọc phù hợp

## 2. Số Lượng Cá

Cá Neon sống theo đàn, nên nuôi ít nhất 10 con để chúng cảm thấy an toàn và thoải mái.

## 3. Thức Ăn

- Thức ăn viên nhỏ
- Giun chỉ
- Artemia
- Cho ăn 2 lần/ngày, lượng vừa đủ

## 4. Lưu Ý

- Thay nước 20-30% mỗi tuần
- Không nuôi chung với cá hung dữ
- Tránh ánh sáng quá mạnh

Chúc bạn thành công!
      `,
      featuredImage: '/picture/neon/bongxanhneon.webp',
      authorId: admin.id,
      status: 'PUBLISHED',
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'Top 5 Loại Cá Cảnh Dễ Nuôi Nhất',
      slug: 'top-5-loai-ca-canh-de-nuoi',
      excerpt: 'Bạn mới bắt đầu nuôi cá cảnh? Đây là 5 loại cá dễ nuôi nhất dành cho người mới.',
      content: `
# Top 5 Loại Cá Cảnh Dễ Nuôi Nhất

## 1. Cá Neon

Cá Neon là lựa chọn số 1 cho người mới bắt đầu. Chúng dễ nuôi, đẹp mắt và giá cả phải chăng.

## 2. Cá Chuột

Cá Chuột không chỉ đẹp mà còn giúp dọn dẹp bể cá, ăn rêu tảo rất hiệu quả.

## 3. Cá Betta

Cá Betta có màu sắc rực rỡ, nuôi đơn độc trong bể nhỏ cũng được.

## 4. Cá Phượng Hoàng

Cá Phượng Hoàng màu sắc đẹp, tính cách hiền lành, dễ chăm sóc.

## 5. Tép Cherry

Tép Cherry dễ nuôi, sinh sản nhanh, giúp làm sạch bể cá.

Hãy bắt đầu với những loại cá này để có kinh nghiệm nhé!
      `,
      featuredImage: '/picture/comboca/02-combo-ca-neon-vua.jpg',
      authorId: admin.id,
      status: 'PUBLISHED',
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'Cách Chọn Bể Cá Phù Hợp Với Không Gian Nhà Bạn',
      slug: 'cach-chon-be-ca-phu-hop',
      excerpt: 'Hướng dẫn chọn kích thước và loại bể cá phù hợp với không gian và nhu cầu của bạn.',
      content: `
# Cách Chọn Bể Cá Phù Hợp

## Bể 30-40cm

Phù hợp cho:
- Không gian nhỏ
- Nuôi cá Betta, cá nhỏ
- Người mới bắt đầu

## Bể 50-60cm

Phù hợp cho:
- Phòng khách, bàn làm việc
- Nuôi cá Neon, cá Chuột
- Bể thủy sinh nhỏ

## Bể 80-100cm

Phù hợp cho:
- Phòng khách rộng
- Nuôi cá Đĩa, Thần Tiên
- Bể thủy sinh đẹp mắt

## Bể 120cm trở lên

Phù hợp cho:
- Không gian lớn
- Nuôi nhiều loại cá
- Bể thủy sinh chuyên nghiệp

Hãy chọn bể phù hợp với không gian và khả năng chăm sóc của bạn!
      `,
      featuredImage: '/picture/bekinh/be4.jfif',
      authorId: admin.id,
      status: 'PUBLISHED',
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'Bí Quyết Chăm Sóc Cá Đĩa Khỏe Mạnh',
      slug: 'bi-quyet-cham-soc-ca-dia',
      excerpt: 'Cá Đĩa là loại cá cao cấp, đòi hỏi kỹ thuật chăm sóc đặc biệt. Cùng tìm hiểu nhé!',
      content: `
# Bí Quyết Chăm Sóc Cá Đĩa

Cá Đĩa là "vua của các loại cá cảnh", đẹp nhưng cũng khó nuôi hơn.

## 1. Nhiệt Độ Nước

- Duy trì 26-30°C
- Sử dụng máy sưởi ổn định
- Tránh thay đổi nhiệt độ đột ngột

## 2. Chất Lượng Nước

- pH: 6.0-7.0
- Nước mềm
- Thay nước 30% mỗi tuần

## 3. Thức Ăn

- Thức ăn chuyên dụng cho cá Đĩa
- Giun chỉ, artemia
- Cho ăn 2-3 lần/ngày

## 4. Bạn Cùng Bể

- Nuôi đàn 4-6 con
- Tránh cá hung dữ
- Có thể nuôi chung với cá Neon, cá Chuột

## 5. Bệnh Thường Gặp

- Bệnh lỗ: Do nước bẩn
- Bệnh trắng da: Do nhiệt độ thấp
- Phòng bệnh bằng cách giữ nước sạch

Chúc bạn nuôi cá Đĩa thành công!
      `,
      featuredImage: '/picture/catonghop/21-ca-dia-do-trang.jpg',
      authorId: admin.id,
      status: 'PUBLISHED',
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log('✅ Blog posts created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- Users: 3 (1 admin, 2 customers)');
  console.log('- Categories: 6');
  console.log('- Products:', products.length);
  console.log('- Reviews: 8');
  console.log('- Coupons: 2');
  console.log('- Blog posts: 4');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@aquafish.com / admin123');
  console.log('Customer: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
