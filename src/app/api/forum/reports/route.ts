import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/forum/reports - Hämta rapporter (för moderering)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Kolla användarens behörighet
    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
      return NextResponse.json(
        { error: 'Du har inte behörighet att se rapporter' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Hantera filtrering på status
    let statusFilter: any = {};
    if (statusParam) {
      const statuses = statusParam.split(',');
      statusFilter = {
        status: {
          in: statuses
        }
      };
    }
    
    // Hämta rapporter
    const reports = await prisma.report.findMany({
      where: statusFilter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        post: {
          select: {
            id: true,
            content: true,
            thread: {
              select: {
                id: true,
                title: true,
                slug: true,
              }
            }
          }
        },
        resolvedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });
    
    // Räkna totalt antal rapporter för paginering
    const totalReports = await prisma.report.count({
      where: statusFilter
    });
    
    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        totalReports,
        totalPages: Math.ceil(totalReports / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta rapporter' },
      { status: 500 }
    );
  }
}

// POST /api/forum/reports - Skapa en ny rapport
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Du måste vara inloggad för att rapportera inlägg' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { postId, reason } = body;
    
    if (!postId || !reason?.trim()) {
      return NextResponse.json(
        { error: 'Både inlägg-ID och anledning krävs' },
        { status: 400 }
      );
    }
    
    // Kolla att inlägget finns
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Inlägget hittades inte' },
        { status: 404 }
      );
    }
    
    // Kontrollera om användaren redan har rapporterat detta inlägg
    const existingReport = await prisma.report.findFirst({
      where: {
        postId,
        userId: session.user.id,
        status: 'PENDING'
      }
    });
    
    if (existingReport) {
      return NextResponse.json(
        { error: 'Du har redan rapporterat detta inlägg' },
        { status: 400 }
      );
    }
    
    // Skapa rapporten
    const report = await prisma.report.create({
      data: {
        reason,
        user: {
          connect: { id: session.user.id }
        },
        post: {
          connect: { id: postId }
        }
      }
    });
    
    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Kunde inte skapa rapporten' },
      { status: 500 }
    );
  }
} 