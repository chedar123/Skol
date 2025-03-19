import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { authOptions } from '@/lib/auth';

// GET /api/forum/threads - Hämta trådar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const authorId = searchParams.get('authorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Bygga query baserat på parametrar
    const whereClause: any = {};
    
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    
    if (authorId) {
      whereClause.authorId = authorId;
      
      // Om användaren tittar på sina egna trådar, se till att de är autentiserade
      if (authorId) {
        const session = await getServerSession(authOptions);
        if (authorId === session?.user?.id) {
          // OK
        } else if (session?.user?.role === 'ADMIN' || session?.user?.role === 'MODERATOR') {
          // Admins och moderatorer kan se andras trådar
        } else {
          return NextResponse.json(
            { error: 'Du har inte behörighet att se andra användares trådar' },
            { status: 403 }
          );
        }
      }
    }
    
    // Hämta trådar med pagination
    const [threads, totalCount] = await Promise.all([
      prisma.thread.findMany({
        where: whereClause,
        orderBy: [
          { isSticky: 'desc' },
          { lastPostAt: 'desc' }
        ],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              posts: true
            }
          }
        },
        skip,
        take: limit
      }),
      prisma.thread.count({
        where: whereClause
      })
    ]);
    
    // Bearbeta trådar för att lägga till excerpt
    const threadsWithExcerpt = await Promise.all(threads.map(async thread => {
      // Hämta första inlägget för tråden
      const firstPost = await prisma.post.findFirst({
        where: { threadId: thread.id },
        orderBy: { createdAt: 'asc' }
      });
      
      // Ta bort HTML-taggar och extrahera en kort del av innehållet
      let excerpt = '';
      if (firstPost?.content) {
        const plainText = firstPost.content.replace(/<[^>]*>?/gm, '');
        excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
      }
      
      return {
        ...thread,
        excerpt
      };
    }));
    
    // Beräkna pagination-info
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      threads: threadsWithExcerpt,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta trådar' },
      { status: 500 }
    );
  }
}

// POST /api/forum/threads - Skapa en ny tråd
export async function POST(request: NextRequest) {
  try {
    // Använd authOptions explicit för att få samma konfigurationshantering
    const session = await getServerSession(authOptions);
    console.log('Session vid trådskapande:', session);
    
    // Kontrollera att användaren är inloggad
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Du måste vara inloggad för att skapa en tråd" },
        { status: 401 }
      );
    }

    // Utgå från att användar-ID nu finns i session tack vare förbättrad auth-konfiguration
    // Om inte, försök med token
    let userId = session.user.id;
    
    if (!userId) {
      // Fallback till token
      const token = await getToken({ req: request });
      console.log('JWT token vid trådskapande:', token);
      userId = token?.id as string || token?.userId as string || token?.sub as string;
    }
    
    if (!userId) {
      console.error("Sessionsfel: Användar-ID saknas");
      return NextResponse.json(
        { error: "Sessionsfel: Användar-ID saknas" },
        { status: 401 }
      );
    }
    
    console.log('Använder användar-ID:', userId);
    
    const body = await request.json();
    console.log('Mottagen data för trådskapande:', body);
    
    const { title, content, categoryId } = body;
    
    // Validera indata
    if (!title) {
      return NextResponse.json(
        { error: 'Titel krävs för att skapa en tråd' },
        { status: 400 }
      );
    }
    
    if (!content) {
      return NextResponse.json(
        { error: 'Innehåll krävs för att skapa en tråd' },
        { status: 400 }
      );
    }
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'Kategori-ID krävs för att skapa en tråd' },
        { status: 400 }
      );
    }
    
    // Kontrollera att kategorin finns
    try {
      console.log('Försöker hitta kategori med ID:', categoryId);
      
      const category = await prisma.forumCategory.findUnique({
        where: { id: categoryId }
      });
      
      console.log('Resultat av kategorisökning:', category);
      
      if (!category) {
        console.error(`Kategori med ID '${categoryId}' hittades inte`);
        return NextResponse.json(
          { error: `Kategorin hittades inte. ID: ${categoryId}` },
          { status: 404 }
        );
      }
      
      // Skapa en slug från titeln - använd makeUnique=true för att skapa unika slugs
      const slug = slugify(title, true);
      
      // Skapa tråden
      // @ts-ignore - Ignorera typfel om content-egenskap saknas i Thread-modellen
      const thread = await prisma.thread.create({
        data: {
          title,
          slug,
          authorId: userId,
          categoryId,
          lastPostAt: new Date(),
          lastPostById: userId
        }
      });
      
      // Skapa det första inlägget i tråden med samma innehåll
      await prisma.post.create({
        data: {
          content,
          authorId: userId,
          threadId: thread.id
        }
      });
      
      // Öka användarens rykte för att skapa en ny tråd (+2 poäng för trådskapande)
      await prisma.user.update({
        where: { id: userId },
        data: { reputation: { increment: 2 } }
      });
      
      console.log(`Användare ${userId} fick +2 i rykte för att skapa ny tråd ${thread.id}`);
      
      console.log('Tråd skapad framgångsrikt:', thread);
      return NextResponse.json({ thread }, { status: 201 });
    } catch (categoryError) {
      console.error('Error checking category:', categoryError);
      // Mer detaljerad felinformation
      return NextResponse.json(
        { 
          error: 'Ett fel uppstod när kategorin kontrollerades', 
          details: categoryError instanceof Error ? categoryError.message : String(categoryError),
          stack: categoryError instanceof Error ? categoryError.stack : undefined 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating forum thread:', error);
    return NextResponse.json(
      { error: 'Kunde inte skapa forumtråd', details: error instanceof Error ? error.message : undefined },
      { status: 500 }
    );
  }
} 