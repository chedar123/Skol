"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Game } from '@/lib/data/games-data';
import Link from 'next/link';
import Image from 'next/image';
import GameModal from '@/components/slots/GameModal';

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/games/${id}`);
        
        if (!response.ok) {
          throw new Error('Kunde inte hämta spelinformation');
        }
        
        const data = await response.json();
        setGame(data.game);
      } catch (err) {
        console.error('Fel vid hämtning av spel:', err);
        setError('Kunde inte ladda spelinformationen. Vänligen försök igen senare.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGame();
  }, [id]);
  
  const handlePlayDemo = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-t-4 border-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Laddar spelinformation...</p>
        </div>
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Ett fel uppstod</h2>
          <p>{error || 'Spelet kunde inte hittas.'}</p>
          <Link href="/spel" className="mt-4 inline-block text-pink-600 hover:underline">
            Tillbaka till alla spel
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/spel" className="text-pink-600 hover:text-pink-700 transition-colors inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Tillbaka till alla spel
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <div className="relative w-full pb-[75%] md:pb-[100%] overflow-hidden bg-gray-100">
              <Image 
                src={game.imageUrl || '/images/slots/default-slot.jpg'}
                alt={game.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-pink-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                {game.provider}
              </div>
            </div>
            <div className="p-4 text-center text-gray-500 text-xs">
              Bild från FirstLookGames
            </div>
          </div>
          
          <div className="p-8 md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{game.name}</h1>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Spel information</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Utvecklare:</span> {game.provider}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Spel-ID:</span> {game.id}
              </p>
            </div>
            
            <button 
              onClick={handlePlayDemo}
              className="w-full md:w-auto px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Spela demo
            </button>
            
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Relaterade spel från {game.provider}</h2>
              <Link 
                href={`/spel?provider=${encodeURIComponent(game.provider)}`}
                className="text-pink-600 hover:text-pink-700 transition-colors inline-flex items-center"
              >
                Se alla spel från {game.provider}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <GameModal
        game={game}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
} 