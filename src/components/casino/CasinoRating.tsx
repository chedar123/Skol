"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CasinoRatingProps {
  casinoId: string;
  initialRating?: number | null;
  onRatingChange?: (newRating: number) => void;
}

export default function CasinoRating({
  casinoId,
  initialRating,
  onRatingChange
}: CasinoRatingProps) {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isRatingLoading, setIsRatingLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState<boolean>(false);

  // Beräkna stjärnor för visning
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Hämta betyg från API
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        // Hämta genomsnittligt betyg och antal betyg
        const avgResponse = await fetch(`/api/ratings/${casinoId}/average`);
        if (avgResponse.ok) {
          const avgData = await avgResponse.json();
          setAverageRating(avgData.averageRating || 0);
          setTotalRatings(avgData.totalRatings || 0);
        }

        // Sätt initialRating om det finns
        if (initialRating !== undefined && initialRating !== null) {
          setUserRating(initialRating);
          setHasRated(true);
        } else if (session) {
          // Hämta användarens betyg om de är inloggade
          const userResponse = await fetch(`/api/ratings/${casinoId}/user`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.rating) {
              setUserRating(userData.rating);
              setHasRated(true);
            }
          }
        }
      } catch (error) {
        console.error('Kunde inte hämta betyg:', error);
        setError('Kunde inte hämta betyg. Försök igen senare.');
      }
    };

    fetchRatings();
  }, [casinoId, session, initialRating]);

  // Hantera betygsättning
  const handleRating = async (rating: number) => {
    if (!session) {
      setError('Du måste vara inloggad för att betygsätta');
      return;
    }

    setIsRatingLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          casinoId,
          rating,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserRating(rating);
        setHasRated(true);
        setAverageRating(data.averageRating || averageRating);
        setTotalRatings(data.totalRatings || totalRatings);
        
        if (onRatingChange) {
          onRatingChange(rating);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Kunde inte spara betyg');
      }
    } catch (error) {
      console.error('Kunde inte spara betyg:', error);
      setError('Kunde inte spara betyg. Försök igen senare.');
    } finally {
      setIsRatingLoading(false);
    }
  };

  // Hantera borttagning av betyg
  const handleRemoveRating = async () => {
    if (!session) {
      return;
    }

    setIsRatingLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ratings/${casinoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setUserRating(null);
        setHasRated(false);
        setAverageRating(data.averageRating || 0);
        setTotalRatings(data.totalRatings || 0);
        
        if (onRatingChange) {
          onRatingChange(0);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Kunde inte ta bort betyg');
      }
    } catch (error) {
      console.error('Kunde inte ta bort betyg:', error);
      setError('Kunde inte ta bort betyg. Försök igen senare.');
    } finally {
      setIsRatingLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-5 text-[hsl(var(--primary))] flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Betyg och recensioner
      </h3>
      
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="text-amber-400 text-3xl mb-1" aria-label={`Betyg: ${averageRating.toFixed(1)} av 5 stjärnor`}>
            {'★'.repeat(fullStars)}
            {hasHalfStar ? '★' : ''}
            {'☆'.repeat(emptyStars)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 mt-1">av 5</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {totalRatings} {totalRatings === 1 ? 'recension' : 'recensioner'}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        
        <div className="flex-1">
          {!hasRated ? (
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-700 mb-2">Ditt betyg:</div>
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isRatingLoading}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="relative p-1 focus:outline-none disabled:opacity-50 transition-transform hover:scale-110 bg-transparent"
                    aria-label={`Betygsätt ${star} av 5 stjärnor`}
                  >
                    <svg 
                      className={`w-8 h-8 ${
                        hoveredRating !== null && star <= hoveredRating
                          ? 'text-amber-400 fill-current'
                          : 'text-gray-300 fill-current'
                      } transition-colors`}
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                ))}
              </div>
              
              {isRatingLoading && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sparar ditt betyg...
                </div>
              )}
              
              {!session && (
                <div className="mt-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 mb-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Logga in för att betygsätta detta casino
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center mb-3">
                <span className="text-sm font-medium text-gray-700 mr-3">Ditt betyg:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className={`w-6 h-6 ${star <= (userRating || 0) ? 'text-amber-400' : 'text-gray-300'} fill-current`}
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRemoveRating}
                disabled={isRatingLoading}
                className="inline-flex items-center px-4 py-2 bg-white border border-red-200 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors shadow-sm w-max"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Ta bort mitt betyg
              </button>
              
              {isRatingLoading && (
                <div className="mt-3 flex items-center text-sm text-gray-600">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Bearbetar...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 