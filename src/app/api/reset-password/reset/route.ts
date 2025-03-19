import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// POST /api/reset-password/reset
// Återställer lösenordet med en token
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token och lösenord krävs" },
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

    // Kryptera det nya lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Uppdatera användarens lösenord
    await prisma.user.update({
      where: {
        id: passwordReset.userId
      },
      data: {
        password: hashedPassword
      }
    });

    // Ta bort token från databasen
    await prisma.passwordReset.delete({
      where: {
        id: passwordReset.id
      }
    });

    return NextResponse.json(
      { message: "Lösenordet har återställts" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fel vid återställning av lösenord:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid återställning av lösenord" },
      { status: 500 }
    );
  }
} 