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

// GET /api/users/comments?userId=userId
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Läs alla kommentarer
    const allComments = readComments();
    
    // Samla användarens kommentarer från alla casinon
    const userComments: any[] = [];
    
    // Gå igenom alla casinon och hitta användarens kommentarer
    Object.entries(allComments).forEach(([casinoId, comments]: [string, any]) => {
      const casinoComments = comments.filter((comment: any) => comment.userId === userId);
      
      // Lägg till casinoId till varje kommentar
      casinoComments.forEach((comment: any) => {
        userComments.push({
          ...comment,
          casinoId,
          // Här skulle vi kunna lägga till casinoName om vi hade tillgång till det
        });
      });
    });
    
    // Sortera kommentarer efter datum (nyaste först)
    userComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      userId,
      comments: userComments,
      totalComments: userComments.length,
    });
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch user comments" },
      { status: 500 }
    );
  }
} 