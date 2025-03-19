// Skript för att skapa casinobonusar-sverige kategorin
// Kör med: node create-category.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCategory() {
  try {
    console.log('Kontrollerar om casinobonusar-sverige kategorin redan finns...');
    
    // Kontrollera om kategorin redan finns
    const existingCategory = await prisma.forumCategory.findUnique({
      where: { slug: 'casinobonusar-sverige' }
    });
    
    if (existingCategory) {
      console.log('Kategorin finns redan:', existingCategory);
      return;
    }
    
    console.log('Skapar casinobonusar-sverige kategorin...');
    
    // Skapa kategorin direkt via Prisma
    const newCategory = await prisma.forumCategory.create({
      data: {
        name: 'Casinobonusar Sverige',
        description: 'Diskussion om svenska casinobonusar, villkor och exklusiva erbjudanden.',
        slug: 'casinobonusar-sverige',
        order: 3,
      }
    });
    
    console.log('Kategori skapad:', newCategory);
  } catch (error) {
    console.error('Fel:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Kör funktionen när skriptet körs
createCategory(); 