import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Hämta antal favoriter för ett casino
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const casinoId = searchParams.get("casinoId");

    if (!casinoId) {
      return NextResponse.json(
        { error: "Casino-ID krävs" },
        { status: 400 }
      );
    }

    // Räkna antal favoriter för casinot
    const count = await prisma.favorite.count({
      where: {
        casinoId: casinoId
      }
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Fel vid hämtning av antal favoriter:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid hämtning av antal favoriter" },
      { status: 500 }
    );
  }
} 