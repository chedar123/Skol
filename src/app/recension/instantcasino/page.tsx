"use client";

import React from 'react';
import CasinoReview from '@/components/CasinoReview';
import { casinoList } from '@/lib/data/casino-data';
import Link from 'next/link';
import CommentSection from '@/components/common/CommentSection';

export default function InstantCasinoReviewPage() {
  const instantCasino = casinoList.find(casino => casino.id === "instantcasino");

  if (!instantCasino) {
    return <div>Casino not found</div>;
  }

  const pros = [
    "Unikt cashbacksystem som garanterar att du alltid har pengar på kontot",
    "Extremt snabba uttag, ofta inom några minuter",
    "Cryptovänligt med stöd för flera olika kryptovalutor",
    "Enkel och snabb registrering utan krångel",
    "Inga omsättningskrav på cashback-bonusar"
  ];

  const cons = [
    "Har inte alla spelleverantörer i sitt utbud",
    "Saknar traditionella välkomstbonusar som många andra casinon erbjuder",
    "Begränsat utbud av bordsspel jämfört med konkurrenterna"
  ];

  const fullReview = `Instant Casino har tagit den svenska casinomarknaden med storm tack vare sitt innovativa cashbacksystem. Till skillnad från traditionella casinon som lockar med stora välkomstbonusar, erbjuder Instant Casino istället 10% cashback varje vecka på alla förluster. Detta betyder att spelare alltid får tillbaka en del av sina pengar, oavsett hur spelsessionen går.

  Det som verkligen utmärker Instant Casino är deras blixtsnabba uttagsprocess. Medan många andra casinon kan ta dagar för att behandla uttag, levererar Instant Casino ofta pengarna inom några minuter. Detta är särskilt imponerande när det gäller kryptovalutor, där transaktioner kan slutföras nästan omedelbart.

  Instant Casino har gjort sig ett namn som ett cryptovänligt casino, med stöd för Bitcoin, Ethereum, Litecoin och flera andra kryptovalutor. Detta ger spelare som föredrar anonymitet och snabba transaktioner ett utmärkt alternativ till traditionella betalningsmetoder.

  Registreringsprocessen på Instant Casino är enkel och snabb, utan onödiga steg eller verifieringar. Detta gör det möjligt för spelare att komma igång med sitt spelande på bara några minuter.

  En av de få nackdelarna med Instant Casino är att de inte har avtal med alla stora spelleverantörer. Detta betyder att vissa populära spel kanske inte finns tillgängliga. Dessutom är utbudet av bordsspel något begränsat jämfört med större casinon.

  Trots dessa mindre brister är Instant Casino ett utmärkt val för spelare som värdesätter snabba uttag, enkla bonussystem utan omsättningskrav, och möjligheten att använda kryptovalutor. Deras cashbacksystem är särskilt attraktivt för regelbundna spelare som vill minimera sina förluster över tid.`;

  const paymentMethods = [
    'Visa', 
    'Mastercard', 
    'Trustly', 
    'Bitcoin', 
    'Ethereum', 
    'Litecoin', 
    'Dogecoin',
    'Ripple'
  ];

  const gameProviders = [
    'NetEnt', 
    'Pragmatic Play',
    'Red Tiger',
    'Quickspin',
    'Nolimit City',
    'Big Time Gaming'
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-[hsl(var(--light-pink))] py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] transition-colors">
              Slotskolan
            </Link>
            <span className="text-gray-400 mx-1">&raquo;</span>
            <Link href="/recension" className="text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] transition-colors">
              Recensioner
            </Link>
            <span className="text-gray-400 mx-1">&raquo;</span>
            <span className="text-gray-600">{instantCasino.name}</span>
          </div>
        </div>
      </div>
      
      <CasinoReview
        casino={instantCasino}
        pros={pros}
        cons={cons}
        fullReview={true}
        paymentMethods={paymentMethods}
        gameProviders={gameProviders}
        withdrawalTime="5-30 minuter"
        customerSupport={['Live Chat 24/7', 'Email', 'FAQ', 'Telefon']}
      />

      {/* Kommentarssektion */}
      <div className="container mx-auto px-4 py-4">
        <CommentSection casinoId={instantCasino.id} />
      </div>
    </>
  );
} 