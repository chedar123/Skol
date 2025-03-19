import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/forum/posts/[id] - Hämta ett specifikt inlägg
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            reputation: true
          }
        },
        thread: {
          select: {
            id: true,
            title: true,
            slug: true,
            isLocked: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Inlägget hittades inte' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta inlägget' },
      { status: 500 }
    );
  }
}

// PUT /api/forum/posts/[id] - Uppdatera ett inlägg
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
        { error: 'Du måste vara inloggad för att uppdatera ett inlägg' },
        { status: 401 }
      );
    }
    
    // Hämta inlägget för att kontrollera ägare
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        thread: {
          select: {
            isLocked: true
          }
        }
      }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Inlägget hittades inte' },
        { status: 404 }
      );
    }
    
    // Kontrollera om tråden är låst
    if (post.thread.isLocked) {
      return NextResponse.json(
        { error: 'Tråden är låst och inlägg kan inte uppdateras' },
        { status: 403 }
      );
    }
    
    // Kontrollera behörighet (endast ägare eller admin/moderator kan uppdatera)
    const isOwner = post.authorId === session.user.id;
    const isAdminOrMod = session.user.role === 'ADMIN' || session.user.role === 'MODERATOR';
    
    if (!isOwner && !isAdminOrMod) {
      return NextResponse.json(
        { error: 'Du har inte behörighet att uppdatera detta inlägg' },
        { status: 403 }
      );
    }
    
    const { content } = await request.json();
    
    // Validera indata
    if (!content) {
      return NextResponse.json(
        { error: 'Innehåll krävs' },
        { status: 400 }
      );
    }
    
    // Uppdatera inlägget
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        content,
        isEdited: true,
        updatedAt: new Date()
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
    
    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Kunde inte uppdatera inlägget' },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/posts/[id] - Ta bort ett inlägg
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
        { error: 'Du måste vara inloggad för att ta bort ett inlägg' },
        { status: 401 }
      );
    }
    
    // Hämta inlägget för att kontrollera ägare
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        thread: {
          select: {
            id: true,
            isLocked: true
          }
        }
      }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Inlägget hittades inte' },
        { status: 404 }
      );
    }
    
    // Kontrollera om tråden är låst
    if (post.thread.isLocked && session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
      return NextResponse.json(
        { error: 'Tråden är låst och inlägg kan inte tas bort' },
        { status: 403 }
      );
    }
    
    // Kontrollera behörighet (endast ägare eller admin/moderator kan ta bort)
    const isOwner = post.authorId === session.user.id;
    const isAdminOrMod = session.user.role === 'ADMIN' || session.user.role === 'MODERATOR';
    
    if (!isOwner && !isAdminOrMod) {
      return NextResponse.json(
        { error: 'Du har inte behörighet att ta bort detta inlägg' },
        { status: 403 }
      );
    }
    
    // Ta bort inlägget
    await prisma.post.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      message: 'Inlägget har tagits bort'
    });
  } catch (error) {
    console.error('Fel vid borttagning av inlägg:', error);
    return NextResponse.json(
      { error: 'Kunde inte ta bort inlägget' },
      { status: 500 }
    );
  }
} 