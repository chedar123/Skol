import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/forum/threads/[id]/posts - Hämta inlägg i en tråd
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { searchParams } = new URL(request.url);
    
    const page = searchParams.get('page');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Kontrollera om tråden finns
    const thread = await prisma.thread.findUnique({
      where: { id },
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
        }
      }
    });
    
    if (!thread) {
      return NextResponse.json(
        { error: 'Tråden hittades inte' },
        { status: 404 }
      );
    }
    
    // Uppdatera trådens visningar
    await prisma.thread.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
    
    // Logik för pagination
    let skip = 0;
    let pageNum = parseInt(page || '1');
    
    // För 'last' parameter, beräkna sista sidan
    if (page === 'last') {
      const totalPosts = await prisma.post.count({
        where: { threadId: id }
      });
      
      pageNum = Math.ceil(totalPosts / limit) || 1;
      skip = (pageNum - 1) * limit;
    } else {
      skip = (pageNum - 1) * limit;
    }
    
    // Hämta inlägg med pagination
    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where: { threadId: id },
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
              reputation: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              likes: true
            }
          }
        },
        skip,
        take: limit
      }),
      prisma.post.count({
        where: { threadId: id }
      })
    ]);
    
    // Kontrollera om användaren är inloggad för att se om de har gillat inläggen
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;
    
    // Om sessionen inte fungerar, försök med JWT-token
    if (!userId) {
      const token = await getToken({ req: request });
      userId = token?.id || token?.sub;
    }
    
    let postsWithLikeStatus = posts;
    
    if (userId) {
      // Hämta användarens likes för dessa inlägg
      const likes = await prisma.like.findMany({
        where: {
          postId: { in: posts.map(post => post.id) },
          userId
        },
        select: {
          postId: true
        }
      });
      
      const likedPostIds = new Set(likes.map((like: { postId: string }) => like.postId));
      
      // Lägg till hasLiked till varje inlägg
      postsWithLikeStatus = posts.map(post => ({
        ...post,
        hasLiked: likedPostIds.has(post.id)
      }));
    }
    
    // Beräkna pagination-info
    const totalPages = Math.ceil(totalPosts / limit);
    
    return NextResponse.json({
      thread,
      posts: postsWithLikeStatus,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasMore: pageNum < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta inlägg' },
      { status: 500 }
    );
  }
}

// POST /api/forum/threads/[id]/posts - Skapa ett nytt inlägg i en tråd
export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Använd authOptions explicit för att få samma konfigurationshantering
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är inloggad
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Du måste vara inloggad för att skriva inlägg" },
        { status: 401 }
      );
    }

    // Utgå från att användar-ID nu finns i session tack vare förbättrad auth-konfiguration
    let userId = session.user.id;
    
    // Om ID fortfarande saknas, försök med token som fallback
    if (!userId) {
      const token = await getToken({ req: request });
      userId = token?.id as string || token?.userId as string || token?.sub as string;
      
      // Logga för felsökning
      console.log('Token info:', token);
    }
    
    // Logga för felsökning
    console.log('Session:', session);
    console.log('User ID från session/token:', userId);
    
    if (!userId) {
      console.error('Sessionsfel: Användar-ID saknas');
      return NextResponse.json(
        { error: 'Sessionsfel: Användar-ID saknas' },
        { status: 401 }
      );
    }
    
    // Kontrollera att tråden finns och inte är låst
    const thread = await prisma.thread.findUnique({
      where: { id }
    });
    
    if (!thread) {
      return NextResponse.json(
        { error: 'Tråden hittades inte' },
        { status: 404 }
      );
    }
    
    if (thread.isLocked) {
      return NextResponse.json(
        { error: 'Tråden är låst och nya inlägg tillåts inte' },
        { status: 403 }
      );
    }
    
    // Validera inlägget
    const body = await request.json();
    const { content } = body;
    
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Inlägget kan inte vara tomt' },
        { status: 400 }
      );
    }
    
    // Skapa inlägget
    const post = await prisma.post.create({
      data: {
        content,
        authorId: userId,
        threadId: id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            reputation: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });
    
    // Uppdatera trådens senaste aktivitet
    await prisma.thread.update({
      where: { id },
      data: {
        lastPostAt: new Date(),
        lastPostById: userId
      }
    });
    
    // Öka användarens rykte för aktivt deltagande i forumet (+1 poäng för varje nytt inlägg)
    await prisma.user.update({
      where: { id: userId },
      data: { reputation: { increment: 1 } }
    });
    
    console.log(`Användare ${userId} fick +1 i rykte för nytt inlägg i tråd ${id}`);
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { 
        error: 'Kunde inte skapa inlägget',
        details: error instanceof Error ? error.message : 'Okänt fel'
      },
      { status: 500 }
    );
  }
} 