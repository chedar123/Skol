"use client";

import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <>
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-pink-600">Kontrollera din e-post</h1>
        
        <div className="text-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-pink-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        
        <p className="text-center text-gray-700 mb-4">
          En länk för att logga in har skickats till din e-postadress.
        </p>
        
        <p className="text-center text-gray-700 mb-6">
          Klicka på länken i e-postmeddelandet för att logga in.
        </p>
        
        <div className="text-center">
          <Link
            href="/login"
            className="text-pink-600 hover:underline"
          >
            Tillbaka till inloggning
          </Link>
        </div>
      </div>
    </>
  );
} 