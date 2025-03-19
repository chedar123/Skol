"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = session?.user?.role === "ADMIN";
  const isModerator = session?.user?.role === "MODERATOR";

  useEffect(() => {
    // Omdirigera till inloggningssidan om användaren inte är inloggad
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profil");
    }

    if (status === "authenticated" && session?.user) {
      // Sätt användarinformation
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setImage(session.user.image || "");
      setIsLoading(false);
    }
  }, [status, session, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Kontrollera filtyp
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Ogiltig filtyp. Endast JPG, PNG, GIF och WEBP är tillåtna.');
      return;
    }
    
    // Kontrollera filstorlek (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      setUploadError('Filen är för stor. Max storlek är 20MB.');
      return;
    }
    
    setUploadError('');
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      let uploadedImageUrl = image;

      // Om en ny bild har laddats upp, ladda upp den först
      if (imageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        
        try {
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || 'Bilduppladdning misslyckades');
          }
          
          const uploadData = await uploadResponse.json();
          uploadedImageUrl = uploadData.url;
          setIsUploading(false);
        } catch (error: any) {
          console.error('Fel vid bilduppladdning:', error);
          setError(error.message || 'Kunde inte ladda upp bilden. Försök igen senare.');
          setIsSaving(false);
          setIsUploading(false);
          return;
        }
      }

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          image: uploadedImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ett fel uppstod vid uppdatering av profil");
        setIsSaving(false);
        return;
      }

      // Uppdatera session med ny användarinformation
      await update({
        ...session,
        user: {
          ...session?.user,
          name,
          email,
          image: uploadedImageUrl,
        },
      });

      setSuccessMessage("Profilen har uppdaterats");
      setIsEditing(false);
    } catch (error) {
      setError("Ett fel uppstod vid uppdatering av profil");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || (status === "unauthenticated" && typeof window !== "undefined")) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))]">
          <h1 className="text-2xl font-bold text-white">Min profil</h1>
        </div>
        
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row p-6">
          <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pr-6">
            <div className="bg-[hsl(var(--light-pink))] rounded-lg p-6 text-center shadow-sm">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-white border-4 border-white shadow-md">
                {(imagePreview || session?.user?.image) ? (
                  <Image
                    src={imagePreview || session?.user?.image || ""}
                    alt={session?.user?.name || "Profilbild"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl text-gray-400 bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{session?.user?.name || "Användare"}</h2>
              <p className="text-gray-600 mt-1 break-words">{session?.user?.email}</p>
              
              <div className="mt-3 space-y-2">
                {isAdmin && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Administratör
                  </div>
                )}
                
                {isModerator && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Moderator
                  </div>
                )}
              </div>
              
              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-md hover:bg-[hsl(var(--primary))]/90 transition-colors w-full flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {isEditing ? "Avbryt redigering" : "Redigera profil"}
                </button>
                
                {isAdmin && (
                  <Link 
                    href="/admin/users" 
                    className="block bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors w-full text-center flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Administrera användare
                  </Link>
                )}
                
                {(isAdmin || isModerator) && (
                  <Link 
                    href="/forum/moderation" 
                    className="block bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors w-full text-center flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 001.944 10a11.954 11.954 0 008.056 8.056A11.954 11.954 0 0018.056 10 11.954 11.954 0 0010 1.944zM10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Moderera forum
                  </Link>
                )}
                
                <Link 
                  href="/forum/my-threads" 
                  className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full text-center flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Mina trådar
                </Link>
                
                <Link 
                  href="/forum/my-posts" 
                  className="block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full text-center flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Mina inlägg
                </Link>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            {isEditing ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Redigera profil</h3>
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Namn
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      E-post
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                      Profilbild
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        Välj bild
                      </button>
                      <span className="ml-3 text-sm text-gray-600">
                        {imageFile ? imageFile.name : "Ingen fil vald"}
                      </span>
                      <input
                        type="file"
                        id="image"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                      />
                    </div>
                    {uploadError && (
                      <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving || isUploading}
                      className={`px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-md hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center ${
                        (isSaving || isUploading) ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSaving || isUploading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {isSaving ? "Sparar..." : isUploading ? "Laddar upp..." : "Spara ändringar"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  Aktivitet
                </h3>
                
                {isLoading ? (
                  <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[hsl(var(--primary))]"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-4 text-gray-800">Senaste aktivitet</h4>
                      <p className="text-gray-600 mb-4">
                        Välkommen till din profilsida! Härifrån kan du:
                      </p>
                      <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        <li>Redigera din profil och byta profilbild</li>
                        <li>Se dina senaste trådar och inlägg på forumet</li>
                        {(isAdmin || isModerator) && <li>Hantera moderationsfunktioner</li>}
                        {isAdmin && <li>Administrera användare</li>}
                      </ul>
                      
                      <div className="mt-6">
                        <Link 
                          href="/forum" 
                          className="px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-md hover:bg-[hsl(var(--primary))]/90 transition-colors inline-flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                          Gå till forumet
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 