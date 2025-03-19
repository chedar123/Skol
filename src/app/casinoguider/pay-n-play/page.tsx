import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Pay N Play Casino - Spela utan registrering | Slotskolan',
  description: 'Allt du behöver veta om Pay N Play casino. Hur det fungerar, fördelar och nackdelar, samt vilka casinon som erbjuder denna snabba spellösning.',
};

export default function PayNPlayGuide() {
  return (
    <article className="max-w-4xl mx-auto">
      <div className="relative h-64 sm:h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=2340&auto=format&fit=crop"
          alt="Pay N Play casino" 
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20">
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Pay N Play Casino
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-3xl">
              Allt om hur du spelar utan registrering - snabbt, enkelt och säkert
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 prose prose-pink max-w-none">
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vad är Pay N Play?</h2>
          <p>
            Pay N Play är en innovativ lösning utvecklad av Trustly som låter dig spela 
            casino utan traditionell registrering. Istället identifierar du dig direkt 
            via din bank när du gör en insättning, vilket gör hela processen snabbare 
            och smidigare.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Hur fungerar det?</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Steg för steg:</h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Välj casino och klicka på "Spela"</strong>
                <p>
                  Du behöver inte fylla i något registreringsformulär eller skapa ett 
                  konto på traditionellt vis.
                </p>
              </li>
              <li>
                <strong>Välj bank och logga in</strong>
                <p>
                  Använd ditt BankID för att identifiera dig och genomföra en insättning.
                </p>
              </li>
              <li>
                <strong>Börja spela direkt</strong>
                <p>
                  Ett tillfälligt spelkonto skapas automatiskt baserat på din 
                  bankidentifiering.
                </p>
              </li>
              <li>
                <strong>Snabba uttag</strong>
                <p>
                  När du vill ta ut vinster går pengarna direkt till ditt bankkonto, 
                  ofta inom minuter.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Fördelar med Pay N Play</h2>
          <div className="bg-green-50 p-6 rounded-lg">
            <ul className="list-disc pl-6 space-y-2 text-green-800">
              <li>
                <strong>Snabbhet:</strong> Börja spela på några sekunder istället för 
                att fylla i långa formulär
              </li>
              <li>
                <strong>Säkerhet:</strong> BankID-verifiering är en av de säkraste 
                metoderna för identifiering
              </li>
              <li>
                <strong>Enkla uttag:</strong> Vinsterna går direkt till ditt bankkonto 
                utan extra verifieringar
              </li>
              <li>
                <strong>Ingen e-post spam:</strong> Du behöver inte ange din e-postadress
              </li>
              <li>
                <strong>Automatisk KYC:</strong> Alla verifieringar sköts via banken
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Begränsningar att känna till</h2>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <ul className="list-disc pl-6 space-y-2 text-yellow-800">
              <li>
                <strong>Bankberoende:</strong> Fungerar endast med banker som stöder 
                Trustly
              </li>
              <li>
                <strong>Geografiska begränsningar:</strong> Främst tillgängligt i 
                nordiska länder
              </li>
              <li>
                <strong>Bonusar:</strong> Vissa casinon erbjuder färre bonusar till 
                Pay N Play-spelare
              </li>
              <li>
                <strong>VIP-program:</strong> Kan vara begränsade för Pay N Play-konton
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Säkerhet och ansvar</h2>
          <div className="space-y-4">
            <p>
              Pay N Play är en mycket säker metod tack vare:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>BankID-verifiering vid varje transaktion</li>
              <li>Automatisk KYC (Know Your Customer)</li>
              <li>Direkt koppling till ditt bankkonto</li>
              <li>Trustlys säkerhetssystem</li>
            </ul>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                <strong>Tips:</strong> Även om Pay N Play gör det enkelt att spela, 
                är det viktigt att sätta gränser för ditt spelande och aldrig spela 
                för mer än du har råd att förlora.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vanliga frågor</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Är mina pengar säkra?</h3>
              <p>
                Ja, alla transaktioner sker via din bank och skyddas av samma säkerhet 
                som vanliga banköverföringar.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Kan jag spela från utlandet?</h3>
              <p>
                Det beror på casinot och landet du befinner dig i. Generellt fungerar 
                det bäst i nordiska länder.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Sparas min spelinformation?</h3>
              <p>
                Ja, din spelhistorik sparas och du kan återkomma till samma casino 
                genom att identifiera dig med BankID igen.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-gray-100 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Sammanfattning</h2>
          <p className="text-gray-700">
            Pay N Play är en modern och smidig lösning för casinospel som passar dig 
            som värdesätter snabbhet och enkelhet. Med BankID-verifiering får du 
            tillgång till säkert spel utan krångliga registreringar, samtidigt som 
            uttag av vinster sker snabbt och smidigt.
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
              <Link href="/casinoguider/gratis-casino" className="text-pink-600 hover:text-pink-700">
                Kan man spela gratis casino?
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
} 