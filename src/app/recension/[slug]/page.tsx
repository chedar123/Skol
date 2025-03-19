"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { casinoList, getCasinoBySlug } from '@/lib/data/casino-data';
import { useSession } from 'next-auth/react';
import CasinoReview from '@/components/CasinoReview';
import CasinoPopupModal from '@/components/CasinoPopupModal';
import CommentSection from '@/components/common/CommentSection';
import RatingSystem from '@/components/common/RatingSystem';
import { useParams } from 'next/navigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function CasinoPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const casino = getCasinoBySlug(slug || '');
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorite, setFavorite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  
  // Logga slug och casino för att se om de är korrekta
  useEffect(() => {
    console.log("Slug:", slug);
    console.log("Casino:", casino);
    if (casino) {
      console.log("Casino ID:", casino.id);
    }
  }, [slug, casino]);
  
  if (!casino) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Casino hittades inte</h1>
        <p className="text-gray-600 mb-8">Tyvärr kunde vi inte hitta det casino du söker.</p>
        <Link href="/recension" className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors">
          Tillbaka till recensioner
        </Link>
      </div>
    );
  }
  
  // Hämta användarens favoriter om användaren är inloggad
  useEffect(() => {
    const fetchFavorite = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/favorites?userId=${session.user.id}`);
          
          if (response.ok) {
            const data = await response.json();
            const foundFavorite = data.favorites?.find((fav: any) => fav.casinoId === casino.id);
            setFavorite(foundFavorite || null);
          }
        } catch (error) {
          console.error("Fel vid hämtning av favoriter:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFavorite();
  }, [status, session, casino.id]);

  // Hämta betyg när komponenten laddas
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        console.log("Hämtar betyg för casino med ID:", casino.id);
        const response = await fetch(`/api/ratings?casinoId=${casino.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Hämtade betygsdata:", data);
          if (data.averageRating !== undefined) {
            setAverageRating(data.averageRating);
            setTotalRatings(data.totalRatings);
          }
        }
      } catch (error) {
        console.error('Fel vid hämtning av betyg:', error);
      }
    };

    fetchRatings();
  }, [casino.id]);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Hantera när betyget ändras
  const handleRatingChange = (newRating: number) => {
    console.log("Nytt betyg:", newRating);
    setAverageRating(newRating);
  };

  // Exempel på recensionsdata
  const reviewData = {
    pros: [
      'Generös välkomstbonus',
      'Stort utbud av spel',
      'Snabba utbetalningar',
      'Utmärkt kundtjänst',
      'Mobilanpassad webbplats'
    ],
    cons: [
      'Begränsad tillgänglighet i vissa länder',
      'Vissa spel är inte tillgängliga på mobilen',
      'Begränsade betalningsmetoder för vissa regioner'
    ],
    fullReview: true,
    fullReviewText: `${casino.name} är ett online casino som erbjuder en förstklassig spelupplevelse för spelare som söker kvalitet och variation. Med en användarvänlig plattform och ett brett utbud av spel från ledande leverantörer, har ${casino.name} snabbt blivit ett populärt val bland svenska spelare.

    Casinot erbjuder en imponerande välkomstbonus som ger nya spelare en bra start. Bonusen inkluderar både free spins och bonuspengar, vilket ger spelarna möjlighet att utforska plattformen utan att riskera för mycket av sina egna pengar.

    Spelutbudet på ${casino.name} är omfattande och inkluderar allt från klassiska slots och bordsspel till live casino och jackpottspel. Samarbetet med ledande spelutvecklare som NetEnt, Microgaming och Play'n GO säkerställer att spelarna har tillgång till de senaste och mest populära titlarna.

    När det gäller betalningsmetoder erbjuder ${casino.name} flera säkra och snabba alternativ, inklusive banköverföringar, kreditkort och e-plånböcker. Utbetalningar behandlas vanligtvis inom 24-48 timmar, vilket är snabbare än många andra casinon på marknaden.

    Kundtjänsten på ${casino.name} är tillgänglig dygnet runt via live chat, e-post och en omfattande FAQ-sektion. Supportteamet är kunnigt och hjälpsamt, vilket säkerställer att eventuella problem eller frågor löses snabbt och effektivt.

    Sammanfattningsvis är ${casino.name} ett utmärkt val för både nybörjare och erfarna spelare som söker en pålitlig och underhållande casinoupplevelse online.`
  };

  // Skapa en modifierad version av casino-objektet med dynamiska betyg
  const casinoWithDynamicRatings = {
    ...casino,
    rating: averageRating.toString(),
    reviews: totalRatings.toString()
  };

  // Logga casinoWithDynamicRatings för att se om det är korrekt
  console.log("casinoWithDynamicRatings:", casinoWithDynamicRatings);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Hem', href: '/' },
            { label: 'Casinon', href: '/casinon' },
            { label: casino.name, href: `/recension/${slug}` }
          ]}
        />
        
        <CasinoReview 
          casino={casinoWithDynamicRatings}
          favorite={favorite}
          isLoading={isLoading}
          onOpenModal={handleOpenModal}
          casinoId={casino.id}
          onRatingChange={handleRatingChange}
          {...reviewData}
        />
        
        <div className="mt-12">
          <CommentSection 
            casinoId={casino.id}
          />
        </div>
      </div>
      
      {isModalOpen && (
        <CasinoPopupModal 
          casino={casinoWithDynamicRatings}
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
} 