"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Game } from '@/lib/data/games-data';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({ game, isOpen, onClose }: GameModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showRealMoneyPopup, setShowRealMoneyPopup] = useState(false);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  
  // Starzino affiliate-länk
  const starzinoAffiliateLink = "https://starzinotracker.com/d86dfc5c0";
  
  // Reset loading state när ett nytt spel öppnas och starta popup-timer
  useEffect(() => {
    if (isOpen && game) {
      setIsLoading(true);
      setShowRealMoneyPopup(false);
      
      // Rensa befintlig timer om det finns en
      if (popupTimerRef.current) {
        clearTimeout(popupTimerRef.current);
      }
      
      // Starta en ny timer för 60 sekunder
      popupTimerRef.current = setTimeout(() => {
        setShowRealMoneyPopup(true);
      }, 60000); // 60 sekunder
    } else {
      // Rensa timer när modalen stängs
      if (popupTimerRef.current) {
        clearTimeout(popupTimerRef.current);
        popupTimerRef.current = null;
      }
    }
    
    // Cleanup-funktion
    return () => {
      if (popupTimerRef.current) {
        clearTimeout(popupTimerRef.current);
        popupTimerRef.current = null;
      }
    };
  }, [isOpen, game]);
  
  // Lås bakgrunden från att scrolla när modal är öppen
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Stäng med Escape-tangenten
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  // Hantera klick på provider
  const handleProviderClick = () => {
    if (game && game.provider) {
      onClose(); // Stäng modal först
      
      // Kort fördröjning innan navigering för att undvika rendering-problem
      setTimeout(() => {
        router.push(`/spel?provider=${encodeURIComponent(game.provider)}`);
      }, 100);
    }
  };
  
  // Hantera klick på spela med riktiga pengar
  const handleRealMoneyClick = () => {
    window.open(starzinoAffiliateLink, '_blank');
    setShowRealMoneyPopup(false);
  };
  
  // Stäng popupen och fortsätt i demo-läge
  const continueDemoMode = () => {
    setShowRealMoneyPopup(false);
  };
  
  // Hantera laddningsfel för iframe
  const handleLoadError = () => {
    setIsLoading(false);
    console.error('Kunde inte ladda spelet. Försök igen senare.');
  };
  
  if (!isOpen || !game) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity animate-fadeIn">
      <div className="bg-gradient-to-b from-gray-900 to-black w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh] border border-pink-500/30">
        {/* Header med gradient */}
        <div className="bg-gradient-to-r from-pink-700 to-pink-500 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{game.name}</h2>
            <button 
              onClick={handleProviderClick}
              className="text-white/80 hover:text-white text-sm font-medium hover:underline transition-colors inline-flex items-center mt-1"
            >
              <span className="mr-1">Från</span> 
              <span className="font-semibold">{game.provider}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <button 
            onClick={onClose} 
            className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Stäng"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Game iframe container with better styling */}
        <div className="flex-grow overflow-hidden relative">
          <div className="flgIframeContainer">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                <div className="w-16 h-16 relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-pulse w-8 h-8 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-gray-300 animate-pulse">Laddar {game.name} från {game.provider}...</p>
                <p className="mt-2 text-gray-400 text-sm">Detta är en gratis demo via FirstLookGames</p>
              </div>
            )}
            
            {/* Real Money Popup efter 60 sekunder */}
            {showRealMoneyPopup && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80 animate-fadeIn">
                <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl shadow-2xl max-w-md border border-pink-500/30 text-center">
                  <div className="mb-2 flex justify-center">
                    <svg className="w-16 h-16 text-yellow-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Vill du spela med riktiga pengar?</h3>
                  <p className="text-gray-300 mb-6">
                    Demo-läget är kul, men spänningen är ännu större med riktiga pengar hos Starzino!
                  </p>
                  <div className="flex flex-col space-y-3">
                    <button 
                      onClick={handleRealMoneyClick}
                      className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
                    >
                      Spela med riktiga pengar
                      <span className="block text-xs mt-1 font-normal text-yellow-800">
                        Nya spelare får välkomstbonus!
                      </span>
                    </button>
                    <button 
                      onClick={continueDemoMode}
                      className="w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-colors"
                    >
                      Fortsätt spela demo
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <iframe 
              src={game.url} 
              className="border-none"
              onLoad={() => setIsLoading(false)}
              onError={handleLoadError}
              allow="fullscreen"
              title={`${game.name} demo`}
            />
          </div>
        </div>
        
        {/* Footer med gradient och spelinfo */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-black border-t border-pink-500/30">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
            <p className="text-sm text-gray-300">
              Detta är en gratis demo av {game.name}. 
              <span className="text-xs opacity-80 ml-1">Tillhandahålls via FirstLookGames.</span>
            </p>
            
            <div className="flex space-x-2">
              <button 
                onClick={handleProviderClick}
                className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center"
              >
                Fler från {game.provider}
              </button>
              <Link 
                href="/spel" 
                className="px-3 py-1.5 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors"
                onClick={onClose}
              >
                Alla spel
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay close handler with improved animation */}
      <div className="absolute inset-0 z-[-1] animate-fadeIn" onClick={onClose} />
    </div>
  );
} 