import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import fs from 'fs';
import path from 'path';

// Sökväg till JSON-filen där kommentarer lagras
const COMMENTS_FILE_PATH = path.join(process.cwd(), 'data', 'comments.json');

// Hjälpfunktion för att läsa kommentarer från JSON-filen
function readComments() {
  try {
    // Skapa data-mappen om den inte finns
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Skapa filen om den inte finns
    if (!fs.existsSync(COMMENTS_FILE_PATH)) {
      fs.writeFileSync(COMMENTS_FILE_PATH, JSON.stringify({}));
      return {};
    }
    
    // Läs och returnera kommentarer
    const commentsData = fs.readFileSync(COMMENTS_FILE_PATH, 'utf-8');
    return JSON.parse(commentsData);
  } catch (error) {
    console.error("Fel vid läsning av kommentarer:", error);
    return {};
  }
}

// Hjälpfunktion för att skriva kommentarer till JSON-filen
function writeComments(comments: Record<string, any[]>) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(COMMENTS_FILE_PATH, JSON.stringify(comments, null, 2));
    return true;
  } catch (error) {
    console.error("Fel vid skrivning av kommentarer:", error);
    return false;
  }
}

// GET /api/comments?casinoId=starzino
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const casinoId = searchParams.get("casinoId");

  if (!casinoId) {
    return NextResponse.json(
      { error: "casinoId parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Läs kommentarer från JSON-filen
    const allComments = readComments();
    
    // Hämta kommentarer för det specifika casinot
    const casinoComments = allComments[casinoId] || [];
    
    // Sortera kommentarer efter datum (nyaste först)
    const sortedComments = [...casinoComments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      casinoId,
      comments: sortedComments,
      totalComments: sortedComments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/comments
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  console.log("POST /api/comments - Session:", JSON.stringify(session));

  // Kontrollera om användaren är inloggad
  if (!session || !session.user) {
    console.log("POST /api/comments - Användaren är inte inloggad");
    return NextResponse.json(
      { error: "Du måste vara inloggad för att kommentera" },
      { status: 401 }
    );
  }

  try {
    const { casinoId, comment } = await request.json();
    console.log("POST /api/comments - Indata:", { casinoId, comment });

    // Validera indata
    if (!casinoId) {
      return NextResponse.json(
        { error: "casinoId är obligatoriskt" },
        { status: 400 }
      );
    }

    if (!comment || comment.trim() === '') {
      return NextResponse.json(
        { error: "Kommentar kan inte vara tom" },
        { status: 400 }
      );
    }

    // Skapa ett unikt användar-ID baserat på tillgänglig information
    console.log("POST /api/comments - Session user:", session.user);
    
    // Generera ett användar-ID om det inte finns
    let userId = session.user?.id;
    
    // Om ID saknas, använd e-postadressen som fallback
    if (!userId && session.user?.email) {
      console.log("POST /api/comments - Använder e-post som ID-fallback");
      userId = session.user.email;
    }
    
    // Om vi fortfarande inte har ett ID, generera ett baserat på namn eller tidsstämpel
    if (!userId && session.user?.name) {
      console.log("POST /api/comments - Använder namn som ID-fallback");
      userId = `user_${session.user.name}_${Date.now()}`;
    } else if (!userId) {
      console.log("POST /api/comments - Använder tidsstämpel som ID-fallback");
      userId = `anonymous_${Date.now()}`;
    }
    
    console.log("POST /api/comments - Slutgiltigt användar-ID:", userId);
    
    try {
      // Läs befintliga kommentarer
      const allComments = readComments();
      
      // Skapa array för casinot om den inte finns
      if (!allComments[casinoId]) {
        allComments[casinoId] = [];
      }
      
      // Skapa ny kommentar
      const newComment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: userId,
        userName: session.user.name || 'Anonym användare',
        userImage: session.user.image || null,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        casinoName: getCasinoName(casinoId),
      };
      
      // Lägg till kommentaren
      allComments[casinoId].push(newComment);
      
      // Spara kommentarer
      const success = writeComments(allComments);
      
      if (!success) {
        return NextResponse.json(
          { error: "Kunde inte spara kommentar till fil" },
          { status: 500 }
        );
      }
      
      console.log("POST /api/comments - Framgångsrikt sparat kommentar");
      return NextResponse.json({
        success: true,
        comment: newComment,
        totalComments: allComments[casinoId].length,
      });
      
    } catch (error) {
      console.error("POST /api/comments - Fel vid hantering av kommentar:", error);
      return NextResponse.json(
        { error: "Kunde inte hantera kommentar: " + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("POST /api/comments - Fel vid sparande av kommentar:", error);
    return NextResponse.json(
      { error: "Kunde inte spara kommentar: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// DELETE /api/comments
export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  console.log("DELETE /api/comments - Session:", JSON.stringify(session));

  // Kontrollera om användaren är inloggad
  if (!session || !session.user) {
    console.log("DELETE /api/comments - Användaren är inte inloggad");
    return NextResponse.json(
      { error: "Du måste vara inloggad för att ta bort en kommentar" },
      { status: 401 }
    );
  }

  try {
    const { casinoId, commentId } = await request.json();
    console.log("DELETE /api/comments - Indata:", { casinoId, commentId });

    // Validera indata
    if (!casinoId || !commentId) {
      return NextResponse.json(
        { error: "casinoId och commentId är obligatoriska" },
        { status: 400 }
      );
    }

    // Generera ett användar-ID om det inte finns
    let userId = session.user?.id;
    
    // Om ID saknas, använd e-postadressen som fallback
    if (!userId && session.user?.email) {
      userId = session.user.email;
    }
    
    // Om vi fortfarande inte har ett ID, generera ett baserat på namn eller tidsstämpel
    if (!userId && session.user?.name) {
      userId = `user_${session.user.name}_${Date.now()}`;
    } else if (!userId) {
      userId = `anonymous_${Date.now()}`;
    }
    
    try {
      // Läs befintliga kommentarer
      const allComments = readComments();
      
      // Kontrollera om casinot har kommentarer
      if (!allComments[casinoId] || allComments[casinoId].length === 0) {
        return NextResponse.json(
          { error: "Inga kommentarer hittades för detta casino" },
          { status: 404 }
        );
      }
      
      // Hitta kommentaren
      const commentIndex = allComments[casinoId].findIndex((c: { id: string }) => c.id === commentId);
      
      if (commentIndex === -1) {
        return NextResponse.json(
          { error: "Kommentaren hittades inte" },
          { status: 404 }
        );
      }
      
      // Kontrollera om användaren äger kommentaren eller är admin
      const isAdmin = session.user.role === 'ADMIN';
      const isOwner = allComments[casinoId][commentIndex].userId === userId;
      
      if (!isAdmin && !isOwner) {
        return NextResponse.json(
          { error: "Du har inte behörighet att ta bort denna kommentar" },
          { status: 403 }
        );
      }
      
      // Ta bort kommentaren
      allComments[casinoId].splice(commentIndex, 1);
      
      // Spara kommentarer
      const success = writeComments(allComments);
      
      if (!success) {
        return NextResponse.json(
          { error: "Kunde inte spara ändringar till fil" },
          { status: 500 }
        );
      }
      
      console.log("DELETE /api/comments - Framgångsrikt tagit bort kommentar");
      return NextResponse.json({
        success: true,
        totalComments: allComments[casinoId].length,
      });
      
    } catch (error) {
      console.error("DELETE /api/comments - Fel vid hantering av kommentar:", error);
      return NextResponse.json(
        { error: "Kunde inte hantera kommentar: " + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("DELETE /api/comments - Fel vid borttagning av kommentar:", error);
    return NextResponse.json(
      { error: "Kunde inte ta bort kommentar: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// Hjälpfunktion för att hämta casinonamnet
function getCasinoName(casinoId: string): string {
  try {
    // Importera casinoList från casino-data
    const { casinoList } = require('@/lib/data/casino-data');
    
    // Hitta casinot med matchande ID
    const casino = casinoList.find((c: any) => c.id === casinoId);
    
    // Returnera casinonamnet eller casinoId om casinot inte hittas
    return casino ? casino.name : casinoId;
  } catch (error) {
    console.error("Fel vid hämtning av casinonamn:", error);
    return casinoId;
  }
} 