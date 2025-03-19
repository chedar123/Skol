"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Game } from '@/lib/data/games-data';
import GameCard from '@/components/slots/GameCard';
import GameModal from '@/components/slots/GameModal';
import Image from 'next/image';
import { Search, Filter, X } from 'lucide-react';

// Antal spel som ska visas per sida
const ITEMS_PER_PAGE = 20;

export default function GamesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [visibleGames, setVisibleGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // Initiala sökparametrar
  useEffect(() => {
    const provider = searchParams?.get('provider') || '';
    if (provider) {
      setSelectedProvider(provider);
    }
    
    const query = searchParams?.get('query') || '';
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);
  
  // Hämta spel
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        let url = '/api/games';
        const params = new URLSearchParams();
        
        if (selectedProvider) {
          params.append('provider', selectedProvider);
        }
        
        if (searchQuery) {
          params.append('query', searchQuery);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Något gick fel vid hämtning av spelen');
        }
        
        const data = await response.json();
        setGames(data.games);
        setFilteredGames(data.games);
        setProviders(data.providers);
        setTotalGames(data.totalCount || 0);
        
        // Sätt första sidan av spel
        setVisibleGames(data.games.slice(0, ITEMS_PER_PAGE));
        setCurrentPage(1);
        setHasMore(data.games.length > ITEMS_PER_PAGE);
        
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGames();
  }, [selectedProvider, searchQuery]);
  
  // Hantera sökning
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Uppdatera URL för att reflektera sökningen
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('query', searchQuery);
    }
    if (selectedProvider) {
      params.append('provider', selectedProvider);
    }
    
    const newUrl = `/spel${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  };
  
  // Rensa sökningen
  const clearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams();
    if (selectedProvider) {
      params.append('provider', selectedProvider);
    }
    
    const newUrl = `/spel${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  };
  
  // Välj provider
  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider === selectedProvider ? '' : provider);
    
    const params = new URLSearchParams();
    if (provider && provider !== selectedProvider) {
      params.append('provider', provider);
    }
    if (searchQuery) {
      params.append('query', searchQuery);
    }
    
    const newUrl = `/spel${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  };
  
  // Hantera klick på Spela demo
  const handlePlayDemo = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };
  
  // Stäng modalen
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Ladda fler spel
  const loadMoreGames = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = nextPage * ITEMS_PER_PAGE;
    
    const newVisibleGames = [...visibleGames, ...filteredGames.slice(startIndex, endIndex)];
    setVisibleGames(newVisibleGames);
    setCurrentPage(nextPage);
    
    // Uppdatera om det finns fler spel att visa
    setHasMore(endIndex < filteredGames.length);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Spelautomater</h1>
      
      {/* Sök och filtreringssektion */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sökformulär */}
          <form onSubmit={handleSearch} className="flex-grow flex items-center relative">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Sök efter spel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Sök
            </button>
          </form>
          
          {/* Provider-filter dropdown */}
          <div className="w-full md:w-64 relative">
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) => handleProviderSelect(e.target.value)}
                className="w-full appearance-none px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Alla leverantörer</option>
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visar filtreringsresultat om de filtreras */}
      {(searchQuery || selectedProvider) && (
        <div className="mb-6 flex items-center text-gray-600">
          <p>
            Visar {filteredGames.length} av {totalGames} spel
            {selectedProvider && <span> från <span className="font-semibold">{selectedProvider}</span></span>}
            {searchQuery && <span> matchande <span className="font-semibold">"{searchQuery}"</span></span>}
          </p>
          
          {(searchQuery || selectedProvider) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedProvider('');
                router.push('/spel');
              }}
              className="ml-4 text-pink-600 hover:text-pink-700 text-sm font-medium underline"
            >
              Rensa filter
            </button>
          )}
        </div>
      )}
      
      {/* Spelgalleri */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-t-4 border-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Laddar spel...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Inga spel hittades med de angivna filtren.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedProvider('');
              router.push('/spel');
            }}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Visa alla spel
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {visibleGames.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onClick={() => handlePlayDemo(game)}
                onPlayDemo={handlePlayDemo}
              />
            ))}
          </div>
          
          {/* Visa mer-knapp */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMoreGames}
                className="px-6 py-3 bg-white border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors font-medium"
              >
                Visa fler spel ({filteredGames.length - visibleGames.length} kvar)
              </button>
            </div>
          )}
          
          {/* Information om bildkälla */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Spelbilder tillhandahålls via FirstLookGames.</p>
          </div>
        </>
      )}
      
      {/* Modal för speldemo */}
      <GameModal
        game={selectedGame}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
} 