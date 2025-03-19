import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Game {
  id: string;
  name: string;
  provider: string;
  url: string;
  imageUrl?: string;
}

// Funktion för att läsa in data från CSV-filen
export async function loadGamesFromCSV(): Promise<Game[]> {
  try {
    // Läs CSV-filen
    const csvFilePath = path.join(process.cwd(), 'public/data/games.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    
    // Parsa CSV-innehållet
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    
    // Omvandla records till Game-objekt
    return records.map((record: any, index: number) => {
      // Skapa ett unikt ID från spelnamnet
      const id = `game-${index}-${record.Game?.toLowerCase().replace(/[^a-z0-9]/g, '-') || index}`;
      
      // Extrahera game ID från URL:en
      let gameId = '';
      try {
        const url = new URL(record.URL);
        gameId = url.searchParams.get('gid') || '';
      } catch (e) {
        console.error(`Kunde inte parsa URL för ${record.Game}:`, e);
      }
      
      // Skapa bild-URL baserat på game ID
      // Använder annan URL-struktur eftersom den tidigare inte fungerade
      const imageUrl = gameId ? 
        `https://demo.firstlookgames.com/thumb/square/${gameId}.jpg` : 
        `/images/slots/default-slot.jpg`;
      
      return {
        id,
        name: record.Game || `Spel ${index + 1}`,
        provider: record.Studio || 'Okänd leverantör',
        url: record.URL || '',
        imageUrl: imageUrl,
      };
    });
  } catch (error) {
    console.error('Fel vid inläsning av spel från CSV:', error);
    return [];
  }
}

// Funktion för att generera en URL-vänlig sträng (slug)
export function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9åäöÅÄÖ]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// För client-side användning kan vi ha en statisk spellista
export const dummyGames: Game[] = [
  {
    id: 'mystery-genie-fortunes',
    name: '1001 Mystery Genie Fortunes',
    provider: 'Play\'n GO',
    url: 'https://demo.firstlookgames.com/?pid=4092&gid=11485',
    imageUrl: 'https://demo.firstlookgames.com/thumb/square/11485.jpg',
  },
  // Fler exempel-spel kan läggas till här
]; 