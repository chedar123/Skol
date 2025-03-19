"use client";

import React from 'react';
import CasinoReview from '@/components/CasinoReview';
import { casinoList } from '@/lib/data/casino-data';
import Link from 'next/link';
import CommentSection from '@/components/common/CommentSection';

export default function HugoCasinoReviewPage() {
  const hugoCasino = casinoList.find(casino => casino.id === "hugocasino");

  if (!hugoCasino) {
    return <div>Casino not found</div>;
  }

  const pros = [
    "Väldigt stort spelutbud med över 3000 spel",
    "Generöst välkomsterbjudande med 225% bonus upp till €600 + 275 free spins",
    "Snyggt och användarvänligt gränssnitt",
    "Regelbundna kampanjer och turneringar",
    "Bra mobilanpassad webbplats"
  ];

  const cons = [
    "Kräver VPN för att spela från Sverige",
    "Begränsad kundtjänst jämfört med konkurrenterna",
    "Vissa uttag kan ta längre tid än förväntat"
  ];

  const fullReview = `Hugo Casino har etablerat sig som ett populärt alternativ för spelare som söker ett omfattande spelutbud och generösa bonusar. Med över 3000 spel från ledande leverantörer erbjuder de en av de mest omfattande spelsamlingarna på marknaden.

  Välkomsterbjudandet på Hugo Casino är verkligen imponerande med en 225% bonus upp till €600 plus 275 free spins. Detta är betydligt mer generöst än vad många konkurrenter erbjuder och ger nya spelare en rejäl boost till deras spelkonto från start.

  Casinots gränssnitt är snyggt designat och mycket användarvänligt, vilket gör det enkelt att navigera mellan olika spelkategorier och hitta sina favoritspel. Webbplatsen är också väl optimerad för mobila enheter, vilket gör det möjligt att spela på språng utan att kompromissa med spelupplevelsen.

  Hugo Casino erbjuder regelbundna kampanjer och turneringar som håller spelupplevelsen spännande även för återkommande spelare. Dessa inkluderar allt från reload-bonusar och cashback-erbjudanden till spännande turneringar med stora prispotter.

  En betydande nackdel med Hugo Casino är att det kräver VPN för spelare från Sverige. Detta beror på att casinot inte har en svensk spellicens, vilket kan vara en dealbreaker för spelare som föredrar att spela på licensierade plattformar.

  Kundtjänsten på Hugo Casino är funktionell men något begränsad jämfört med vissa konkurrenter. Live-chatten är inte alltid tillgänglig dygnet runt, vilket kan vara frustrerande för spelare som stöter på problem under udda tider.

  Uttagsprocessen är generellt smidig, men vissa spelare har rapporterat längre väntetider än förväntat, särskilt för större belopp. Detta är något att ha i åtanke för spelare som värdesätter snabba uttag.

  Sammanfattningsvis är Hugo Casino ett utmärkt val för spelare som söker ett stort spelutbud och generösa bonusar, och som inte har något emot att använda VPN för att komma åt plattformen från Sverige. Deras imponerande spelbibliotek och regelbundna kampanjer gör dem till ett attraktivt alternativ trots de mindre nackdelarna.`;

  const paymentMethods = [
    'Visa', 
    'Mastercard', 
    'Trustly', 
    'Skrill',
    'Neteller',
    'Bitcoin', 
    'Ethereum', 
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
    'Quickspin',
    'Thunderkick',
    'Push Gaming'
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
            <span className="text-gray-600">{hugoCasino.name}</span>
          </div>
        </div>
      </div>
      
      <CasinoReview
        casino={hugoCasino}
        pros={pros}
        cons={cons}
        fullReview={true}
        paymentMethods={paymentMethods}
        gameProviders={gameProviders}
        withdrawalTime="1-3 dagar"
        customerSupport={['Live Chat 24/7', 'Email', 'FAQ']}
      />
      
      {/* Kommentarssektion */}
      <div className="container mx-auto px-4 py-4">
        <CommentSection casinoId={hugoCasino.id} />
      </div>
    </>
  );
} 