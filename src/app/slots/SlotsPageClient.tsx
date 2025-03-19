"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GameModal from '@/components/slots/GameModal';
import { Slot } from '@/lib/data/casino-data';

interface SlotsPageClientProps {
  slots: Slot[];
}

// Konvertera Slot till Game-format som GameModal förväntar sig
interface Game {
  id: string;
  name: string;
  provider: string;
  url: string;
  imageUrl?: string;
}

export default function SlotsPageClient({ slots }: SlotsPageClientProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<string>('alla');
  const [displayedSlots, setDisplayedSlots] = useState<Slot[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Konvertera selected slot till Game-format
  const selectedGame: Game | null = selectedSlot ? {
    id: selectedSlot.id,
    name: selectedSlot.name,
    provider: 'Spelleverantör', // Fast värde eftersom Slot inte har provider-egenskap
    url: selectedSlot.gameUrl,
    imageUrl: selectedSlot.image
  } : null;

  // Filtrera slots baserat på sökterm och kategori
  useEffect(() => {
    let filtered = slots;
    
    // Filtrera efter sökterm om det finns
    if (searchTerm) {
      filtered = filtered.filter(slot => 
        slot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        slot.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrera efter kategori
    if (category === 'populära') {
      // Antag att de första 8 är populära
      filtered = filtered.slice(0, 8);
    } else if (category === 'nya') {
      // Antag att de första 6 är nya
      filtered = filtered.slice(0, 6);
    }
    
    // Begränsa antalet visade slots om showAll är false
    if (!showAll && filtered.length > 12) {
      setDisplayedSlots(filtered.slice(0, 12));
    } else {
      setDisplayedSlots(filtered);
    }
  }, [searchTerm, category, showAll, slots]);

  const handleOpenModal = (slot: Slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Fördröj återställandet av selectedSlot för att undvika flimmer vid stängning
    setTimeout(() => {
      setSelectedSlot(null);
    }, 300);
  };

  return (
    <>
      {/* Main Content */}
      <main className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Populära Slots</h1>
          
          {/* Sök och filter */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Kategorier */}
              <div className="flex flex-wrap justify-center w-full md:w-auto gap-2 mb-4 md:mb-0">
                <button 
                  onClick={() => setCategory('alla')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    category === 'alla' 
                      ? 'bg-[hsl(var(--primary))] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Alla slots
                </button>
                <button 
                  onClick={() => setCategory('populära')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    category === 'populära' 
                      ? 'bg-[hsl(var(--primary))] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Populära
                </button>
                <button 
                  onClick={() => setCategory('nya')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    category === 'nya' 
                      ? 'bg-[hsl(var(--primary))] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Nya
                </button>
              </div>
              
              {/* Sökfält */}
              <div className="w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Sök efter slots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                  />
                  <svg 
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Slot Cards - Improved Mobile Design */}
          {displayedSlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
              {displayedSlots.map((slot) => (
                <div key={slot.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={slot.image}
                      alt={slot.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-3 md:p-4">
                    <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--primary))] mb-2 md:mb-4 truncate">{slot.name}</h3>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="py-2 px-3 md:px-4 bg-[hsl(var(--primary))] text-white rounded-md text-sm font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors w-full sm:w-auto"
                        onClick={() => handleOpenModal(slot)}
                      >
                        Spela Demo
                      </button>
                      
                      <button
                        className="py-2 px-3 md:px-4 border border-[hsl(var(--primary))] text-[hsl(var(--primary))] rounded-md text-sm font-medium hover:bg-[hsl(var(--primary))]/5 transition-colors w-full sm:w-auto"
                        onClick={() => handleOpenModal(slot)}
                      >
                        Läs mer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Inga slots hittades som matchar din sökning.</p>
              <button 
                onClick={() => {setSearchTerm(''); setCategory('alla');}}
                className="mt-4 px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors"
              >
                Återställ sökning
              </button>
            </div>
          )}
          
          {/* Visa fler/färre knapp */}
          {!searchTerm && category === 'alla' && slots.length > 12 && (
            <div className="text-center mb-12">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-colors inline-block"
              >
                {showAll ? 'Visa färre slots' : 'Visa fler slots'}
              </button>
            </div>
          )}
          
          {/* Spela Fler Slots Button */}
          <div className="text-center mt-8 mb-16">
            <Link 
              href="https://starzinotracker.com/d86dfc5c0" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[hsl(var(--primary))] text-white rounded-full text-lg font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors inline-block"
            >
              Spela fler slots
            </Link>
          </div>
          
          {/* Slots Information */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-[hsl(var(--neutral-light))] rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4">Om spelautomater</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Spelautomater, eller slots, är de mest populära spelen på online casinon. De kommer i många olika teman och med varierande funktioner, från klassiska fruktmaskiner till moderna videoslots med avancerade bonusfunktioner.
                </p>
                <p>
                  När du spelar slots är det viktigt att förstå begrepp som RTP (Return to Player), volatilitet och bonusfunktioner. RTP anger hur mycket av insatserna som i genomsnitt betalas tillbaka till spelarna över tid, medan volatilitet beskriver hur ofta och hur stora vinster du kan förvänta dig.
                </p>
                <p>
                  På Slotskolan kan du prova slots gratis i demo-läge innan du bestämmer dig för att spela för riktiga pengar. Detta ger dig möjlighet att lära känna spelet och dess funktioner utan risk.
                </p>
              </div>
            </div>
          </div>
          
          {/* Sociala delningsknappar */}
          <div className="max-w-4xl mx-auto mt-12 mb-16">
            <h3 className="text-xl font-semibold text-center mb-4">Dela denna sida</h3>
            <div className="flex justify-center space-x-4">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://slotskolan.se/slots')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1877F2] text-white p-3 rounded-full hover:bg-opacity-90 transition-colors"
                aria-label="Dela på Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Kolla in de bästa slots på Slotskolan!')}&url=${encodeURIComponent('https://slotskolan.se/slots')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1DA1F2] text-white p-3 rounded-full hover:bg-opacity-90 transition-colors"
                aria-label="Dela på Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://slotskolan.se/slots')}&title=${encodeURIComponent('Populära Slots på Slotskolan')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0A66C2] text-white p-3 rounded-full hover:bg-opacity-90 transition-colors"
                aria-label="Dela på LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('https://slotskolan.se/slots');
                  alert('Länk kopierad till urklipp!');
                }}
                className="bg-gray-700 text-white p-3 rounded-full hover:bg-opacity-90 transition-colors"
                aria-label="Kopiera länk"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Game Modal */}
      <GameModal 
        game={selectedGame}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
} 