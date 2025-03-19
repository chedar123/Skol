import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth"; 

// GET /api/admin/users
// Hämtar alla användare (endast för administratörer)
export async function GET(request: Request) {
  try {
    // Använd authOptions explicit för att få samma konfigurationshantering
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är inloggad
    if (!session || !session.user) {
      console.error("Åtkomst nekad: Ingen session eller användare");
      return NextResponse.json(
        { error: "Du måste vara inloggad för att komma åt denna resurs" },
        { status: 401 }
      );
    }

    // Utgå från att användar-ID nu finns i session tack vare förbättrad auth-konfiguration
    const userId = session.user.id;
    
    if (!userId) {
      console.error("Åtkomst nekad: session.user.id saknas", session);
      return NextResponse.json(
        { error: "Sessionsfel: Användar-ID saknas" },
        { status: 401 }
      );
    }

    // Hämta användarens roll
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        role: true
      }
    });

    if (!user || user.role !== "ADMIN") {
      console.error(`Åtkomst nekad: Användare ${userId} har inte behörighet (roll: ${user?.role || 'okänd'})`);
      return NextResponse.json(
        { error: "Du har inte behörighet att komma åt denna resurs" },
        { status: 403 }
      );
    }

    // Hämta alla användare med statistik
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            threads: true,
            posts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid hämtning av användare" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users
// Uppdaterar en användares roll (endast för administratörer)
export async function PUT(request: Request) {
  try {
    // Använd authOptions explicit för att få samma konfigurationshantering
    const session = await getServerSession(authOptions);
    
    // Kontrollera att användaren är inloggad
    if (!session || !session.user) {
      console.error("Åtkomst nekad: Ingen session eller användare");
      return NextResponse.json(
        { error: "Du måste vara inloggad för att komma åt denna resurs" },
        { status: 401 }
      );
    }

    // Utgå från att användar-ID nu finns i session tack vare förbättrad auth-konfiguration
    const userId = session.user.id;
    
    if (!userId) {
      console.error("Åtkomst nekad: session.user.id saknas", session);
      return NextResponse.json(
        { error: "Sessionsfel: Användar-ID saknas" },
        { status: 401 }
      );
    }

    // Hämta användarens roll
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        role: true
      }
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      console.error(`Åtkomst nekad: Användare ${userId} har inte behörighet (roll: ${currentUser?.role || 'okänd'})`);
      return NextResponse.json(
        { error: "Du har inte behörighet att komma åt denna resurs" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId: targetUserId, role } = body;

    if (!targetUserId || !role) {
      return NextResponse.json(
        { error: "Användar-ID och roll krävs" },
        { status: 400 }
      );
    }

    // Kontrollera att rollen är giltig
    if (!["USER", "ADMIN", "MODERATOR"].includes(role)) {
      return NextResponse.json(
        { error: "Ogiltig roll" },
        { status: 400 }
      );
    }

    // Kontrollera att användaren finns
    const userToUpdate = await prisma.user.findUnique({
      where: {
        id: targetUserId
      }
    });

    if (!userToUpdate) {
      return NextResponse.json(
        { error: "Användaren hittades inte" },
        { status: 404 }
      );
    }

    // Uppdatera användarens roll
    const updatedUser = await prisma.user.update({
      where: {
        id: targetUserId
      },
      data: {
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            threads: true,
            posts: true
          }
        }
      }
    });

    return NextResponse.json(
      { message: "Användarens roll har uppdaterats", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fel vid uppdatering av användarroll:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid uppdatering av användarroll" },
      { status: 500 }
    );
  }
} 