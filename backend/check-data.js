const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const userCount = await prisma.user.count();
    const blogCount = await prisma.blogPost.count();
    
    console.log('=== DATABASE CHECK ===');
    console.log('Products:', productCount);
    console.log('Categories:', categoryCount);
    console.log('Users:', userCount);
    console.log('Blog Posts:', blogCount);
    
    if (productCount === 0) {
      console.log('\n❌ Database is EMPTY! Seed did not run successfully.');
    } else {
      console.log('\n✅ Database has data!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
