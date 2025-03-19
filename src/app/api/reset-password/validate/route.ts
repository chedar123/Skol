import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reset-password/validate?token=<token>
// Validerar en återställningstoken
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token krävs" },
        { status: 400 }
      );
    }

    // Hämta token från databasen
    const passwordReset = await prisma.passwordReset.findUnique({
      where: {
        token
      }
    });

    // Kontrollera om token finns och inte har gått ut
    if (!passwordReset || new Date() > passwordReset.expires) {
      return NextResponse.json(
        { error: "Ogiltig eller utgången token" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fel vid validering av token:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid validering av token" },
      { status: 500 }
    );
  }
} 