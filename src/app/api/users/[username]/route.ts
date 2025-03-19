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
    
    if (!username) {
      return NextResponse.json(
        { error: 'Användarnamn eller ID krävs' },
        { status: 400 }
      );
    }
    
    // Försök hitta användaren, antingen via ID eller namn
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: username },
          { name: username }
        ]
      },
      include: {
        _count: {
          select: {
            threads: true,
            posts: true
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Användaren hittades inte' },
        { status: 404 }
      );
    }
    
    // Returnera användaren med deras aktivitetsstatistik
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        reputation: user.reputation,
        _count: user._count
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta användarinformation' },
      { status: 500 }
    );
  }
} 