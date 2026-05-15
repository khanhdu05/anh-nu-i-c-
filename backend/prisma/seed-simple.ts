import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  try {
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

    // Create customer
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
    console.log('✅ Customer created');

    // Create categories
    const catNeon = await prisma.category.upsert({
      where: { slug: 'ca-neon' },
      update: {},
      create: {
        name: 'Cá Neon',
        slug: 'ca-neon',
        description: 'Các loại cá Neon đẹp, màu sắc rực rỡ',
        image: '/picture/neon/bongxanhneon.webp',
      },
    });

    const catChuot = await prisma.category.upsert({
      where: { slug: 'ca-chuot' },
      update: {},
      create: {
        name: 'Cá Chuột',
        slug: 'ca-chuot',
        description: 'Cá Chuột dọn dẹp bể cá',
        image: '/picture/cachuot/16-ca-chuot-xanh.jpg',
      },
    });

    const catCombo = await prisma.category.upsert({
      where: { slug: 'combo-ca' },
      update: {},
      create: {
        name: 'Combo Cá & Tép',
        slug: 'combo-ca',
        description: 'Combo cá và tép giá ưu đãi',
        image: '/picture/comboca/02-combo-ca-neon-vua.jpg',
      },
    });

    const catTongHop = await prisma.category.upsert({
      where: { slug: 'ca-canh-tong-hop' },
      update: {},
      create: {
        name: 'Cá Cảnh Tổng Hợp',
        slug: 'ca-canh-tong-hop',
        description: 'Các loại cá cảnh đa dạng',
        image: '/picture/catonghop/21-ca-dia-do-trang.jpg',
      },
    });

    const catBeKinh = await prisma.category.upsert({
      where: { slug: 'be-kinh' },
      update: {},
      create: {
        name: 'Bể Kính',
        slug: 'be-kinh',
        description: 'Bể kính các kích thước',
        image: '/picture/bekinh/be1.jfif',
      },
    });

    const catThucAn = await prisma.category.upsert({
      where: { slug: 'thuc-an-ca' },
      update: {},
      create: {
        name: 'Thức Ăn Cá',
        slug: 'thuc-an-ca',
        description: 'Thức ăn dinh dưỡng cho cá',
        image: '/picture/thucan/betta.webp',
      },
    });
    console.log('✅ 6 Categories created');

    // Create products
    const products = [];

    // Cá Neon
    products.push(await prisma.product.upsert({
      where: { slug: 'ca-neon-xanh' },
      update: {},
      create: {
        name: 'Cá Neon Xanh',
        slug: 'ca-neon-xanh',
        description: 'Cá Neon xanh với sọc phát sáng đặc trưng',
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
        description: 'Cá Neon đỏ màu sắc rực rỡ',
        price: 10000,
        stock: 250,
        categoryId: catNeon.id,
        images: ['/picture/neon/redneon.webp'],
        size: '3-4cm',
        careLevel: 'EASY',
        isFeatured: true,
        isActive: true,
      },
    }));

    products.push(await prisma.product.upsert({
      where: { slug: 'ca-cardinal-tetra' },
      update: {},
      create: {
        name: 'Cá Cardinal Tetra',
        slug: 'ca-cardinal-tetra',
        description: 'Cá Cardinal Tetra đẹp mắt',
        price: 12000,
        stock: 180,
        categoryId: catNeon.id,
        images: ['/picture/neon/cardinaltetrabred.webp'],
        size: '4-5cm',
        careLevel: 'EASY',
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
        description: 'Cá Chuột xanh dọn dẹp bể cá hiệu quả',
        price: 25000,
        stock: 100,
        categoryId: catChuot.id,
        images: ['/picture/cachuot/16-ca-chuot-xanh.jpg'],
        size: '5-7cm',
        careLevel: 'EASY',
        isFeatured: true,
        isActive: true,
      },
    }));

    products.push(await prisma.product.upsert({
      where: { slug: 'ca-chuot-zebra' },
      update: {},
      create: {
        name: 'Cá Chuột Zebra',
        slug: 'ca-chuot-zebra',
        description: 'Cá Chuột Zebra với sọc đen trắng',
        price: 28000,
        stock: 90,
        categoryId: catChuot.id,
        images: ['/picture/cachuot/18-ca-chuot-zebra.jpg'],
        size: '5-7cm',
        careLevel: 'EASY',
        isActive: true,
      },
    }));

    // Combo
    products.push(await prisma.product.upsert({
      where: { slug: 'combo-ca-neon-vua' },
      update: {},
      create: {
        name: 'Combo Cá Neon Vua',
        slug: 'combo-ca-neon-vua',
        description: 'Combo 10 con cá Neon Vua',
        price: 150000,
        salePrice: 120000,
        stock: 50,
        categoryId: catCombo.id,
        images: ['/picture/comboca/02-combo-ca-neon-vua.jpg'],
        isFeatured: true,
        isActive: true,
      },
    }));

    // Cá Đĩa
    products.push(await prisma.product.upsert({
      where: { slug: 'ca-dia-do-trang' },
      update: {},
      create: {
        name: 'Cá Đĩa Đỏ Trắng',
        slug: 'ca-dia-do-trang',
        description: 'Cá Đĩa đỏ trắng đẹp mắt',
        price: 350000,
        salePrice: 300000,
        stock: 25,
        categoryId: catTongHop.id,
        images: ['/picture/catonghop/21-ca-dia-do-trang.jpg'],
        size: '12-15cm',
        careLevel: 'MODERATE',
        isFeatured: true,
        isActive: true,
      },
    }));

    products.push(await prisma.product.upsert({
      where: { slug: 'ca-phuong-hoang-lua' },
      update: {},
      create: {
        name: 'Cá Phượng Hoàng Lửa',
        slug: 'ca-phuong-hoang-lua',
        description: 'Cá Phượng Hoàng lửa màu đỏ cam',
        price: 180000,
        salePrice: 150000,
        stock: 40,
        categoryId: catTongHop.id,
        images: ['/picture/catonghop/34-ca-phuong-hoang-lua.jpg'],
        size: '8-10cm',
        careLevel: 'EASY',
        isFeatured: true,
        isActive: true,
      },
    }));

    // Bể kính
    products.push(await prisma.product.upsert({
      where: { slug: 'be-kinh-40cm' },
      update: {},
      create: {
        name: 'Bể Kính 40cm',
        slug: 'be-kinh-40cm',
        description: 'Bể kính 40x25x30cm',
        price: 280000,
        stock: 40,
        categoryId: catBeKinh.id,
        images: ['/picture/bekinh/be2.jfif'],
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
        description: 'Bể kính 60x35x40cm',
        price: 550000,
        salePrice: 500000,
        stock: 30,
        categoryId: catBeKinh.id,
        images: ['/picture/bekinh/be4.jfif'],
        isFeatured: true,
        isActive: true,
      },
    }));

    // Thức ăn
    products.push(await prisma.product.upsert({
      where: { slug: 'thuc-an-betta' },
      update: {},
      create: {
        name: 'Thức Ăn Betta',
        slug: 'thuc-an-betta',
        description: 'Thức ăn chuyên dụng cho cá Betta',
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
        description: 'Thức ăn viên nhỏ cho cá Neon',
        price: 35000,
        stock: 120,
        categoryId: catThucAn.id,
        images: ['/picture/thucan/neon.webp'],
        isFeatured: true,
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
          comment: 'Cá Neon đẹp lắm, khỏe mạnh!',
          isVisible: true,
        },
        {
          userId: customer.id,
          productId: products[3].id,
          rating: 5,
          comment: 'Cá Chuột dọn bể sạch sẽ',
          isVisible: true,
        },
      ],
    });
    console.log('✅ Reviews created');

    // Create coupon
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
    console.log('✅ Coupon created');

    // Create blog posts
    await prisma.blogPost.create({
      data: {
        title: 'Hướng Dẫn Nuôi Cá Neon',
        slug: 'huong-dan-nuoi-ca-neon',
        excerpt: 'Cá Neon là loại cá dễ nuôi cho người mới',
        content: 'Cá Neon rất dễ nuôi...',
        coverImage: '/picture/neon/bongxanhneon.webp',
        authorId: admin.id,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    await prisma.blogPost.create({
      data: {
        title: 'Top 5 Loại Cá Dễ Nuôi',
        slug: 'top-5-loai-ca-de-nuoi',
        excerpt: 'Bạn mới bắt đầu? Đây là 5 loại cá dễ nuôi nhất',
        content: 'Top 5 loại cá...',
        coverImage: '/picture/comboca/02-combo-ca-neon-vua.jpg',
        authorId: admin.id,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    console.log('✅ Blog posts created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('Products:', products.length);
    console.log('Categories: 6');
    console.log('\n📝 Login: admin@aquafish.com / admin123');

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
