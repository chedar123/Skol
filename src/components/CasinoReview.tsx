"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Casino } from '@/lib/data/casino-data';
import { useSession } from 'next-auth/react';
import CasinoInfo from './casino/CasinoInfo';
import CasinoFeatures from './casino/CasinoFeatures';
import CasinoRating from './casino/CasinoRating';

interface CasinoReviewProps {
  casino: Casino;
  pros?: string[];
  cons?: string[];
  fullReview?: boolean;
  fullReviewText?: string;
  paymentMethods?: string[];
  gameProviders?: string[];
  withdrawalTime?: string;
  customerSupport?: string[];
  favorite?: boolean;
  isLoading?: boolean;
  onOpenModal?: () => void;
  casinoId?: string;
  onRatingChange?: (newRating: number) => void;
}

export default function CasinoReview({
  casino,
  pros = [],
  cons = [],
  fullReview = false,
  fullReviewText,
  paymentMethods = [],
  gameProviders = [],
  withdrawalTime = 'Inom 24 timmar',
  customerSupport = [],
  favorite = false,
  isLoading = false,
  onOpenModal,
  casinoId,
  onRatingChange
}: CasinoReviewProps) {
  const { data: session, status } = useSession();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isRatingLoading, setIsRatingLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [initialRating, setInitialRating] = useState<number | null>(null);

  // Logga casinoId för att se om det är korrekt
  useEffect(() => {
    console.log("CasinoReview - casinoId:", casinoId);
    console.log("CasinoReview - casino.id:", casino.id);
  }, [casinoId, casino.id]);

  // Hämta betyg när komponenten laddas
  useEffect(() => {
    fetchRatings();
  }, [casinoId, session]);

  // Hämta betyg från API
  const fetchRatings = async () => {
    if (!casinoId) {
      console.error('casinoId saknas i CasinoReview');
      setError('casinoId saknas');
      return;
    }
    
    try {
      console.log(`Hämtar betyg för casino med ID: ${casinoId}`);
      const response = await fetch(`/api/ratings?casinoId=${casinoId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Hämtade betygsdata:", data);
        
        // Uppdatera genomsnittsbetyg och antal betyg
        setAverageRating(data.averageRating || 0);
        setTotalRatings(data.totalRatings || 0);
        
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

  // Hämta betyg från API om casinoId finns
  useEffect(() => {
    if (casinoId) {
      const fetchInitialRating = async () => {
        try {
          const response = await fetch(`/api/ratings/${casinoId}/user`);
          if (response.ok) {
            const data = await response.json();
            if (data.rating) {
              setInitialRating(data.rating);
            }
          }
        } catch (error) {
          console.error('Kunde inte hämta användarens betyg:', error);
        }
      };

      fetchInitialRating();
    }
  }, [casinoId]);

  // Hantera betygsättning
  const handleRating = async (rating: number) => {
    if (!session) {
      alert('Du måste vara inloggad för att betygsätta');
      return;
    }

    if (!casinoId) {
      console.error('casinoId saknas');
      setError('Kunde inte betygsätta: casinoId saknas');
      return;
    }

    setIsRatingLoading(true);
    setError(null);

    try {
      console.log(`Skickar betyg ${rating} för casino med ID: ${casinoId}`);
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

      const data = await response.json();

      if (response.ok) {
        console.log("Betyg sparat:", data);
        setUserRating(rating);
        setHasRated(true);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
        
        if (onRatingChange) {
          onRatingChange(data.averageRating);
        }
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

    if (!casinoId) {
      console.error('casinoId saknas');
      setError('Kunde inte ta bort betyg: casinoId saknas');
      return;
    }

    if (!confirm('Är du säker på att du vill ta bort ditt betyg?')) {
      return;
    }

    setIsRatingLoading(true);
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
        setHasRated(false);
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
      setIsRatingLoading(false);
    }
  };

  // Generate stars based on rating
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.3 && averageRating % 1 <= 0.7;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Färgfältet överst */}
      <div className="h-2 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-light))]"></div>
      
      <div className="p-6 md:p-8">
        {/* Casino information */}
        <CasinoInfo 
          casino={{
            ...casino,
            logo: casino.popupImage // Använd popupImage istället för logo
          }}
          fullReview={fullReview}
          favorite={favorite}
          isLoading={isLoading}
          onOpenModal={onOpenModal}
        />
        
        {/* Casino betyg */}
        {casinoId && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <CasinoRating 
              casinoId={casinoId}
              initialRating={initialRating}
              onRatingChange={onRatingChange}
            />
          </div>
        )}
        
        {/* Casino funktioner */}
        <CasinoFeatures
          pros={pros}
          cons={cons}
          paymentMethods={paymentMethods}
          gameProviders={gameProviders}
          withdrawalTime={withdrawalTime}
          customerSupport={customerSupport}
        />
        
        {/* Footer med information */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-blue-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-left">
              <span className="font-medium">Viktigt att veta:</span> Alla casinon på denna sida är verifierade och granskade. Vi rekommenderar att du alltid läser villkoren för bonusar och erbjudanden innan du registrerar dig. Spela ansvarsfullt och ställ in gränser för ditt spelande.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 