import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// POST /api/forum/posts - Skapa ett nytt inlägg
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Kontrollera att användaren är inloggad
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Du måste vara inloggad för att skapa ett inlägg' },
        { status: 401 }
      );
    }
    
    const { content, threadId } = await request.json();
    
    // Validera indata
    if (!content || !threadId) {
      return NextResponse.json(
        { error: 'Innehåll och tråd-ID krävs' },
        { status: 400 }
      );
    }
    
    // Kontrollera att tråden finns och inte är låst
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { id: true, isLocked: true }
    });
    
    if (!thread) {
      return NextResponse.json(
        { error: 'Tråden hittades inte' },
        { status: 404 }
      );
    }
    
    // Kontrollera om tråden är låst
    if (thread.isLocked) {
      return NextResponse.json(
        { error: 'Tråden är låst och nya inlägg kan inte läggas till' },
        { status: 403 }
      );
    }
    
    // Skapa inlägget
    const post = await prisma.post.create({
      data: {
        content,
        authorId: session.user.id,
        threadId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true
          }
        }
      }
    });
    
    // Uppdatera trådens senaste inlägg-tidpunkt
    await prisma.thread.update({
      where: { id: threadId },
      data: {
        lastPostAt: new Date(),
        lastPostById: session.user.id
      }
    });
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Kunde inte skapa inlägget' },
      { status: 500 }
    );
  }
}

// GET /api/forum/posts - Hämta inlägg med filtrering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');
    const threadId = searchParams.get('threadId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Bygg filter
    const whereClause: any = {};
    
    if (authorId) {
      whereClause.authorId = authorId;
      
      // Om användaren letar efter sina egna inlägg, se till att de är autentiserade
      const session = await getServerSession(authOptions);
      if (authorId === session?.user?.id) {
        // OK
      } else if (session?.user?.role === 'ADMIN' || session?.user?.role === 'MODERATOR') {
        // Admins och moderatorer kan se andras inlägg
      } else {
        return NextResponse.json(
          { error: 'Du har inte behörighet att se andra användares inlägg' },
          { status: 403 }
        );
      }
    }
    
    if (threadId) {
      whereClause.threadId = threadId;
    }
    
    // Hämta inläggen
    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          }
        },
        thread: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });
    
    // Hämta totalt antal för paginering
    const totalPosts = await prisma.post.count({
      where: whereClause
    });
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit)
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