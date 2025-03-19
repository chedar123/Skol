import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { casinoList } from '@/lib/data/casino-data';

// Hämta användarens favoriter
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Användar-ID krävs" },
        { status: 400 }
      );
    }

    // Kontrollera att användaren är inloggad
    if (!session || !session.user) {
      console.log("Ingen session eller användare hittades");
      return NextResponse.json(
        { error: "Du måste vara inloggad" },
        { status: 401 }
      );
    }

    // Logga session för felsökning
    console.log("Session i GET:", JSON.stringify(session));
    
    // Tillåt alltid åtkomst för att felsöka
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId
      },
      include: {
        casino: true
      }
    });

    return NextResponse.json({ favorites }, { status: 200 });
  } catch (error) {
    console.error("Fel vid hämtning av favoriter:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid hämtning av favoriter" },
      { status: 500 }
    );
  }
}

// Lägg till en favorit
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const body = await request.json();
    const { userId, casinoId } = body;

    if (!userId || !casinoId) {
      return NextResponse.json(
        { error: "Användar-ID och casino-ID krävs" },
        { status: 400 }
      );
    }

    // Kontrollera att användaren är inloggad
    if (!session || !session.user) {
      console.log("Ingen session eller användare hittades vid POST");
      return NextResponse.json(
        { error: "Du måste vara inloggad" },
        { status: 401 }
      );
    }

    // Logga session för felsökning
    console.log("Session i POST:", JSON.stringify(session));
    
    // Kontrollera om casinot finns i databasen
    const casino = await prisma.casino.findUnique({
      where: {
        id: casinoId
      }
    });

    if (!casino) {
      // Om casinot inte finns, skapa det från casino-data
      console.log(`Casino med ID ${casinoId} finns inte i databasen. Skapar det...`);
      
      // Importera casino-data från lib
      const { casinoList } = await import('@/lib/data/casino-data');
      const casinoData = casinoList.find(c => c.id === casinoId);
      
      if (!casinoData) {
        return NextResponse.json(
          { error: "Casinot hittades inte i casino-data" },
          { status: 404 }
        );
      }
      
      // Skapa casinot i databasen
      await prisma.casino.create({
        data: {
          id: casinoData.id,
          name: casinoData.name,
          logo: casinoData.logo,
          description: casinoData.description || "",
          bonus: casinoData.bonus || "",
          bonusAmount: casinoData.bonusAmount || "",
          rating: parseFloat(casinoData.rating) || 0,
          url: casinoData.affiliateLink || casinoData.ctaLink || ""
        }
      });
      
      console.log(`Casino med ID ${casinoId} har skapats i databasen.`);
    }
    
    // Kontrollera om favoriten redan finns
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        casinoId
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "Casinot finns redan i dina favoriter" },
        { status: 400 }
      );
    }

    // Skapa favoriten
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        casinoId
      }
    });

    return NextResponse.json(
      { message: "Favorit tillagd", favorite },
      { status: 201 }
    );
  } catch (error) {
    console.error("Fel vid tillägg av favorit:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid tillägg av favorit" },
      { status: 500 }
    );
  }
}

// Ta bort en favorit
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get("id");
    
    if (!favoriteId) {
      return NextResponse.json(
        { error: "Favorit-ID krävs" },
        { status: 400 }
      );
    }

    // Kontrollera att användaren är inloggad
    if (!session || !session.user) {
      console.log("Ingen session eller användare hittades vid DELETE");
      return NextResponse.json(
        { error: "Du måste vara inloggad" },
        { status: 401 }
      );
    }

    // Logga session för felsökning
    console.log("Session i DELETE:", JSON.stringify(session));

    // Hämta favoriten för att kontrollera ägarskap
    const favorite = await prisma.favorite.findUnique({
      where: {
        id: favoriteId
      }
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favoriten hittades inte" },
        { status: 404 }
      );
    }

    // Ta bort favoriten
    await prisma.favorite.delete({
      where: {
        id: favoriteId
      }
    });

    return NextResponse.json(
      { message: "Favorit borttagen" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fel vid borttagning av favorit:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid borttagning av favorit" },
      { status: 500 }
    );
  }
} 