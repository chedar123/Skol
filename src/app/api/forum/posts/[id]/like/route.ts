import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/forum/posts/[id]/like - Gilla eller ta bort gillande av ett inlägg
export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Du måste vara inloggad för att gilla inlägg' },
        { status: 401 }
      );
    }
    
    // Hämta användar-ID från session
    const userId = session?.user?.id;
    
    if (!userId) {
      console.error('Användare inloggad men saknar ID:', session);
      return NextResponse.json(
        { error: 'Användar-ID saknas' },
        { status: 400 }
      );
    }
    
    // Kontrollera att inlägget finns
    const post = await prisma.post.findUnique({
      where: { id }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Inlägget hittades inte' },
        { status: 404 }
      );
    }
    
    // Hitta eventuellt befintlig like
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        postId: id
      }
    });
    
    let result;
    
    // Ta bort like om den finns, annars skapa en ny
    if (existingLike) {
      // Ta bort like
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      
      // Minska användarens reputation om inlägget inte längre gillas av någon annan
      if (post.authorId !== userId) {
        await prisma.user.update({
          where: { id: post.authorId },
          data: { reputation: { decrement: 1 } }
        });
        console.log(`Användare ${post.authorId} fick -1 i rykte från borttagen like av ${userId}`);
      }
      
      result = { liked: false };
    } else {
      // Skapa ny like
      await prisma.like.create({
        data: {
          user: {
            connect: { id: userId }
          },
          post: {
            connect: { id }
          }
        }
      });
      
      // Öka användarens reputation om inlägget gillades av någon annan
      if (post.authorId !== userId) {
        await prisma.user.update({
          where: { id: post.authorId },
          data: { reputation: { increment: 1 } }
        });
        console.log(`Användare ${post.authorId} fick +1 i rykte från ny like av ${userId}`);
      }
      
      result = { liked: true };
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Kunde inte hantera gillande av inlägg' },
      { status: 500 }
    );
  }
} 