import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/forum/categories/[id] - Hämta en kategori
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // Hämta kategori och räkna trådar
    const category = await prisma.forumCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            threads: true
          }
        }
      }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Kategorin hittades inte' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Fel vid hämtning av kategori:', error);
    return NextResponse.json(
      { 
        error: 'Kunde inte hämta kategorin',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// PATCH /api/forum/categories/[id] - Uppdatera en kategori
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är admin eller moderator
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'MODERATOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Kontrollera att kategorin finns
    const existingCategory = await prisma.forumCategory.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Kategorin hittades inte' },
        { status: 404 }
      );
    }
    
    // Kontrollera slug om den uppdateras
    if (data.slug && data.slug !== existingCategory.slug) {
      const categoryWithSlug = await prisma.forumCategory.findUnique({
        where: { slug: data.slug }
      });
      
      if (categoryWithSlug) {
        return NextResponse.json(
          { error: 'En kategori med denna slug finns redan' },
          { status: 400 }
        );
      }
    }
    
    // Uppdatera kategorin
    const updatedCategory = await prisma.forumCategory.update({
      where: { id },
      data
    });
    
    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error('Fel vid uppdatering av kategori:', error);
    return NextResponse.json(
      { 
        error: 'Kunde inte uppdatera kategorin',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/categories/[id] - Ta bort en kategori
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är admin
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Du måste vara administratör för att ta bort en kategori' },
        { status: 403 }
      );
    }
    
    // Kontrollera att kategorin finns
    const existingCategory = await prisma.forumCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            threads: true
          }
        }
      }
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Kategorin hittades inte' },
        { status: 404 }
      );
    }
    
    // Ta bort kategorin (detta tar också bort relaterade trådar pga. onDelete: Cascade)
    await prisma.forumCategory.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      message: 'Kategorin har tagits bort',
      deletedCategory: existingCategory
    });
  } catch (error) {
    console.error('Fel vid borttagning av kategori:', error);
    return NextResponse.json(
      { 
        error: 'Kunde inte ta bort kategorin',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 