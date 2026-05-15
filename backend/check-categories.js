const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    console.log('=== CATEGORIES IN DATABASE ===');
    categories.forEach(cat => {
      console.log(`- ${cat.name} (slug: ${cat.slug}) - ${cat._count.products} products`);
    });
    
    console.log('\n=== PRODUCTS BY CATEGORY ===');
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    products.forEach(p => {
      console.log(`${p.name} -> Category: ${p.category.name} (${p.category.slug})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
