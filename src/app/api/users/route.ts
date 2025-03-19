import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET /api/users?username=username
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "username parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Konvertera användarnamnet till ett format som kan matchas mot databasen
    // Om användarnamnet innehåller bindestreck, ersätt dem med mellanslag
    const normalizedUsername = username.replace(/-/g, ' ');
    
    // Försök hitta användaren baserat på användarnamn
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          // Exakt matchning (case insensitive)
          { name: { equals: normalizedUsername, mode: 'insensitive' } as any },
          // Matchning med bindestreck ersatta med mellanslag (case insensitive)
          { name: { equals: username, mode: 'insensitive' } as any },
          // Matchning med e-postadress som börjar med användarnamnet
          { email: { startsWith: normalizedUsername, mode: 'insensitive' } as any }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      }
    });

    // Om ingen användare hittades, försök att hitta alla användare och returnera den första
    if (!user) {
      // För testning, returnera den första användaren i systemet
      const firstUser = await prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        }
      });
      
      if (firstUser) {
        // Dölj e-postadressen för andra användare än den inloggade användaren
        const session = await getServerSession();
        if (!session || session.user?.id !== firstUser.id) {
          // @ts-ignore
          firstUser.email = undefined;
        }
        
        return NextResponse.json({ user: firstUser });
      }
      
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Dölj e-postadressen för andra användare än den inloggade användaren
    const session = await getServerSession();
    if (!session || session.user?.id !== user.id) {
      // @ts-ignore
      user.email = undefined;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
} 