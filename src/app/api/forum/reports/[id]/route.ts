import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/forum/reports/[id] - Uppdatera rapport (moderatoråtgärd)
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är admin eller moderator
    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
      return NextResponse.json(
        { error: 'Du har inte behörighet att hantera rapporter' },
        { status: 403 }
      );
    }
    
    const { status, resolution } = await request.json();
    
    // Validera indata
    if (!status || !['RESOLVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Ogiltig status, måste vara RESOLVED eller REJECTED' },
        { status: 400 }
      );
    }
    
    // Kontrollera att rapporten finns
    const report = await prisma.report.findUnique({
      where: { id }
    });
    
    if (!report) {
      return NextResponse.json(
        { error: 'Rapporten hittades inte' },
        { status: 404 }
      );
    }
    
    // Endast hantera rapporter som är i PENDING-status
    if (report.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Rapporten har redan hanterats' },
        { status: 400 }
      );
    }
    
    // Uppdatera rapporten
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status,
        resolution,
        resolvedById: session.user.id,
        resolvedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
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
                slug: true
              }
            }
          }
        },
        resolvedBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    return NextResponse.json({ report: updatedReport });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Kunde inte uppdatera rapporten' },
      { status: 500 }
    );
  }
} 