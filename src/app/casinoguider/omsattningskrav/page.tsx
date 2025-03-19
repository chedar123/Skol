import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Förstå omsättningskrav på casino | Slotskolan',
  description: 'En detaljerad guide om hur omsättningskrav fungerar på online casino, hur du beräknar dem och vad du behöver tänka på.',
};

export default function OmsattningskravGuide() {
  return (
    <article className="max-w-4xl mx-auto">
      <div className="relative h-64 sm:h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1611059263703-346d4451c519?q=80&w=2340&auto=format&fit=crop"
          alt="Omsättningskrav på casino" 
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20">
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Förstå omsättningskrav på casino
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-3xl">
              Allt du behöver veta om hur omsättningskrav fungerar och hur du beräknar dem
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 prose prose-pink max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vad är omsättningskrav?</h2>
          <p>
            Omsättningskrav är villkor som bestämmer hur många gånger du måste spela 
            för din bonus innan du kan ta ut eventuella vinster. Detta är ett vanligt 
            krav från casinon för att förhindra missbruk av bonusar och säkerställa 
            att spelarna faktiskt använder bonusen för att spela.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Hur beräknar man omsättningskrav?</h2>
          <div className="space-y-4">
            <p>
              Omsättningskravet anges oftast som en multipel, till exempel "30x". Här är 
              ett exempel:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Exempel:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Du får en bonus på 1000 kr</li>
                <li>Omsättningskravet är 30x</li>
                <li>1000 kr × 30 = 30 000 kr</li>
                <li>Du måste alltså spela för totalt 30 000 kr innan du kan ta ut vinster</li>
              </ul>
            </div>
            <p>
              Observera att vissa casinon även inkluderar insättningen i omsättningskravet:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Exempel med insättning:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Du sätter in 1000 kr och får 1000 kr i bonus</li>
                <li>Omsättningskravet är 30x på både insättning och bonus</li>
                <li>(1000 kr + 1000 kr) × 30 = 60 000 kr</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Viktiga faktorer att tänka på</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">1. Tidsbegränsning</h3>
            <p>
              De flesta bonusar har en tidsgräns för när omsättningskravet måste uppfyllas, 
              ofta 30 dagar. Kontrollera alltid denna information i bonusvillkoren.
            </p>

            <h3 className="text-xl font-semibold">2. Spelbidrag</h3>
            <p>
              Olika spel bidrar olika mycket till omsättningskravet:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Slots: Oftast 100%</li>
              <li>Bordsspel: Vanligtvis 10-50%</li>
              <li>Live Casino: Kan vara så lågt som 5-10%</li>
              <li>Vissa spel kan vara helt uteslutna</li>
            </ul>

            <h3 className="text-xl font-semibold">3. Maxinsats</h3>
            <p>
              Det finns ofta en gräns för hur stor insats du får göra medan du omsätter 
              en bonus. Överskrider du denna kan bonusen annulleras.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vanliga fällor att undvika</h2>
          <div className="bg-yellow-50 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold text-yellow-800">Varning!</h3>
            <ul className="list-disc pl-6 space-y-2 text-yellow-800">
              <li>
                <strong>Läs alltid villkoren:</strong> Omsättningskrav kan variera kraftigt 
                mellan olika casinon och bonusar.
              </li>
              <li>
                <strong>Kolla tidsgränsen:</strong> Missa inte deadline för omsättningskravet.
              </li>
              <li>
                <strong>Kontrollera spelbidrag:</strong> Spela inte spel som bidrar lite 
                eller inget till omsättningskravet.
              </li>
              <li>
                <strong>Håll koll på maxinsatser:</strong> Överskrid aldrig den maximala 
                insatsen under omsättning.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tips för att klara omsättningskrav</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Välj slots med hög RTP (Return To Player) för bästa möjliga chans att 
              behålla ditt saldo medan du omsätter.
            </li>
            <li>
              Spela med mindre insatser för att minska risken för stora förluster.
            </li>
            <li>
              Håll koll på hur mycket du har omsatt genom att regelbundet kontrollera 
              din bonusstatus.
            </li>
            <li>
              Överväg att tacka nej till bonusar med orimligt höga omsättningskrav.
            </li>
          </ul>
        </section>

        <div className="bg-gray-100 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Sammanfattning</h2>
          <p className="text-gray-700">
            Omsättningskrav är en viktig del av casinobonusar som du måste förstå för 
            att kunna använda bonusar på ett smart sätt. Genom att noga läsa villkoren 
            och planera ditt spelande kan du öka dina chanser att uppfylla kraven och 
            eventuellt ta ut vinster.
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
              <Link href="/casinoguider/rng" className="text-pink-600 hover:text-pink-700">
                Hur fungerar RNG?
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
} 