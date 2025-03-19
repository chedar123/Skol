"use client";

import React from 'react';
import Link from 'next/link';
import CasinoReview from '@/components/CasinoReview';
import { casinoList } from '@/lib/data/casino-data';
import CommentSection from '@/components/common/CommentSection';

export default function GGBetReviewPage() {
  const ggbet = casinoList.find(casino => casino.id === "ggbet");

  if (!ggbet) {
    return <div>Casino not found</div>;
  }

  const pros = [
    "Stort och välkänt varumärke med gott rykte",
    "Omfattande sportsbetting-utbud med både traditionell sport och esport",
    "Stort online casino med över 2500 spel",
    "Generöst välkomsterbjudande upp till €4500 + 275 free spins",
    "Användarvänlig mobilapp för spel på språng"
  ];

  const cons = [
    "Kundtjänsten kan ibland ha långa svarstider under högtrafik",
    "Vissa bonusar har höga omsättningskrav",
    "Begränsat utbud av betalningsmetoder jämfört med vissa konkurrenter"
  ];

  const fullReview = true;
  const fullReviewText = `GGBet har etablerat sig som ett av de mest respekterade och pålitliga online casinona och sportsbetting-plattformarna på marknaden. Med en solid bakgrund och ett starkt fokus på både traditionell sport och esport har de skapat en unik position i branschen.

  En av GGBets största styrkor är deras omfattande sportsbetting-utbud. De erbjuder odds på ett imponerande antal sporter, från fotboll, tennis och basket till mer nischade sporter. Men det som verkligen särskiljer dem är deras fokus på esport, där de erbjuder ett av marknadens mest omfattande utbud med betting på populära spel som CS:GO, Dota 2, League of Legends och många fler.

  Casinodelen av GGBet är lika imponerande med över 2500 spel från ledande leverantörer. Här finns allt från klassiska slots och jackpottspel till ett omfattande live casino med professionella dealers. Spelutbudet uppdateras regelbundet med nya titlar, vilket säkerställer att det alltid finns något nytt att upptäcka.

  Välkomsterbjudandet på GGBet är ett av de mest generösa på marknaden, med upp till €4500 i bonus plus 275 free spins. Detta ger nya spelare en betydande boost till deras spelkonto och möjlighet att utforska plattformens många spel och bettingalternativ.

  För spelare som föredrar att spela på språng erbjuder GGBet en välutvecklad mobilapp som är tillgänglig för både iOS och Android. Appen erbjuder nästan alla funktioner som finns på desktop-versionen, vilket gör det enkelt att placera bets eller spela casinospel var du än befinner dig.

  Trots alla fördelar finns det några områden där GGBet kan förbättra sig. Kundtjänsten, som generellt är hjälpsam och kunnig, kan ibland ha långa svarstider under perioder med hög belastning. Vissa bonusar har också relativt höga omsättningskrav, vilket kan göra det utmanande att omvandla bonuspengar till riktiga pengar.

  Utbudet av betalningsmetoder är funktionellt men något begränsat jämfört med vissa konkurrenter, särskilt när det gäller kryptovalutor. Detta kan vara en nackdel för spelare som föredrar att använda alternativa betalningsmetoder.

  Sammanfattningsvis är GGBet ett utmärkt val för spelare som söker en pålitlig plattform med ett brett utbud av både sportsbetting och casinospel. Deras fokus på esport gör dem särskilt attraktiva för spelare som är intresserade av denna växande marknad.`;

  const paymentMethods = [
    'Visa', 
    'Mastercard', 
    'Trustly', 
    'Skrill',
    'Neteller',
    'Banköverföring',
    'Paysafecard'
  ];

  const gameProviders = [
    'NetEnt', 
    'Microgaming', 
    'Play\'n GO', 
    'Evolution Gaming', 
    'Pragmatic Play',
    'Yggdrasil',
    'Red Tiger',
    'Quickspin',
    'Betsoft',
    'iSoftBet'
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
            <span className="text-gray-600">{ggbet.name}</span>
          </div>
        </div>
      </div>
      
      <CasinoReview
        casino={ggbet}
        pros={pros}
        cons={cons}
        fullReview={fullReview}
        fullReviewText={fullReviewText}
        paymentMethods={paymentMethods}
        gameProviders={gameProviders}
        withdrawalTime="12-48 timmar"
        customerSupport={['Live Chat 24/7', 'Email', 'Telefon', 'FAQ']}
      />
      
      {/* Kommentarssektion */}
      <div className="container mx-auto px-4 py-4">
        <CommentSection casinoId={ggbet.id} />
      </div>
    </>
  );
} 