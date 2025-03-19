"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { Casino } from '@/lib/data/casino-data';
import CasinoPopupModal from './CasinoPopupModal';
import FavoriteButton from '@/components/common/FavoriteButton';
import { useSession } from 'next-auth/react';

interface CasinoCardProps {
  casino: Casino;
  favorite?: {
    id: string;
  };
}

export default function CasinoCard({ casino, favorite: initialFavorite }: CasinoCardProps) {
  const { name, logo, rating, bonus, description, tags, affiliateLink, bonusAmount, ctaLink } = casino;
  const [showPopup, setShowPopup] = useState(false);
  const { data: session, status } = useSession();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(parseFloat(rating));
  const [totalRatings, setTotalRatings] = useState<number>(parseInt(casino.reviews || "0"));

  // Hämta favorit-status när komponenten laddas
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/favorites?userId=${session.user.id}`);
          
          if (response.ok) {
            const data = await response.json();
            const userFavorite = data.favorites.find(
              (fav: any) => fav.casinoId === casino.id
            );
            
            if (userFavorite) {
              setFavorite({ id: userFavorite.id });
            } else {
              setFavorite(undefined);
            }
          }
        } catch (error) {
          console.error("Fel vid hämtning av favorit-status:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFavoriteStatus();
  }, [casino.id, session?.user?.id, status]);

  // Hämta betyg när komponenten laddas
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`/api/ratings?casinoId=${casino.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.averageRating !== undefined) {
            setAverageRating(data.averageRating || parseFloat(rating));
            setTotalRatings(data.totalRatings || parseInt(casino.reviews || "0"));
          }
        }
      } catch (error) {
        console.error('Fel vid hämtning av betyg:', error);
      }
    };

    fetchRatings();
  }, [casino.id, rating, casino.reviews]);

  // Uppdatera favorit-status när initialFavorite ändras
  useEffect(() => {
    setFavorite(initialFavorite);
  }, [initialFavorite]);

  // Callback för att uppdatera favorit-status när användaren klickar på hjärtat
  const handleFavoriteUpdate = (newFavorite: { id: string } | undefined) => {
    setFavorite(newFavorite);
  };

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        <div className="flex">
          {[...Array(fullStars)].map((_, i) => (
            <svg
              key={`full-${i}`}
              className="w-3 h-3 md:w-4 md:h-4 text-[hsl(var(--primary))]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          
          {hasHalfStar && (
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-[hsl(var(--primary))]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id="halfStarGradient">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
              <path
                fill="url(#halfStarGradient)"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          )}
          
          {[...Array(emptyStars)].map((_, i) => (
            <svg
              key={`empty-${i}`}
              className="w-3 h-3 md:w-4 md:h-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-1 text-xs md:text-sm text-gray-600">{rating.toFixed(1)}</span>
        <span className="ml-1 text-xs text-gray-500">({totalRatings})</span>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border border-[hsl(var(--border))]">
        {/* Banner area with logo - clickable with hover effect */}
        <div 
          className="relative h-24 sm:h-28 md:h-40 bg-black cursor-pointer group"
          onClick={() => setShowPopup(true)}
        >
          <Image
            src={logo}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white text-[hsl(var(--primary))] px-2 py-1 md:px-4 md:py-2 rounded-full font-medium text-xs md:text-sm shadow-md">
              Visa detaljer
            </span>
          </div>
          {tags?.includes("popular") && (
            <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-[hsl(var(--primary))] text-white px-2 py-0.5 rounded text-xs font-medium">
              Populär
            </div>
          )}
          
          {/* Favorite Button */}
          <div 
            className="absolute top-1 left-1 md:top-2 md:left-2 z-10"
            onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking favorite
          >
            <FavoriteButton 
              casinoId={casino.id} 
              isFavorite={!!favorite} 
              favoriteId={favorite?.id}
              showCount={true}
              size="md"
              onFavoriteUpdate={handleFavoriteUpdate}
            />
          </div>
        </div>

        {/* Content area */}
        <div className="p-2 md:p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm md:text-xl text-[hsl(var(--primary))] mb-0.5 md:mb-2">{name}</h3>
          </div>
          <StarRating rating={averageRating} />
          
          <div className="mt-1 md:mt-3">
            <div className="text-xs md:text-sm text-gray-700 mb-1.5 md:mb-4 line-clamp-2">{description || "Exklusiva bonusar och spännande spel"}</div>
            
            <div className="bg-[hsl(var(--muted))] p-1.5 md:p-3 rounded-md mb-1.5 md:mb-4">
              <h4 className="text-xs md:text-sm font-medium text-[hsl(var(--primary))] mb-0 md:mb-1">Bonus:</h4>
              <p className="text-xs md:text-sm font-bold">{bonus || bonusAmount}</p>
            </div>
            
            <div className="flex flex-row space-x-1 md:space-x-3">
              <Link 
                href={`/recension/${casino.id}`} 
                className="flex-1 text-center py-1 md:py-2 px-1 md:px-4 rounded-md border border-[hsl(var(--primary))] text-[hsl(var(--primary))] font-medium hover:bg-[hsl(var(--primary))]/5 transition-colors text-2xs md:text-sm"
              >
                Läs recension
              </Link>
              <a 
                href={affiliateLink || ctaLink || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 text-center py-1 md:py-2 px-1 md:px-4 rounded-md bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors text-2xs md:text-sm"
              >
                Spela nu
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Casino Popup Modal */}
      {showPopup && (
        <CasinoPopupModal 
          casino={{
            ...casino,
            rating: averageRating.toString(),
            reviews: totalRatings.toString()
          }}
          onClose={() => setShowPopup(false)} 
          favorite={favorite}
          onFavoriteUpdate={handleFavoriteUpdate}
        />
      )}
    </>
  );
}
