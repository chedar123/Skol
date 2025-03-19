import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/forum/categories - Hämta alla kategorier
export async function GET(request: NextRequest) {
  try {
    console.log('Hämtar alla forumkategorier');
    
    const categories = await prisma.forumCategory.findMany({
      orderBy: {
        order: "asc"
      },
      include: {
        _count: {
          select: {
            threads: true
          }
        }
      }
    });
    
    console.log(`Hittade ${categories.length} kategorier`);
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Fel vid hämtning av forumkategorier:', error);
    return NextResponse.json(
      { 
        error: 'Kunde inte hämta forumkategorier',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, description, slug, order } = data;

    // Validera indata
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Kontrollera om en kategori med denna slug redan finns
    const existingCategory = await prisma.forumCategory.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Skapa den nya kategorin
    const newCategory = await prisma.forumCategory.create({
      data: {
        name,
        description,
        slug,
        order: order || 0,
      }
    });

    return NextResponse.json({ category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
