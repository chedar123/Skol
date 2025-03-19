import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Namn, e-post och lösenord krävs" },
        { status: 400 }
      );
    }

    // Kontrollera om användaren redan finns
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "E-postadressen används redan" },
        { status: 400 }
      );
    }

    // Kryptera lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Skapa användaren
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Ta bort lösenordet från svaret
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: "Användare skapad framgångsrikt", 
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registreringsfel:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid registrering" },
      { status: 500 }
    );
  }
} 