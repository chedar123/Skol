import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Kan man spela gratis casino? | Slotskolan',
  description: 'Lär dig allt om gratis casino, demo-spel, free spins och no deposit bonusar. Vi guidar dig genom alla sätt att spela casino utan att riskera egna pengar.',
};

export default function GratisCasinoGuide() {
  return (
    <article className="max-w-4xl mx-auto">
      <div className="relative h-64 sm:h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1563341591-ad0a750911cf?q=80&w=2329&auto=format&fit=crop"
          alt="Gratis casino spel" 
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20">
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Kan man spela gratis casino?
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-3xl">
              Utforska olika sätt att spela casino utan att riskera egna pengar
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 prose prose-pink max-w-none">
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Olika sätt att spela gratis</h2>
          <p>
            Det finns flera sätt att spela casino utan att riskera egna pengar. Här går 
            vi igenom de vanligaste alternativen och vad du behöver veta om varje metod.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Demo-versioner av spel</h2>
          <div className="space-y-4">
            <p>
              De flesta slots och bordsspel finns tillgängliga i demo-version där du kan 
              spela med låtsaspengar.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Fördelar:</h3>
              <ul className="list-disc pl-6 space-y-2 text-green-700">
                <li>Helt gratis att spela</li>
                <li>Ingen registrering krävs</li>
                <li>Perfekt för att lära känna nya spel</li>
                <li>Obegränsat med spelpengar</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Nackdelar:</h3>
              <ul className="list-disc pl-6 space-y-2 text-red-700">
                <li>Kan inte vinna riktiga pengar</li>
                <li>Vissa funktioner kan vara begränsade</li>
                <li>Inte tillgängligt för live casino-spel</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Free Spins utan insättning</h2>
          <div className="space-y-4">
            <p>
              Många casinon erbjuder gratis snurr utan krav på insättning till nya spelare.
            </p>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Fördelar:</h3>
              <ul className="list-disc pl-6 space-y-2 text-green-700">
                <li>Chans att vinna riktiga pengar</li>
                <li>Ingen risk för egna pengar</li>
                <li>Bra sätt att testa ett nytt casino</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Att tänka på:</h3>
              <ul className="list-disc pl-6 space-y-2 text-yellow-700">
                <li>Kräver oftast registrering</li>
                <li>Kan ha omsättningskrav på vinster</li>
                <li>Begränsat antal snurr</li>
                <li>Maxgräns för uttag av vinster</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. No Deposit Bonus</h2>
          <div className="space-y-4">
            <p>
              En bonus som ger dig riktiga pengar att spela för utan krav på insättning.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <p className="text-blue-800">
                Vanliga villkor för no deposit bonusar:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-blue-700">
                <li>Verifiering av identitet krävs</li>
                <li>Höga omsättningskrav (ofta 40-60x)</li>
                <li>Tidsbegränsning för användning</li>
                <li>Begränsade spel att välja mellan</li>
                <li>Maxgräns för uttag</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Gratis turneringar</h2>
          <div className="space-y-4">
            <p>
              Vissa casinon erbjuder freeroll-turneringar där du kan tävla om priser 
              utan insats.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ofta tillgängliga för alla registrerade spelare</li>
              <li>Kan ge både kontantpriser och free spins</li>
              <li>Bra sätt att få extra underhållning</li>
              <li>Socialt element med leaderboards</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tips för gratisspel</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Läs villkoren noga:</strong> Särskilt viktigt för bonusar och 
                free spins.
              </li>
              <li>
                <strong>Använd demo-läget först:</strong> Lär känna spelen innan du 
                använder bonusar.
              </li>
              <li>
                <strong>Jämför olika erbjudanden:</strong> Vissa har bättre villkor 
                än andra.
              </li>
              <li>
                <strong>Ha realistiska förväntningar:</strong> Gratis erbjudanden har 
                ofta begränsningar.
              </li>
            </ul>
          </div>
        </section>

        <div className="bg-gray-100 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Sammanfattning</h2>
          <p className="text-gray-700">
            Det finns flera sätt att spela casino gratis, men varje metod har sina 
            för- och nackdelar. Demo-spel är bäst för att lära känna spelen, medan 
            bonusar och free spins ger möjlighet att vinna riktiga pengar - men kom 
            ihåg att läsa villkoren noga.
          </p>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Relaterade guider</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Link href="/casinoguider/nyborjare" className="text-pink-600 hover:text-pink-700">
                Casinoguide för nybörjare
              </Link>
            </li>
            <li>
              <Link href="/casinoguider/omsattningskrav" className="text-pink-600 hover:text-pink-700">
                Förstå omsättningskrav
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
} 