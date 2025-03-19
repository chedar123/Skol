import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/forum/threads/[id] - Hämta en tråd med inlägg
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Hämta trådinformation
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
    
    // Uppdatera visningsantal
    await prisma.thread.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });
    
    // Hämta inlägg i tråden
    const totalPosts = await prisma.post.count({
      where: { threadId: id }
    });
    
    const posts = await prisma.post.findMany({
      where: { threadId: id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            createdAt: true,
            reputation: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      skip,
      take: limit
    });
    
    return NextResponse.json({
      thread,
      posts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching thread:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta tråd och inlägg' },
      { status: 500 }
    );
  }
}

// PUT /api/forum/threads/[id] - Uppdatera en tråd
export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är inloggad
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Du måste vara inloggad för att uppdatera en tråd' },
        { status: 401 }
      );
    }
    
    // Hämta tråden för att kontrollera ägare
    const thread = await prisma.thread.findUnique({
      where: { id },
      select: { authorId: true, isLocked: true }
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
        { error: 'Tråden är låst och kan inte uppdateras' },
        { status: 403 }
      );
    }
    
    // Kontrollera behörighet (endast ägare eller admin/moderator kan uppdatera)
    const isOwner = thread.authorId === session.user.id;
    const isAdminOrMod = session.user.role === 'ADMIN' || session.user.role === 'MODERATOR';
    
    if (!isOwner && !isAdminOrMod) {
      return NextResponse.json(
        { error: 'Du har inte behörighet att uppdatera denna tråd' },
        { status: 403 }
      );
    }
    
    const { title, content, isSticky, isLocked } = await request.json();
    
    // Endast admin/moderator kan ändra isSticky och isLocked
    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    
    if (isAdminOrMod) {
      if (typeof isSticky === 'boolean') updateData.isSticky = isSticky;
      if (typeof isLocked === 'boolean') updateData.isLocked = isLocked;
    }
    
    // Uppdatera tråden
    const updatedThread = await prisma.thread.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
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
    
    return NextResponse.json({ thread: updatedThread });
  } catch (error) {
    console.error('Error updating thread:', error);
    return NextResponse.json(
      { error: 'Kunde inte uppdatera tråden' },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/threads/[id] - Ta bort en tråd
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är inloggad
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Du måste vara inloggad för att ta bort en tråd' },
        { status: 401 }
      );
    }
    
    // Hämta tråden för att kontrollera ägare
    const thread = await prisma.thread.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!thread) {
      return NextResponse.json(
        { error: 'Tråden hittades inte' },
        { status: 404 }
      );
    }
    
    // Kontrollera behörighet (endast ägare eller admin/moderator kan ta bort)
    const isOwner = thread.authorId === session.user.id;
    const isAdminOrMod = session.user.role === 'ADMIN' || session.user.role === 'MODERATOR';
    
    if (!isOwner && !isAdminOrMod) {
      return NextResponse.json(
        { error: 'Du har inte behörighet att ta bort denna tråd' },
        { status: 403 }
      );
    }
    
    // Ta bort tråden och alla relaterade inlägg och likes
    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          post: {
            threadId: id
          }
        }
      }),
      prisma.post.deleteMany({
        where: { threadId: id }
      }),
      prisma.thread.delete({
        where: { id }
      })
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json(
      { error: 'Kunde inte ta bort tråden' },
      { status: 500 }
    );
  }
}

// PATCH /api/forum/threads/[id] - Låsa/låsa upp en tråd
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är admin eller moderator
    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
      return NextResponse.json(
        { error: 'Du har inte behörighet att utföra denna åtgärd' },
        { status: 403 }
      );
    }
    
    // Hämta data för uppdatering
    const { isLocked, isSticky } = await request.json();
    
    // Hämta tråden
    const thread = await prisma.thread.findUnique({
      where: { id }
    });
    
    if (!thread) {
      return NextResponse.json(
        { error: 'Tråden hittades inte' },
        { status: 404 }
      );
    }
    
    // Uppdatera tråden
    const updateData: any = {};
    
    if (isLocked !== undefined) {
      updateData.isLocked = isLocked;
    }
    
    if (isSticky !== undefined) {
      updateData.isSticky = isSticky;
    }
    
    const updatedThread = await prisma.thread.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json({ thread: updatedThread });
  } catch (error) {
    console.error('Fel vid uppdatering av tråd:', error);
    return NextResponse.json(
      { error: 'Kunde inte uppdatera tråden' },
      { status: 500 }
    );
  }
} 