"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CasinoCard from '@/components/CasinoCard';
import { casinoList, Casino } from '@/lib/data/casino-data';

export default function BonusarPage() {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtrera casinon baserat på sökterm och filter
  const filteredCasinos = casinoList.filter((casino) => {
    const matchesSearch = casino.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (casino.bonus || casino.bonusAmount).toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'popular') return matchesSearch && casino.popular;
    
    return matchesSearch;
  });

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
            <span className="text-gray-600">Bonusar</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-6 sm:py-12 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[hsl(var(--primary))] mb-4 sm:mb-8">Casinobonusar</h1>
            <p className="text-base sm:text-lg text-center text-gray-700 mb-6 sm:mb-12">
              Hitta de bästa casinobonusarna och exklusiva erbjudanden från våra rekommenderade casinon.
            </p>

            {/* Filter och sök */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                    filter === 'all' 
                      ? 'bg-[hsl(var(--primary))] text-white' 
                      : 'bg-[hsl(var(--muted))] text-gray-700 hover:bg-[hsl(var(--muted))]/80'
                  }`}
                >
                  Alla bonusar
                </button>
                <button 
                  onClick={() => setFilter('popular')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                    filter === 'popular' 
                      ? 'bg-[hsl(var(--primary))] text-white' 
                      : 'bg-[hsl(var(--muted))] text-gray-700 hover:bg-[hsl(var(--muted))]/80'
                  }`}
                >
                  Populära
                </button>
              </div>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Sök casino eller bonus..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent text-sm"
                  />
                  <svg 
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Casino Cards */}
            {filteredCasinos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                {filteredCasinos.map((casino) => (
                  <CasinoCard key={casino.id} casino={casino} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Inga casinon hittades som matchar din sökning.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setFilter('all');}}
                  className="mt-4 px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors"
                >
                  Återställ sökning
                </button>
              </div>
            )}
          </div>

          {/* Bonusinformation */}
          <div className="max-w-4xl mx-auto mt-8 sm:mt-16">
            <div className="bg-[hsl(var(--neutral-light))] rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-[hsl(var(--primary))] mb-3 sm:mb-4">Om casinobonusar</h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700">
                <p>
                  Casinobonusar är ett sätt för online casinon att locka nya spelare och belöna befintliga. De kommer i olika former, från välkomstbonusar och insättningsbonusar till free spins och cashback-erbjudanden.
                </p>
                <p>
                  När du väljer en casinobonus är det viktigt att läsa villkoren noga. Titta särskilt på omsättningskraven, som anger hur många gånger du måste spela för bonusbeloppet innan du kan ta ut eventuella vinster.
                </p>
                <p>
                  På Slotskolan har vi samlat de bästa och mest förmånliga bonusarna från pålitliga och licensierade casinon. Vi uppdaterar regelbundet vår lista för att säkerställa att du alltid har tillgång till de senaste erbjudandena.
                </p>
                <div className="bg-white p-3 sm:p-4 rounded-md border border-[hsl(var(--border))] mt-3 sm:mt-4">
                  <h3 className="font-medium text-base sm:text-lg mb-2">Tips för att maximera din casinobonus:</h3>
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base">
                    <li>Jämför olika bonusar för att hitta den som passar dina spelpreferenser</li>
                    <li>Läs alltid villkoren innan du accepterar en bonus</li>
                    <li>Var uppmärksam på tidsbegränsningar för att använda bonusen</li>
                    <li>Kontrollera vilka spel som bidrar till omsättningskraven</li>
                    <li>Sätt en budget och håll dig till den, oavsett bonusens storlek</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 