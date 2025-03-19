"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: "Vad är en casinobonus?",
      answer: "En casinobonus är ett erbjudande från ett online casino som ger dig extra pengar eller free spins när du gör en insättning eller registrerar dig. Det finns olika typer av bonusar, som välkomstbonusar, insättningsbonusar, cashback-bonusar och free spins."
    },
    {
      question: "Hur fungerar omsättningskrav?",
      answer: "Omsättningskrav är villkor som anger hur många gånger du måste spela för bonusbeloppet innan du kan ta ut vinster. Till exempel, om du får en bonus på 100 kr med ett omsättningskrav på 35x, måste du spela för 3 500 kr innan du kan ta ut eventuella vinster från bonusen."
    },
    {
      question: "Vad är RTP (Return to Player)?",
      answer: "RTP (Return to Player) är den procentuella andelen av alla satsade pengar som en spelautomat betalar tillbaka till spelarna över tid. Till exempel, om en slot har en RTP på 96%, betyder det att för varje 100 kr som satsas, betalas i genomsnitt 96 kr tillbaka till spelarna på lång sikt."
    },
    {
      question: "Vad är skillnaden mellan slots och jackpottspel?",
      answer: "Slots är spelautomater med fasta vinstbelopp baserade på symbolkombinationer och insatsnivåer. Jackpottspel är slots där en del av varje insats går till en progressiv jackpott som växer tills någon vinner den. Jackpottspel kan erbjuda mycket större vinster, men har ofta något lägre RTP för de vanliga vinsterna."
    },
    {
      question: "Är det säkert att spela på online casinon?",
      answer: "Ja, om du spelar på licensierade casinon. Casinon med licens från exempelvis Malta Gaming Authority (MGA) eller svenska Spelinspektionen måste följa strikta regler för säkerhet, rättvisa spel och spelaransvar. Vi rekommenderar endast casinon som har giltiga licenser och använder krypterad kommunikation för att skydda dina uppgifter."
    },
    {
      question: "Vad är casino utan registrering?",
      answer: "Casino utan registrering (även kallat Pay N Play) är casinon där du kan börja spela direkt utan att skapa ett konto. Istället identifierar du dig med BankID och gör insättningar via Trustly. Detta gör processen snabbare och enklare, och uttag betalas ofta ut inom minuter."
    },
    {
      question: "Hur väljer jag rätt casino för mig?",
      answer: "När du väljer ett casino bör du överväga faktorer som bonuserbjudanden, spelutbud, betalningsmetoder, uttagstider, kundtjänst och mobilkompatibilitet. Tänk på vad som är viktigast för dig - om du till exempel värdesätter snabba uttag, kan ett Pay N Play-casino vara bäst. Läs våra recensioner för att hitta ett casino som passar dina preferenser."
    },
    {
      question: "Hur gör jag en insättning på ett online casino?",
      answer: "För att göra en insättning, logga in på ditt casinokonto och klicka på 'Insättning' eller 'Kassa'. Välj din föredragna betalningsmetod (t.ex. bankkort, e-plånbok, banköverföring eller Trustly), ange belopp och följ instruktionerna. De flesta insättningar krediteras ditt konto omedelbart, men vissa metoder kan ta längre tid."
    },
    {
      question: "Hur lång tid tar uttag?",
      answer: "Uttagstider varierar beroende på casino och betalningsmetod. E-plånböcker och Pay N Play-casinon erbjuder ofta de snabbaste uttagen, ibland inom minuter. Bankkort kan ta 1-3 bankdagar, medan banköverföringar kan ta 3-5 bankdagar. Notera att casinon ofta har en verifieringsperiod för uttag, särskilt för nya spelare eller större belopp."
    },
    {
      question: "Vad är free spins?",
      answer: "Free spins är gratissnurr på spelautomater som låter dig spela utan att använda dina egna pengar. De kan ges som del av en välkomstbonus, som en kampanj för befintliga spelare, eller som en belöning i själva spelet. Vinster från free spins är ofta föremål för omsättningskrav innan de kan tas ut."
    }
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
            <span className="text-gray-600">FAQ</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-[hsl(var(--primary))] mb-8">Vanliga frågor (FAQ)</h1>
            <p className="text-lg text-center text-gray-700 mb-12">
              Här hittar du svar på de vanligaste frågorna om casinobonusar, spel och allt annat relaterat till online casino.
            </p>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className="border border-[hsl(var(--border))] rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left bg-white hover:bg-[hsl(var(--light-pink))] transition-colors flex justify-between items-center"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-medium text-lg">{item.question}</span>
                    <svg 
                      className={`w-5 h-5 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 py-4 bg-[hsl(var(--neutral-light))]">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg mb-4">Hittade du inte svar på din fråga? Kontakta oss!</p>
              <Link 
                href="mailto:info@slotskolan.se" 
                className="px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-full font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Mejla oss
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 