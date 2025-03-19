import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// PUT /api/user/update
// Uppdaterar användarinformation
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    const token = await getToken({ req: request as any });
    
    console.log("Update API: Session =", JSON.stringify(session));
    console.log("Update API: Token =", JSON.stringify(token));
    
    // Kontrollera att användaren är inloggad
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Du måste vara inloggad för att uppdatera din profil" },
        { status: 401 }
      );
    }

    // Hämta användar-ID från token eller session
    const userId = token?.sub || token?.userId || session?.user?.id;
    
    // Kontrollera att användar-ID finns
    if (!userId) {
      console.log("Update API: Användar-ID saknas i sessionen och token");
      return NextResponse.json(
        { error: "Användar-ID saknas i sessionen" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, image } = body;

    // Validera indata
    if (!name && !email && !image) {
      return NextResponse.json(
        { error: "Minst ett fält måste uppdateras" },
        { status: 400 }
      );
    }

    // Kontrollera om e-postadressen redan används av en annan användare
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: userId
          }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "E-postadressen används redan av en annan användare" },
          { status: 400 }
        );
      }
    }

    // Uppdatera användarinformation
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: name || undefined,
        email: email || undefined,
        image: image || undefined
      }
    });

    // Ta bort lösenordet från svaret
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      { message: "Profilen har uppdaterats", user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fel vid uppdatering av profil:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid uppdatering av profil" },
      { status: 500 }
    );
  }
} 