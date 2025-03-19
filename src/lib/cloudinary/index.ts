import { v2 as cloudinary } from 'cloudinary';

// Konfiguration för Cloudinary
cloudinary.config({
  cloud_name: 'djpivnnxc',
  api_key: '259583662719614',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Funktion för att ladda upp bilder till Cloudinary
export async function uploadImage(file: Buffer, folder: string = 'profilbilder'): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message || 'Fel vid uppladdning till Cloudinary'));
          return;
        }
        
        resolve(result.secure_url);
      }
    ).end(file);
  });
}

export { cloudinary }; 