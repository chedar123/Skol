"use client";

import React from 'react';
import Link from 'next/link';

export default function ResponsibleGamingPage() {
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
            <span className="text-gray-600">Ansvarsfullt Spelande</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-[hsl(var(--primary))] mb-8">Ansvarsfullt Spelande</h1>
            <p className="text-lg text-center text-gray-700 mb-12">
              På Slotskolan främjar vi ansvarsfullt spelande och vill hjälpa våra besökare att hålla sitt spelande roligt och under kontroll.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4">Vad är ansvarsfullt spelande?</h2>
                <p className="text-gray-700 mb-4">
                  Ansvarsfullt spelande handlar om att se casinospel som en form av underhållning, inte som ett sätt att tjäna pengar. Det innebär att du:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Spelar för nöjes skull och ser eventuella vinster som en bonus</li>
                  <li>Bara spelar för pengar du har råd att förlora</li>
                  <li>Sätter gränser för tid och pengar innan du börjar spela</li>
                  <li>Aldrig jagar förluster genom att satsa mer</li>
                  <li>Inte spelar när du är påverkad av alkohol eller droger</li>
                  <li>Balanserar spelande med andra aktiviteter och intressen</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4">Verktyg för ansvarsfullt spelande</h2>
                <p className="text-gray-700 mb-4">
                  De flesta licensierade casinon erbjuder verktyg som hjälper dig att hålla kontrollen över ditt spelande:
                </p>
                <div className="space-y-4">
                  <div className="bg-[hsl(var(--neutral-light))] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Insättningsgränser</h3>
                    <p className="text-gray-700">Sätt gränser för hur mycket du kan sätta in dagligen, veckovis eller månadsvis.</p>
                  </div>
                  <div className="bg-[hsl(var(--neutral-light))] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Förlustgränser</h3>
                    <p className="text-gray-700">Bestäm en maxgräns för hur mycket du kan förlora under en viss period.</p>
                  </div>
                  <div className="bg-[hsl(var(--neutral-light))] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Sessionsgränser</h3>
                    <p className="text-gray-700">Begränsa hur länge du kan spela i en session, med påminnelser om hur länge du har spelat.</p>
                  </div>
                  <div className="bg-[hsl(var(--neutral-light))] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Självtest</h3>
                    <p className="text-gray-700">Många casinon erbjuder självtest där du kan utvärdera dina spelvanor.</p>
                  </div>
                  <div className="bg-[hsl(var(--neutral-light))] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Självavstängning</h3>
                    <p className="text-gray-700">Möjlighet att stänga av dig själv från casinot under en viss period eller permanent.</p>
                  </div>
                  <div className="bg-[hsl(var(--neutral-light))] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Spelpaus</h3>
                    <p className="text-gray-700">I Sverige kan du stänga av dig från alla licensierade spelbolag samtidigt via <a href="https://www.spelpaus.se" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary))] underline">Spelpaus.se</a>.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4">Varningssignaler för problemspelande</h2>
                <p className="text-gray-700 mb-4">
                  Det är viktigt att känna igen tecken på att spelandet kan ha blivit ett problem:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Du spelar för mer pengar än du har råd med</li>
                  <li>Du lånar pengar eller säljer ägodelar för att kunna spela</li>
                  <li>Spelandet påverkar dina relationer, arbete eller studier negativt</li>
                  <li>Du jagar förluster och ökar insatserna för att vinna tillbaka</li>
                  <li>Du tänker på spelande hela tiden och känner abstinens när du inte spelar</li>
                  <li>Du ljuger om eller döljer ditt spelande för andra</li>
                  <li>Du fortsätter spela trots negativa konsekvenser</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4">Få hjälp</h2>
                <p className="text-gray-700 mb-4">
                  Om du eller någon du känner har problem med spelande, finns det hjälp att få:
                </p>
                <div className="space-y-4">
                  <div className="border border-[hsl(var(--border))] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Stödlinjen</h3>
                    <p className="text-gray-700 mb-2">Gratis stöd och rådgivning för spelare och anhöriga.</p>
                    <p className="text-gray-700">Telefon: <a href="tel:020819100" className="text-[hsl(var(--primary))]">020-81 91 00</a></p>
                    <p className="text-gray-700">Webb: <a href="https://www.stodlinjen.se" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary))]">www.stodlinjen.se</a></p>
                  </div>
                  <div className="border border-[hsl(var(--border))] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Gamblers Anonymous</h3>
                    <p className="text-gray-700 mb-2">Självhjälpsgrupper för personer med spelproblem.</p>
                    <p className="text-gray-700">Webb: <a href="https://www.gamblersanonymous.se" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary))]">www.gamblersanonymous.se</a></p>
                  </div>
                  <div className="border border-[hsl(var(--border))] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Spelpaus</h3>
                    <p className="text-gray-700 mb-2">Stäng av dig från alla licensierade spelbolag i Sverige.</p>
                    <p className="text-gray-700">Webb: <a href="https://www.spelpaus.se" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary))]">www.spelpaus.se</a></p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg mb-4">Har du frågor om ansvarsfullt spelande? Kontakta oss!</p>
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