import { NextRequest, NextResponse } from 'next/server';
import { loadGamesFromCSV } from '@/lib/data/games-data';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Inget spel-ID angavs' },
        { status: 400 }
      );
    }
    
    // Ladda alla spel
    const games = await loadGamesFromCSV();
    
    // Hitta spelet med rätt ID
    const game = games.find(game => game.id === id);
    
    if (!game) {
      return NextResponse.json(
        { error: 'Spelet hittades inte' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ game });
  } catch (error) {
    console.error('Fel vid hämtning av spel:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta spelinformation' },
      { status: 500 }
    );
  }
} 