"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { casinoList } from '@/lib/data/casino-data';
import CasinoCard from '@/components/CasinoCard';
import { useSession } from 'next-auth/react';

export default function RecensionPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hämta användarens favoriter om användaren är inloggad
  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/favorites?userId=${session.user.id}`);
          
          if (response.ok) {
            const data = await response.json();
            setFavorites(data.favorites || []);
          }
        } catch (error) {
          console.error("Fel vid hämtning av favoriter:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFavorites();
  }, [status, session]);

  // Hitta favorit för ett specifikt casino
  const findFavorite = (casinoId: string) => {
    return favorites.find(fav => fav.casinoId === casinoId);
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-[hsl(var(--light-pink))] py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] transition-colors">
              Slotskolan
            </Link>
            <span className="text-gray-400 mx-1">&raquo;</span>
            <span className="text-gray-600">Recensioner</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))] mb-6 text-center">Casino Recensioner</h1>
        <p className="text-lg text-center text-gray-700 mb-12 max-w-3xl mx-auto">
          Här hittar du våra detaljerade recensioner av de bästa online casinona. Vi har testat och utvärderat varje casino för att hjälpa dig hitta det som passar dig bäst.
        </p>

        {isLoading && status === "authenticated" ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {casinoList.map((casino) => (
              <div key={casino.id} className="flex flex-col h-full">
                <CasinoCard 
                  casino={casino} 
                  favorite={findFavorite(casino.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 