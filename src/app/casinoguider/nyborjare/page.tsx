import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Casinoguide för nybörjare | Slotskolan',
  description: 'En omfattande guide för dig som är ny inom casinospel. Lär dig grunderna, viktiga termer och smarta strategier för att komma igång.',
};

export default function NyborjarGuide() {
  return (
    <article className="max-w-4xl mx-auto">
      <div className="relative h-64 sm:h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=2340&auto=format&fit=crop"
          alt="Casino för nybörjare" 
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20">
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Casinoguide för nybörjare
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-3xl">
              Allt du behöver veta om att spela på online casino för första gången
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 prose prose-pink max-w-none">
        <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Introduktion till online casinon</h2>
        <p>
          Välkommen till världen av online casinospel! Oavsett om du är helt ny på området eller bara vill fördjupa dina kunskaper, 
          kommer denna guide att hjälpa dig att förstå grunderna, undvika vanliga misstag och maximera din spelupplevelse.
        </p>
        
        <p>
          Online casinon erbjuder samma spänning som traditionella landbaserade casinon, men med fördelen att du kan spela var 
          och när som helst. Från klassiska bordsspel som blackjack och roulette till tusentals spelautomater (slots) – allt 
          finns tillgängligt med bara några klick.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Grundläggande begrepp du behöver känna till</h2>
        
        <h3 className="text-lg font-medium mt-6 mb-3">RTP (Return to Player)</h3>
        <p>
          RTP är ett procenttal som anger hur mycket av insatserna ett spel i genomsnitt betalar tillbaka till spelarna över tid. 
          Till exempel betyder en RTP på 96% att för varje 100 kr som spelas, återbetalas i genomsnitt 96 kr till spelarna. 
          Ju högre RTP, desto bättre är oddsen teoretiskt sett för spelaren.
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Volatilitet</h3>
        <p>
          Volatilitet (även kallad varians) beskriver hur ett spels vinstmönster ser ut. Låg volatilitet innebär frekventa 
          men mindre vinster, medan hög volatilitet betyder mer sällsynta men potentiellt större vinster. Din spelstil och 
          riskaptit bör avgöra vilken volatilitet du föredrar.
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Bonusar</h3>
        <p>
          Online casinon erbjuder olika typer av bonusar för att locka och behålla spelare. Vanliga bonustyper inkluderar:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li><strong>Välkomstbonus</strong> – En bonus som ges till nya spelare, ofta en matchning av den första insättningen.</li>
          <li><strong>Free spins</strong> – Gratissnurr på specifika spelautomater.</li>
          <li><strong>No deposit bonus</strong> – En bonus som ges utan krav på insättning.</li>
          <li><strong>Cashback</strong> – En återbetalning av en del av dina förluster under en viss period.</li>
        </ul>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Omsättningskrav</h3>
        <p>
          Detta är ett villkor som anger hur många gånger du måste spela för ett bonusbelopp innan du kan ta ut eventuella 
          vinster. Till exempel, med ett omsättningskrav på 35x på en bonus på 100 kr, måste du spela för 3 500 kr innan du 
          kan göra ett uttag. <Link href="/casinoguider/omsattningskrav" className="text-pink-600 hover:text-pink-700">Läs mer om omsättningskrav</Link>.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Kom igång i 5 enkla steg</h2>
        
        <ol className="list-decimal pl-6 mt-2 mb-6">
          <li className="mb-2">
            <strong>Välj ett pålitligt casino</strong> – Leta efter casinon med goda recensioner, legitima licenser (som från Malta Gaming Authority eller UK Gambling Commission), och transparenta villkor.
          </li>
          <li className="mb-2">
            <strong>Skapa ett konto</strong> – Registreringsprocessen är vanligtvis enkel och kräver grundläggande personuppgifter. Vissa casinon erbjuder också <Link href="/casinoguider/pay-n-play" className="text-pink-600 hover:text-pink-700">Pay N Play</Link>, där du kan spela utan traditionell registrering.
          </li>
          <li className="mb-2">
            <strong>Sätt en budget</strong> – Bestäm hur mycket du är villig att spendera och håll dig till det. Ansvarsfullt spelande är nyckeln till en positiv upplevelse.
          </li>
          <li className="mb-2">
            <strong>Välj rätt spel</strong> – Börja med spel som har enkla regler och låg volatilitet om du är nybörjare. Prova <Link href="/casinoguider/gratis-casino" className="text-pink-600 hover:text-pink-700">demoversionerna av spel</Link> för att lära dig utan risk.
          </li>
          <li className="mb-2">
            <strong>Spela ansvarsfullt</strong> – Se casinospel som underhållning, inte som ett sätt att tjäna pengar. Ta regelbundna pauser och sluta när det inte längre är roligt.
          </li>
        </ol>

        <div className="bg-pink-50 p-4 sm:p-6 rounded-lg my-8 border border-pink-100">
          <h3 className="text-lg font-medium text-pink-800 mb-3">Vanliga nybörjarmisstag att undvika</h3>
          <ul className="list-disc pl-6 text-pink-700">
            <li><strong>Jaga förluster</strong> – Att försöka vinna tillbaka pengar du förlorat leder ofta till ännu större förluster.</li>
            <li><strong>Ignorera spelregler</strong> – Ta tid att förstå grunderna i spelet du väljer.</li>
            <li><strong>Missa bonusvillkor</strong> – Läs alltid villkoren för bonusar, särskilt omsättningskraven.</li>
            <li><strong>Spela för mycket</strong> – Sätt tidsgränser och håll dig till dem.</li>
            <li><strong>Spela under påverkan</strong> – Undvik att spela när du är trött, stressad eller har druckit alkohol.</li>
          </ul>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Vidare läsning</h2>
        <p>
          Nu när du har grunderna på plats, kanske du vill fördjupa dig i specifika områden:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-6">
          <li>
            <Link href="/casinoguider/rng" className="text-pink-600 hover:text-pink-700">
              Förklaring av RNG (Random Number Generator)
            </Link> – Förstå hur slumpmässigheten i spelen säkerställs
          </li>
          <li>
            <Link href="/casinoguider/omsattningskrav" className="text-pink-600 hover:text-pink-700">
              Förstå omsättningskrav
            </Link> – En djupare titt på hur du navigerar bonusvillkor
          </li>
          <li>
            <Link href="/casinoguider/gratis-casino" className="text-pink-600 hover:text-pink-700">
              Spela gratis
            </Link> – Alternativ för att spela utan att riskera egna pengar
          </li>
        </ul>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-sm text-gray-600 italic">
            Kom ihåg att casinospel ska vara en rolig form av underhållning. Om du känner att ditt spelande börjar bli 
            problematiskt, finns det hjälp att få från organisationer som Stödlinjen (020-81 91 00) eller Spelpaus.se.
          </p>
        </div>
      </div>
    </article>
  );
} 