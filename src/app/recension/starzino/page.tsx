"use client";

import React from 'react';
import CasinoReview from '@/components/CasinoReview';
import { casinoList } from '@/lib/data/casino-data';
import Link from 'next/link';
import CommentSection from '@/components/common/CommentSection';

export default function StarzinoReviewPage() {
  const starzino = casinoList.find(casino => casino.id === "starzino");

  if (!starzino) {
    return <div>Casino not found</div>;
  }

  const pros = [
    "Otroligt bra bonuserbjudande med upp till €1500 + 150 free spins",
    "Stöd för både kryptovalutor och traditionella betalningsmetoder",
    "Stort utbud av slots och live casino-spel",
    "Användarvänlig webbplats med snabb navigering",
    "Svensk licens och säker spelupplevelse"
  ];

  const cons = [
    "Ibland sega uttag som kan ta längre tid än förväntat",
    "Kundtjänsten kan vara svår att nå under högtrafik",
    "Vissa spel är inte tillgängliga i alla regioner"
  ];

  const fullReview = `Starzino har snabbt etablerat sig som ett av de ledande online casinona på den svenska marknaden. Med en kombination av generösa bonusar, ett brett spelutbud och en användarvänlig plattform har de lyckats skapa en spelupplevelse som tilltalar både nybörjare och erfarna spelare.

  Välkomstbonusen på upp till €1500 + 150 free spins är en av de mest generösa på marknaden. Bonusen är uppdelad på de första tre insättningarna, vilket ger nya spelare en chans att utforska casinot ordentligt innan de bestämmer sig för att fortsätta spela med egna pengar.

  En av Starzinos största styrkor är deras mångsidiga betalningsalternativ. De accepterar både traditionella betalningsmetoder som Visa, Mastercard och banköverföringar, samt kryptovalutor som Bitcoin och Ethereum. Detta gör det enkelt för alla spelare att hitta ett betalningssätt som passar dem.

  Spelutbudet på Starzino är imponerande med över 2000 spel från ledande leverantörer som NetEnt, Microgaming, Play'n GO och Evolution Gaming. Här finns allt från klassiska slots och jackpottspel till ett omfattande live casino med blackjack, roulette och baccarat.

  Trots alla fördelar finns det några områden där Starzino kan förbättra sig. Uttagstiderna kan ibland vara längre än vad som anges, särskilt under helger och högtider. Kundtjänsten, som i allmänhet är hjälpsam, kan vara svår att nå under perioder med hög belastning.

  Sammanfattningsvis är Starzino ett utmärkt val för spelare som söker ett pålitligt online casino med generösa bonusar och ett brett spelutbud. Deras stöd för kryptovalutor gör dem särskilt attraktiva för spelare som värdesätter anonymitet och snabba transaktioner.`;

  const paymentMethods = [
    'Visa', 
    'Mastercard', 
    'Trustly', 
    'Bitcoin', 
    'Ethereum', 
    'Litecoin', 
    'Banköverföring'
  ];

  const gameProviders = [
    'NetEnt', 
    'Microgaming', 
    'Play\'n GO', 
    'Evolution Gaming', 
    'Pragmatic Play',
    'Yggdrasil',
    'Red Tiger',
    'Quickspin'
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
            <span className="text-gray-600">{starzino.name}</span>
          </div>
        </div>
      </div>
      
      <CasinoReview
        casino={starzino}
        pros={pros}
        cons={cons}
        fullReview={true}
        paymentMethods={paymentMethods}
        gameProviders={gameProviders}
        withdrawalTime="24-72 timmar"
        customerSupport={['Live Chat 24/7', 'Email', 'FAQ']}
      />
      
      {/* Kommentarssektion */}
      <div className="container mx-auto px-4 py-4">
        <CommentSection casinoId={starzino.id} />
      </div>
    </>
  );
} 