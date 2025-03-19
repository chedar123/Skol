import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface RatingSystemProps {
  casinoId: string;
  onRatingChange?: (newRating: number) => void;
}

export default function RatingSystem({ casinoId, onRatingChange }: RatingSystemProps) {
  const { data: session, status } = useSession();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hämta betyg när komponenten laddas
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`/api/ratings?casinoId=${casinoId}`);
        if (response.ok) {
          const data = await response.json();
          setAverageRating(data.averageRating || 0);
          setTotalRatings(data.totalRatings || 0);
          
          // Om användaren är inloggad, kolla om de har betygsatt detta casino
          if (session?.user?.id) {
            const userRatingObj = data.ratings?.find((r: any) => r.userId === session.user.id);
            if (userRatingObj) {
              setUserRating(userRatingObj.rating);
            }
          }
        }
      } catch (error) {
        console.error('Fel vid hämtning av betyg:', error);
        setError('Kunde inte hämta betyg');
      }
    };

    fetchRatings();
  }, [casinoId, session]);

  // Hantera betygsättning
  const handleRating = async (rating: number) => {
    if (!session) {
      alert('Du måste vara inloggad för att betygsätta');
      return;
    }

    setIsLoading(true);
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
        setUserRating(data.userRating);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
        
        if (onRatingChange) {
          onRatingChange(data.averageRating);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Kunde inte spara betyg');
      }
    } catch (error) {
      console.error('Fel vid betygsättning:', error);
      setError('Ett fel uppstod vid betygsättning');
    } finally {
      setIsLoading(false);
    }
  };

  // Hantera borttagning av betyg
  const handleRemoveRating = async () => {
    if (!session || userRating === null) {
      return;
    }

    if (!window.confirm('Är du säker på att du vill ta bort ditt betyg?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ratings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          casinoId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserRating(null);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
        
        if (onRatingChange) {
          onRatingChange(data.averageRating);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Kunde inte ta bort betyg');
      }
    } catch (error) {
      console.error('Fel vid borttagning av betyg:', error);
      setError('Ett fel uppstod vid borttagning av betyg');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-6" id="rating">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[hsl(var(--light-pink))] p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Sätt ditt betyg</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="text-5xl focus:outline-none disabled:opacity-50 mx-1"
                  aria-label={`Betygsätt ${star} av 5 stjärnor`}
                >
                  <span className={`
                    ${(hoveredRating !== null && star <= hoveredRating) || (hoveredRating === null && userRating !== null && star <= userRating)
                      ? 'text-yellow-500'
                      : 'text-gray-300'}
                    hover:text-yellow-500 transition-colors
                  `}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            
            <div className="text-center">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sparar...
                </span>
              ) : (
                <>
                  {userRating !== null ? (
                    <div>
                      <p className="text-lg font-medium">Ditt betyg: <strong className="text-[hsl(var(--primary))]">{userRating}/5</strong></p>
                      <button
                        type="button"
                        onClick={handleRemoveRating}
                        disabled={isLoading}
                        className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors underline"
                        aria-label="Ta bort betyg"
                      >
                        Ta bort mitt betyg
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      {status === "authenticated" 
                        ? "Klicka på stjärnorna för att betygsätta" 
                        : "Logga in för att betygsätta"}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Användarnas betyg</h3>
          
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold text-[hsl(var(--primary))] mb-2">
              {averageRating.toFixed(1)}
            </div>
            
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-8 h-8 ${
                    i < Math.floor(averageRating) 
                      ? "text-yellow-500" 
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <p className="text-gray-600 text-center">
              Baserat på <strong>{totalRatings}</strong> användarrecensioner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 