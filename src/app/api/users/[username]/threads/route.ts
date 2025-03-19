import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{
    username: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const username = resolvedParams.username;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!username) {
      return NextResponse.json(
        { error: 'Användarnamn eller ID krävs' },
        { status: 400 }
      );
    }
    
    // Hämta användarens ID först
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: username },
          { name: username }
        ]
      },
      select: { id: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Användaren hittades inte' },
        { status: 404 }
      );
    }
    
    // Beräkna pagination
    const skip = (page - 1) * limit;
    
    // Hämta trådar
    const [threads, totalThreads] = await Promise.all([
      prisma.thread.findMany({
        where: {
          authorId: user.id
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          },
          _count: {
            select: {
              posts: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: skip
      }),
      prisma.thread.count({
        where: {
          authorId: user.id
        }
      })
    ]);
    
    // Hämta första inlägget för varje tråd för att skapa excerpt
    const threadsWithExcerpts = await Promise.all(
      threads.map(async (thread) => {
        // Hämta första inlägget för att generera en excerpt
        const firstPost = await prisma.post.findFirst({
          where: {
            threadId: thread.id
          },
          orderBy: {
            createdAt: 'asc'
          },
          select: {
            content: true
          }
        });
        
        let excerpt = '';
        if (firstPost) {
          // Ta bort HTML-taggar och skapa en kort excerpt
          excerpt = firstPost.content
            .replace(/<[^>]*>/g, '')
            .slice(0, 150);
          
          if (firstPost.content.length > 150) {
            excerpt += '...';
          }
        }
        
        return {
          ...thread,
          excerpt
        };
      })
    );
    
    // Beräkna totalt antal sidor
    const totalPages = Math.ceil(totalThreads / limit);
    
    return NextResponse.json({
      threads: threadsWithExcerpts,
      pagination: {
        totalThreads,
        totalPages,
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching user threads:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta användarens trådar' },
      { status: 500 }
    );
  }
} 