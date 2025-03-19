// Skript för att skapa saknade första inlägg för befintliga trådar
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createMissingPosts() {
  try {
    console.log('Letar efter trådar som saknar inlägg...');
    
    // Hämta alla trådar
    const threads = await prisma.thread.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });
    
    console.log(`Hittade totalt ${threads.length} trådar`);
    
    // Filtrera ut trådar som saknar inlägg
    const threadsWithoutPosts = threads.filter(thread => thread._count.posts === 0);
    
    console.log(`${threadsWithoutPosts.length} trådar saknar inlägg`);
    
    // Skapa ett inlägg för varje tråd som saknar ett
    if (threadsWithoutPosts.length > 0) {
      console.log('Skapar saknade inlägg...');
      
      const creationPromises = threadsWithoutPosts.map(async (thread) => {
        try {
          const post = await prisma.post.create({
            data: {
              content: thread.content,
              authorId: thread.authorId,
              threadId: thread.id
            }
          });
          
          console.log(`Skapade inlägg för tråd: ${thread.title} (ID: ${thread.id})`);
          return post;
        } catch (err) {
          console.error(`Fel vid skapande av inlägg för tråd ${thread.id}:`, err);
          return null;
        }
      });
      
      const results = await Promise.all(creationPromises);
      const successfulCreations = results.filter(result => result !== null);
      
      console.log(`Slutfört: ${successfulCreations.length} inlägg skapade framgångsrikt`);
    } else {
      console.log('Alla trådar har redan inlägg. Inget att göra.');
    }
  } catch (error) {
    console.error('Ett fel uppstod:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Kör skriptet
createMissingPosts(); 