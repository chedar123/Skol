import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from 'fs';
import path from 'path';

// Sökväg till JSON-filen där betyg lagras
const RATINGS_FILE_PATH = path.join(process.cwd(), 'data', 'ratings.json');

// Hjälpfunktion för att läsa betyg från JSON-filen
function readRatings() {
  try {
    // Skapa data-mappen om den inte finns
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Skapa ratings.json om den inte finns
    if (!fs.existsSync(RATINGS_FILE_PATH)) {
      fs.writeFileSync(RATINGS_FILE_PATH, JSON.stringify({}));
      return {};
    }
    
    // Läs och returnera betygsdata
    const ratingsData = fs.readFileSync(RATINGS_FILE_PATH, 'utf-8');
    return JSON.parse(ratingsData);
  } catch (error) {
    console.error("Fel vid läsning av betyg:", error);
    return {};
  }
}

// Hjälpfunktion för att skriva betyg till JSON-filen
function writeRatings(ratings: any) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(RATINGS_FILE_PATH, JSON.stringify(ratings, null, 2));
    return true;
  } catch (error) {
    console.error("Fel vid skrivning av betyg:", error);
    return false;
  }
}

// GET-metod för att hämta betyg för ett specifikt casino eller slot
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const casinoId = searchParams.get('casinoId');
    const slotId = searchParams.get('slotId');
    
    if (!casinoId && !slotId) {
      return NextResponse.json({ error: 'casinoId eller slotId krävs' }, { status: 400 });
    }
    
    const ratings = readRatings();
    
    // Hantera betyg för casino
    if (casinoId) {
      console.log(`Hämtar betyg för casino med ID: ${casinoId}`);
      const casinoRatings = ratings[casinoId] || { ratings: [], averageRating: 0, totalRatings: 0 };
      return NextResponse.json(casinoRatings);
    }
    
    // Hantera betyg för slot
    if (slotId) {
      console.log(`Hämtar betyg för slot med ID: ${slotId}`);
      const slotRatings = ratings[slotId] || { ratings: [], averageRating: 0, totalRatings: 0 };
      return NextResponse.json(slotRatings);
    }
  } catch (error) {
    console.error('Fel vid hämtning av betyg:', error);
    return NextResponse.json({ error: 'Ett fel uppstod vid hämtning av betyg' }, { status: 500 });
  }
}

// POST-metod för att lägga till eller uppdatera ett betyg
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Du måste vara inloggad för att betygsätta' }, { status: 401 });
    }
    
    const { casinoId, slotId, rating } = await request.json();
    
    // Kontrollera att antingen casinoId eller slotId finns
    if ((!casinoId && !slotId) || rating === undefined || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Ogiltigt ID eller betyg' }, { status: 400 });
    }
    
    const userId = session.user.id;
    const userName = session.user.name || 'Anonym';
    
    // Läs befintliga betyg
    const ratings = readRatings();
    
    // Bestäm vilket ID som ska användas (casinoId eller slotId)
    const itemId = casinoId || slotId;
    console.log(`Sparar betyg för item med ID: ${itemId}`);
    
    // Skapa itemId-nyckel om den inte finns
    if (!ratings[itemId]) {
      ratings[itemId] = { ratings: [], averageRating: 0, totalRatings: 0 };
    }
    
    // Kontrollera om användaren redan har betygsatt detta item
    const existingRatingIndex = ratings[itemId].ratings.findIndex((r: any) => r.userId === userId);
    
    if (existingRatingIndex !== -1) {
      // Uppdatera befintligt betyg
      ratings[itemId].ratings[existingRatingIndex].rating = rating;
    } else {
      // Lägg till nytt betyg
      ratings[itemId].ratings.push({
        userId,
        userName,
        rating,
        createdAt: new Date().toISOString()
      });
    }
    
    // Beräkna genomsnittsbetyg
    const totalRating = ratings[itemId].ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
    ratings[itemId].averageRating = totalRating / ratings[itemId].ratings.length;
    ratings[itemId].totalRatings = ratings[itemId].ratings.length;
    
    // Spara uppdaterade betyg
    if (writeRatings(ratings)) {
      return NextResponse.json({
        success: true,
        userRating: rating,
        averageRating: ratings[itemId].averageRating,
        totalRatings: ratings[itemId].totalRatings
      });
    } else {
      return NextResponse.json({ error: 'Kunde inte spara betyg' }, { status: 500 });
    }
  } catch (error) {
    console.error('Fel vid betygsättning:', error);
    return NextResponse.json({ error: 'Ett fel uppstod vid betygsättning' }, { status: 500 });
  }
}

// DELETE-metod för att ta bort ett betyg
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Du måste vara inloggad för att ta bort betyg' }, { status: 401 });
    }
    
    const { casinoId, slotId } = await request.json();
    
    if (!casinoId && !slotId) {
      return NextResponse.json({ error: 'casinoId eller slotId krävs' }, { status: 400 });
    }
    
    const userId = session.user.id;
    
    // Läs befintliga betyg
    const ratings = readRatings();
    
    // Bestäm vilket ID som ska användas (casinoId eller slotId)
    const itemId = casinoId || slotId;
    
    // Kontrollera om itemet finns
    if (!ratings[itemId]) {
      return NextResponse.json({ error: 'Inga betyg hittades för detta item' }, { status: 404 });
    }
    
    // Hitta användarens betyg
    const existingRatingIndex = ratings[itemId].ratings.findIndex((r: any) => r.userId === userId);
    
    if (existingRatingIndex === -1) {
      return NextResponse.json({ error: 'Du har inte betygsatt detta item' }, { status: 404 });
    }
    
    // Ta bort betyget
    ratings[itemId].ratings.splice(existingRatingIndex, 1);
    
    // Uppdatera genomsnittsbetyg
    if (ratings[itemId].ratings.length > 0) {
      const totalRating = ratings[itemId].ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
      ratings[itemId].averageRating = totalRating / ratings[itemId].ratings.length;
    } else {
      ratings[itemId].averageRating = 0;
    }
    
    ratings[itemId].totalRatings = ratings[itemId].ratings.length;
    
    // Spara uppdaterade betyg
    if (writeRatings(ratings)) {
      return NextResponse.json({
        success: true,
        averageRating: ratings[itemId].averageRating,
        totalRatings: ratings[itemId].totalRatings
      });
    } else {
      return NextResponse.json({ error: 'Kunde inte spara betyg' }, { status: 500 });
    }
  } catch (error) {
    console.error('Fel vid borttagning av betyg:', error);
    return NextResponse.json({ error: 'Ett fel uppstod vid borttagning av betyg' }, { status: 500 });
  }
} 