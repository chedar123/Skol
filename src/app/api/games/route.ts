import { NextRequest, NextResponse } from 'next/server';
import { loadGamesFromCSV } from '@/lib/data/games-data';

export async function GET(request: NextRequest) {
  try {
    // Hämta alla spel från CSV-filen
    const allGames = await loadGamesFromCSV();
    
    // Hämta sökparametrar
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';
    const provider = searchParams.get('provider')?.toLowerCase() || '';
    
    // Filtrera spel baserat på sökning och provider
    let filteredGames = [...allGames];
    
    if (query) {
      filteredGames = filteredGames.filter(game => 
        game.name.toLowerCase().includes(query)
      );
    }
    
    if (provider) {
      filteredGames = filteredGames.filter(game => 
        game.provider.toLowerCase() === provider.toLowerCase()
      );
    }
    
    // Samla in alla unika leverantörer och sortera dem
    const providers = [...new Set(allGames.map(game => game.provider))].sort();
    
    // Returnera resultatet
    return NextResponse.json({
      games: filteredGames,
      providers,
      filteredCount: filteredGames.length,
      totalCount: allGames.length
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
} 