// Migreringsscript för att flytta Thread.content till Post-tabellen
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateThreadContent() {
  try {
    console.log('Startar migrering av Thread.content till Post-tabellen...');
    
    // Hämta alla trådar
    const threads = await prisma.thread.findMany({
      include: {
        posts: {
          orderBy: {
            createdAt: 'asc'
          },
          take: 1
        }
      }
    });
    
    console.log(`Hittade ${threads.length} trådar att bearbeta.`);
    
    let updatedCount = 0;
    let createdCount = 0;
    
    // Bearbeta varje tråd
    for (const thread of threads) {
      // Om tråden har ett första inlägg, uppdatera det med innehållet från tråden
      if (thread.posts.length > 0) {
        const firstPost = thread.posts[0];
        
        // Kontrollera om innehållet behöver uppdateras
        if (firstPost.content !== thread.content) {
          await prisma.post.update({
            where: { id: firstPost.id },
            data: { content: thread.content }
          });
          updatedCount++;
          console.log(`Uppdaterade innehåll för post ${firstPost.id} i tråd ${thread.id}`);
        }
      } else {
        // Om tråden inte har något inlägg, skapa ett nytt med innehållet från tråden
        await prisma.post.create({
          data: {
            content: thread.content,
            authorId: thread.authorId,
            threadId: thread.id
          }
        });
        createdCount++;
        console.log(`Skapade nytt inlägg för tråd ${thread.id}`);
      }
    }
    
    console.log(`Migrering slutförd: ${updatedCount} inlägg uppdaterade, ${createdCount} inlägg skapade.`);
  } catch (error) {
    console.error('Ett fel uppstod under migreringen:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Kör migreringen
migrateThreadContent(); 