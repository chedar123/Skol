import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validera indata
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Namn, e-post och meddelande krävs' },
        { status: 400 }
      );
    }

    // Skapa en transportör för att skicka e-post
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // E-postens innehåll
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'slotskolan@gmail.com', // Korrigerad e-postadress
      replyTo: email,
      subject: subject ? `Kontaktformulär: ${subject}` : 'Nytt meddelande från kontaktformuläret',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e91e63; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nytt meddelande från kontaktformuläret</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Namn:</strong> ${name}</p>
            <p><strong>E-post:</strong> ${email}</p>
            ${subject ? `<p><strong>Ämne:</strong> ${subject}</p>` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #333;">Meddelande:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
            <p>Detta meddelande skickades via kontaktformuläret på slotskolan.se</p>
          </div>
        </div>
      `,
    };

    // Skicka e-post
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'E-post skickad framgångsrikt' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fel vid skickande av e-post:', error);
    return NextResponse.json(
      { error: 'Kunde inte skicka e-post', details: error },
      { status: 500 }
    );
  }
} 