import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Kontrollera att användaren är inloggad
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Du måste vara inloggad för att ladda upp filer' }, { status: 401 });
    }

    // Hämta formdata från request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Ingen fil hittades' }, { status: 400 });
    }

    // Kontrollera filtyp
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Ogiltig filtyp. Endast JPG, PNG, GIF och WEBP är tillåtna.' }, { status: 400 });
    }

    // Kontrollera filstorlek (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Filen är för stor. Max storlek är 20MB.' }, { status: 400 });
    }

    // Läs filens innehåll som en ArrayBuffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Ladda upp till Cloudinary
    const imageUrl = await uploadImage(buffer, `slotskolanv3/users/${session.user.id}`);
    
    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Fel vid bilduppladdning:', error);
    return NextResponse.json({ error: 'Ett fel uppstod vid uppladdning av bilden' }, { status: 500 });
  }
} 