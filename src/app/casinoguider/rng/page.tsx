import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Förklaring av RNG (Random Number Generator) | Slotskolan',
  description: 'Lär dig hur RNG fungerar i casinospel, varför det är viktigt för rättvisa spel, och hur det säkerställer slumpmässiga resultat.',
};

export default function RNGGuide() {
  return (
    <article className="max-w-4xl mx-auto">
      <div className="relative h-64 sm:h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1605870445919-838d190e8e1b?q=80&w=2340&auto=format&fit=crop"
          alt="Random Number Generator (RNG) förklaring" 
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20">
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Förklaring av RNG (Random Number Generator)
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-3xl">
              Så fungerar slumpgeneratorn i casinospel och varför den är viktig för rättvisa spel
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 prose prose-pink max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vad är RNG?</h2>
          <p>
            RNG (Random Number Generator) är en avancerad algoritm som används i alla 
            onlinecasinospel för att generera slumpmässiga resultat. Detta system 
            säkerställer att varje snurr på en slot eller kortdragning i ett kortspel 
            är helt slumpmässig och oberoende av tidigare resultat.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Hur fungerar RNG i praktiken?</h2>
          <div className="space-y-4">
            <p>
              RNG-systemet genererar konstant miljontals nummer varje sekund, även när 
              ingen spelar. När en spelare trycker på snurr-knappen eller drar ett kort, 
              används det nummer som genererades just i det ögonblicket för att bestämma 
              resultatet.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>I slots:</strong> Numren översätts till specifika symboler på hjulen
              </li>
              <li>
                <strong>I kortspel:</strong> Numren bestämmer vilka kort som delas ut
              </li>
              <li>
                <strong>I roulette:</strong> Numret avgör var kulan landar
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Säkerhet och certifiering</h2>
          <div className="space-y-4">
            <p>
              Alla seriösa onlinecasinon använder certifierade RNG-system som regelbundet 
              testas av oberoende testlaboratorier som:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>eCOGRA</li>
              <li>iTech Labs</li>
              <li>GLI (Gaming Laboratories International)</li>
            </ul>
            <p>
              Dessa tester säkerställer att:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Resultaten är helt slumpmässiga</li>
              <li>Systemet inte kan manipuleras</li>
              <li>Spelen följer angiven återbetalningsprocent (RTP)</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vanliga missuppfattningar om RNG</h2>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Myt: "Spelet är överhettat"</h3>
              <p className="text-red-600">
                Det finns ingen sådan sak som ett "överhettat" spel. Varje snurr är helt 
                oberoende av tidigare resultat.
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Myt: "Det är dags för en vinst"</h3>
              <p className="text-red-600">
                RNG har inget minne av tidigare resultat. Sannolikheten är densamma för 
                varje ny snurr.
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Myt: "Casinot kan justera vinsterna"</h3>
              <p className="text-red-600">
                Certifierade RNG-system kan inte manipuleras. Återbetalningsprocenten är 
                fast och kontrolleras regelbundet.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">RNG och rättvist spel</h2>
          <p>
            RNG är grundstenen i rättvist onlinespel. Det säkerställer att:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Alla spelare har samma vinstchanser</li>
            <li>Resultaten inte kan förutsägas</li>
            <li>Spelen följer angivna odds och återbetalningsprocent</li>
          </ul>
        </section>

        <div className="bg-gray-100 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Sammanfattning</h2>
          <p className="text-gray-700">
            RNG är en fundamental del av alla onlinecasinospel som garanterar rättvisa 
            och slumpmässiga resultat. Kom ihåg att varje spel är oberoende av tidigare 
            resultat och att det inte finns några sätt att förutsäga eller påverka utfallet.
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