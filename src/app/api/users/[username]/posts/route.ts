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
    
    // Hämta inlägg
    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
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
          thread: {
            select: {
              id: true,
              title: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: skip
      }),
      prisma.post.count({
        where: {
          authorId: user.id
        }
      })
    ]);
    
    // Bearbeta inläggen för att lägga till excerpt
    const postsWithExcerpts = posts.map(post => {
      // Ta bort HTML-taggar och skapa en kort excerpt
      const plainText = post.content.replace(/<[^>]*>/g, '');
      let excerpt = plainText.slice(0, 150);
      
      if (plainText.length > 150) {
        excerpt += '...';
      }
      
      return {
        ...post,
        excerpt
      };
    });
    
    // Beräkna totalt antal sidor
    const totalPages = Math.ceil(totalPosts / limit);
    
    return NextResponse.json({
      posts: postsWithExcerpts,
      pagination: {
        totalPosts,
        totalPages,
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta användarens inlägg' },
      { status: 500 }
    );
  }
} 