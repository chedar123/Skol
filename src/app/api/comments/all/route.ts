import { NextRequest, NextResponse } from "next/server";
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

// GET /api/comments/all
export async function GET(request: NextRequest) {
  try {
    // Läs alla kommentarer
    const allComments = readComments();
    
    // Samla alla kommentarer från alla casinon
    const comments: any[] = [];
    
    // Gå igenom alla casinon och samla kommentarer
    Object.entries(allComments).forEach(([casinoId, casinoComments]: [string, any]) => {
      // Lägg till casinoId till varje kommentar
      casinoComments.forEach((comment: any) => {
        comments.push({
          ...comment,
          casinoId
        });
      });
    });
    
    // Sortera kommentarer efter datum (nyaste först)
    comments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      comments,
      totalComments: comments.length,
    });
  } catch (error) {
    console.error("Error fetching all comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch all comments" },
      { status: 500 }
    );
  }
} 