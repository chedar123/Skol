"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Casino } from "@/lib/data/casino-data";
import FavoriteButton from "@/components/common/FavoriteButton";
import { useSession } from "next-auth/react";

interface CasinoPopupModalProps {
  casino: Casino;
  onClose: () => void;
  favorite?: { id: string };
  onFavoriteUpdate?: (favorite: { id: string } | undefined) => void;
}

export default function CasinoPopupModal({ casino, onClose, favorite: initialFavorite, onFavoriteUpdate }: CasinoPopupModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [averageRating, setAverageRating] = useState<number>(parseFloat(casino.rating));
  const [totalRatings, setTotalRatings] = useState<number>(parseInt(casino.reviews || "0"));
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isRatingLoading, setIsRatingLoading] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Uppdatera favorit-status när initialFavorite ändras
  useEffect(() => {
    setFavorite(initialFavorite);
  }, [initialFavorite]);

  // Hämta betyg när komponenten laddas
  useEffect(() => {
    fetchRatings();
  }, [casino.id, session]);

  // Hämta betyg från API
  const fetchRatings = async () => {
    if (!casino.id) {
      console.error('Casino ID saknas i CasinoPopupModal');
      return;
    }

    try {
      console.log(`Hämtar betyg för casino med ID: ${casino.id}`);
      const response = await fetch(`/api/ratings?casinoId=${casino.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Hämtade betygsdata:", data);
        if (data.averageRating !== undefined) {
          setAverageRating(data.averageRating || parseFloat(casino.rating));
          setTotalRatings(data.totalRatings || parseInt(casino.reviews || "0"));
        }
        
        // Om användaren är inloggad, kolla om de har betygsatt detta casino
        if (session?.user?.id) {
          const userRatingObj = data.ratings?.find((r: any) => r.userId === session.user.id);
          if (userRatingObj) {
            setUserRating(userRatingObj.rating);
            setHasRated(true);
          } else {
            setUserRating(null);
            setHasRated(false);
          }
        }
      }
    } catch (error) {
      console.error('Fel vid hämtning av betyg:', error);
    }
  };

  // Hantera betygsättning
  const handleRating = async (rating: number) => {
    if (!session) {
      alert('Du måste vara inloggad för att betygsätta');
      return;
    }

    if (!casino.id) {
      console.error('Casino ID saknas i handleRating');
      setError('Kunde inte betygsätta: Casino ID saknas');
      return;
    }

    setIsRatingLoading(true);
    setError(null);

    try {
      console.log(`Skickar betyg ${rating} för casino med ID: ${casino.id}`);
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          casinoId: casino.id,
          rating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Betyg sparat:", data);
        setUserRating(rating);
        setHasRated(true);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
      } else {
        console.error("Fel vid betygsättning:", data);
        setError(data.error || 'Kunde inte spara betyg');
      }
    } catch (error) {
      console.error('Fel vid betygsättning:', error);
      setError('Ett fel uppstod vid betygsättning');
    } finally {
      setIsRatingLoading(false);
    }
  };

  // Ta bort betyg
  const handleRemoveRating = async () => {
    if (!session) {
      alert('Du måste vara inloggad för att ta bort betyg');
      return;
    }

    if (!casino.id) {
      console.error('Casino ID saknas i handleRemoveRating');
      setError('Kunde inte ta bort betyg: Casino ID saknas');
      return;
    }

    if (!confirm('Är du säker på att du vill ta bort ditt betyg?')) {
      return;
    }

    setIsRatingLoading(true);
    setError(null);

    try {
      console.log(`Tar bort betyg för casino med ID: ${casino.id}`);
      const response = await fetch('/api/ratings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          casinoId: casino.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Betyg borttaget:", data);
        setUserRating(null);
        setHasRated(false);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
      } else {
        const errorData = await response.json();
        console.error("Fel vid borttagning av betyg:", errorData);
        setError(errorData.error || 'Kunde inte ta bort betyg');
      }
    } catch (error) {
      console.error('Fel vid borttagning av betyg:', error);
      setError('Ett fel uppstod vid borttagning av betyg');
    } finally {
      setIsRatingLoading(false);
    }
  };

  // Callback för att uppdatera favorit-status när användaren klickar på hjärtat
  const handleFavoriteUpdate = (newFavorite: { id: string } | undefined) => {
    setFavorite(newFavorite);
    if (onFavoriteUpdate) {
      onFavoriteUpdate(newFavorite);
    }
  };

  // Stäng modal när användaren trycker på Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Stäng modal när användaren klickar utanför
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Förhindra scrollning på body när modalen är öppen
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Generate stars based on rating
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.3 && averageRating % 1 <= 0.7;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header with close button */}
        <div className="relative">
          <div className="h-40 sm:h-48 md:h-56 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] relative">
            <Image
              src={casino.popupImage || casino.logo}
              alt={casino.name}
              fill
              className="object-contain p-4"
            />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))]">{casino.name}</h2>
            <FavoriteButton
              casinoId={casino.id}
              isFavorite={!!favorite}
              favoriteId={favorite?.id}
              showCount={true}
              size="lg"
              onFavoriteUpdate={handleFavoriteUpdate}
            />
          </div>

          {/* Rating */}
          <div className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center">
                <div className="text-yellow-500 text-xl mr-2" aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`}>
                  {'★'.repeat(fullStars)}
                  {hasHalfStar ? '½' : ''}
                  {'☆'.repeat(emptyStars)}
                </div>
                <span className="text-lg font-medium">{averageRating.toFixed(1)}/5</span>
                <span className="text-sm text-gray-600 ml-2">({totalRatings} recensioner)</span>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <div className="flex items-center">
                {!hasRated ? (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">Betygsätt:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={isRatingLoading}
                          onClick={() => handleRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(null)}
                          className="text-2xl focus:outline-none disabled:opacity-50"
                          aria-label={`Betygsätt ${star} av 5 stjärnor`}
                        >
                          <span className={`
                            ${hoveredRating !== null && star <= hoveredRating
                              ? 'text-yellow-500'
                              : 'text-gray-300'}
                            hover:text-yellow-500 transition-colors
                          `}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    
                    {isRatingLoading && (
                      <span className="ml-2 text-sm text-gray-600 flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sparar...
                      </span>
                    )}
                    
                    {!session && (
                      <span className="ml-2 text-sm text-gray-600">
                        Logga in för att betygsätta
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-green-600 mr-2">Ditt betyg:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-2xl ${star <= (userRating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={handleRemoveRating}
                      className="ml-2 text-sm text-red-500 hover:text-red-700"
                      disabled={isRatingLoading}
                    >
                      Ta bort
                    </button>
                    
                    {isRatingLoading && (
                      <span className="ml-2 text-sm text-gray-600 flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sparar...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{casino.description}</p>

          {/* Bonus Information */}
          <div className="bg-[hsl(var(--muted))] p-4 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-2">Välkomstbonus</h3>
            <p className="text-lg mb-2">{casino.bonusAmount}</p>
            <p className="text-sm text-gray-600">Nya spelare. Minsta insättning €20. Omsättningskrav gäller.</p>
          </div>

          {/* Features */}
          {casino.features && casino.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Funktioner</h3>
              <div className="flex flex-wrap gap-2">
                {casino.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-[hsl(var(--muted))] px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/recension/${casino.id}`}
              className="flex-1 text-center py-2 px-4 rounded-md border border-[hsl(var(--primary))] text-[hsl(var(--primary))] font-medium hover:bg-[hsl(var(--primary))]/5 transition-colors"
              onClick={onClose}
            >
              Läs recension
            </Link>
            <a
              href={casino.affiliateLink || casino.ctaLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-4 rounded-md bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors"
            >
              Spela nu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 