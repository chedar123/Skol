import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Rensa befintliga kategorier för att undvika dubbletter
  // await prisma.forumCategory.deleteMany({});
  
  console.log('Skapar forumkategorier...');
  
  // Skapa nya kategorier
  const categories = [
    {
      name: 'Casinobonusar',
      description: 'Diskussioner om olika casinobonusar och erbjudanden',
      slug: 'casinobonusar',
      order: 1,
    },
    {
      name: 'Slots & Spelautomater',
      description: 'Diskussioner om slots och spelautomater',
      slug: 'slots-spelautomater',
      order: 2,
    },
    {
      name: 'Bordsspel',
      description: 'Diskussioner om bordsspel som blackjack, roulette och poker',
      slug: 'bordsspel',
      order: 3,
    },
    {
      name: 'Allmänt',
      description: 'Allmänna diskussioner om casinorelaterade ämnen',
      slug: 'allmant',
      order: 4,
    },
  ];
  
  for (const category of categories) {
    // Kontrollera om kategorin redan finns
    const existingCategory = await prisma.forumCategory.findUnique({
      where: { slug: category.slug },
    });
    
    if (!existingCategory) {
      await prisma.forumCategory.create({
        data: category,
      });
      console.log(`Kategori skapad: ${category.name}`);
    } else {
      console.log(`Kategori finns redan: ${category.name}`);
    }
  }
  
  console.log('Seed slutförd!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 