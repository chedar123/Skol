import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { headers } from "next/headers";

// POST /api/reset-password
// Skickar en återställningslänk till användarens e-post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    // Hämta host från request headers för att använda rätt URL i e-postlänken
    const headersList = await headers();
    const host = headersList.get("host") || process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, "") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    console.log(`Lösenordsåterställning begärd för: ${email}`);

    if (!email) {
      return NextResponse.json(
        { error: "E-post krävs" },
        { status: 400 }
      );
    }

    // Kontrollera om användaren finns
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    // För säkerhetsskäl, returnera alltid samma svar oavsett om användaren finns eller inte
    if (!user) {
      console.log(`Användare med e-post ${email} hittades inte`);
      return NextResponse.json(
        { message: "Om e-postadressen finns i vårt system har vi skickat en återställningslänk" },
        { status: 200 }
      );
    }

    // Skapa en token för återställning
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 timme

    console.log(`Token skapad för användare ${user.id}: ${token.substring(0, 8)}...`);

    // Spara token i databasen
    await prisma.passwordReset.upsert({
      where: {
        userId: user.id
      },
      update: {
        token,
        expires
      },
      create: {
        userId: user.id,
        token,
        expires
      }
    });

    console.log("Token sparad i databasen");

    // Skapa en transporter för att skicka e-post via Strato SMTP
    console.log("Skapar e-posttransporter med följande inställningar:");
    console.log(`Host: ${process.env.EMAIL_SERVER_HOST}`);
    console.log(`Port: ${process.env.EMAIL_SERVER_PORT}`);
    console.log(`User: ${process.env.EMAIL_SERVER_USER}`);
    console.log(`From: ${process.env.EMAIL_FROM}`);

    // Använd SSL med port 465 igen
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: 465, // Använd port 465 för SSL
      secure: true, // true för port 465 (SSL)
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      debug: true, // Aktivera debug-läge
      logger: true, // Aktivera loggning
    });

    // Testa SMTP-anslutningen
    try {
      console.log("Testar SMTP-anslutning...");
      const verifyResult = await transporter.verify();
      console.log("SMTP-anslutning verifierad:", verifyResult);
    } catch (verifyError: any) {
      console.error("SMTP-anslutningsfel:", verifyError);
      console.error("SMTP-anslutningsfeldetaljer:", verifyError.message);
    }

    // Återställningslänk med dynamisk basURL
    const resetLink = `${baseUrl}/reset-password/${token}`;

    // Skicka e-post med återställningslänk
    console.log(`Försöker skicka e-post till ${user.email}`);
    
    if (user && user.email) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Återställ ditt lösenord på Slotskolan",
          text: `Hej ${user.name || "där"}!\n\nDu har begärt att återställa ditt lösenord på Slotskolan. Klicka på länken nedan för att återställa ditt lösenord:\n\n${resetLink}\n\nLänken är giltig i 1 timme.\n\nOm du inte begärde detta, kan du ignorera detta meddelande.\n\nMed vänliga hälsningar,\nSlotskolan-teamet`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e91e63;">Återställ ditt lösenord</h2>
              <p>Hej ${user.name || "där"}!</p>
              <p>Du har begärt att återställa ditt lösenord på Slotskolan. Klicka på knappen nedan för att återställa ditt lösenord:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #e91e63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Återställ lösenord</a>
              </div>
              <p>Eller kopiera och klistra in denna länk i din webbläsare:</p>
              <p><a href="${resetLink}">${resetLink}</a></p>
              <p>Länken är giltig i 1 timme.</p>
              <p>Om du inte begärde detta, kan du ignorera detta meddelande.</p>
              <p>Med vänliga hälsningar,<br>Slotskolan-teamet</p>
            </div>
          `,
        };
        
        console.log("E-postalternativ:", JSON.stringify(mailOptions, null, 2));
        const info = await transporter.sendMail(mailOptions);

        console.log(`E-post skickad: ${JSON.stringify(info)}`);
        console.log(`Återställningslänk skickad till ${user.email}: ${resetLink}`);
      } catch (emailError: any) {
        console.error("Fel vid skickande av e-post:", emailError);
        console.error("Feldetaljer:", emailError.message);
        if (emailError.stack) {
          console.error("Stack trace:", emailError.stack);
        }
        // Vi returnerar ändå ett framgångsrikt svar för att inte avslöja om användaren finns
      }
    } else {
      return NextResponse.json(
        { error: "Användare saknar e-postadress" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Om e-postadressen finns i vårt system har vi skickat en återställningslänk" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fel vid återställning av lösenord:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod vid begäran om återställning av lösenord" },
      { status: 500 }
    );
  }
} 