import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/forum/threads/[id]/accept-post - Markera ett inlägg som godkänt svar
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const session = await getServerSession(authOptions);
    
    // Användaren måste vara inloggad
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Du måste vara inloggad' },
        { status: 401 }
      );
    }
    
    const { postId } = await request.json();
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Inläggs-ID krävs' },
        { status: 400 }
      );
    }
    
    // Hämta tråden för att kontrollera om användaren är författaren
    const thread = await prisma.thread.findUnique({
      where: { id },
      select: {
        authorId: true,
        acceptedPostId: true
      }
    });
    
    if (!thread) {
      return NextResponse.json(
        { error: 'Tråden hittades inte' },
        { status: 404 }
      );
    }
    
    // Endast författaren till tråden eller admins/moderatorer kan markera svar som godkända
    if (
      thread.authorId !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'MODERATOR'
    ) {
      return NextResponse.json(
        { error: 'Du har inte behörighet att markera svar som godkända i denna tråd' },
        { status: 403 }
      );
    }
    
    // Kontrollera att inlägget finns i tråden
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        threadId: id
      },
      select: {
        id: true,
        authorId: true
      }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Inlägget hittades inte i den angivna tråden' },
        { status: 404 }
      );
    }
    
    // Avmarkera om det redan är markerat som godkänt
    if (thread.acceptedPostId === postId) {
      const updatedThread = await prisma.thread.update({
        where: { id },
        data: {
          acceptedPostId: null
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true
            }
          },
          category: true
        }
      });
      
      // Minska ryktet för användaren vars inlägg inte längre är accepterat
      // Minska med 15 poäng
      await prisma.user.update({
        where: { id: post.authorId },
        data: { reputation: { decrement: 15 } }
      });
      
      return NextResponse.json({
        message: 'Inlägget har avmarkerats som godkänt svar',
        thread: updatedThread
      });
    }
    
    // Om ett annat inlägg tidigare var markerat, avmarkera det och minska dess författares rykte
    if (thread.acceptedPostId) {
      const previousAcceptedPost = await prisma.post.findUnique({
        where: { id: thread.acceptedPostId },
        select: { authorId: true }
      });
      
      if (previousAcceptedPost) {
        // Minska ryktet för den tidigare författaren (- 15 poäng)
        await prisma.user.update({
          where: { id: previousAcceptedPost.authorId },
          data: { reputation: { decrement: 15 } }
        });
      }
    }
    
    // Uppdatera tråden med det godkända inlägget
    const updatedThread = await prisma.thread.update({
      where: { id },
      data: {
        acceptedPostId: postId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true
          }
        },
        category: true
      }
    });
    
    // Öka ryktet för användaren vars inlägg blev accepterat (+ 15 poäng)
    await prisma.user.update({
      where: { id: post.authorId },
      data: { reputation: { increment: 15 } }
    });
    
    return NextResponse.json({
      message: 'Inlägget har markerats som godkänt svar',
      thread: updatedThread
    });
  } catch (error) {
    console.error('Error accepting post:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel inträffade' },
      { status: 500 }
    );
  }
}

// POST /api/forum/threads/[id]/accept-post - Markera ett svar som accepterat
export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    const { postId } = body;
    
    const session = await getServerSession(authOptions);
    
    // Användaren måste vara inloggad
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Du måste vara inloggad' },
        { status: 401 }
      );
    }
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Inläggs-ID krävs' },
        { status: 400 }
      );
    }
    
    // Hämta tråden för att kontrollera om användaren är författaren
    const thread = await prisma.thread.findUnique({
      where: { id },
      select: {
        authorId: true,
        acceptedPostId: true
      }
    });
    
    if (!thread) {
      return NextResponse.json(
        { error: 'Tråden hittades inte' },
        { status: 404 }
      );
    }
    
    // Endast författaren till tråden eller admins/moderatorer kan markera svar som godkända
    if (
      thread.authorId !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'MODERATOR'
    ) {
      return NextResponse.json(
        { error: 'Du har inte behörighet att markera svar som godkända i denna tråd' },
        { status: 403 }
      );
    }
    
    // Kontrollera att inlägget finns i tråden
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        threadId: id
      },
      select: {
        id: true,
        authorId: true
      }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Inlägget hittades inte i den angivna tråden' },
        { status: 404 }
      );
    }
    
    // Avmarkera om det redan är markerat som godkänt
    if (thread.acceptedPostId === postId) {
      const updatedThread = await prisma.thread.update({
        where: { id },
        data: {
          acceptedPostId: null
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true
            }
          },
          category: true
        }
      });
      
      // Minska ryktet för användaren vars inlägg inte längre är accepterat
      // Minska med 15 poäng
      await prisma.user.update({
        where: { id: post.authorId },
        data: { reputation: { decrement: 15 } }
      });
      
      return NextResponse.json({
        message: 'Inlägget har avmarkerats som godkänt svar',
        thread: updatedThread
      });
    }
    
    // Om ett annat inlägg tidigare var markerat, avmarkera det och minska dess författares rykte
    if (thread.acceptedPostId) {
      const previousAcceptedPost = await prisma.post.findUnique({
        where: { id: thread.acceptedPostId },
        select: { authorId: true }
      });
      
      if (previousAcceptedPost) {
        // Minska ryktet för den tidigare författaren (- 15 poäng)
        await prisma.user.update({
          where: { id: previousAcceptedPost.authorId },
          data: { reputation: { decrement: 15 } }
        });
      }
    }
    
    // Uppdatera tråden med det godkända inlägget
    const updatedThread = await prisma.thread.update({
      where: { id },
      data: {
        acceptedPostId: postId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true
          }
        },
        category: true
      }
    });
    
    // Öka ryktet för användaren vars inlägg blev accepterat (+ 15 poäng)
    await prisma.user.update({
      where: { id: post.authorId },
      data: { reputation: { increment: 15 } }
    });
    
    return NextResponse.json({
      message: 'Inlägget har markerats som godkänt svar',
      thread: updatedThread
    });
  } catch (error) {
    console.error('Error accepting post:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel inträffade' },
      { status: 500 }
    );
  }
} 