"use client";

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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
            <span className="text-gray-600">Villkor</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-[hsl(var(--primary))] mb-8">Användarvillkor och Integritetspolicy</h1>
            <p className="text-lg text-center text-gray-700 mb-12">
              Här hittar du information om våra användarvillkor och hur vi hanterar dina personuppgifter.
            </p>

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4">Användarvillkor</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">1. Allmänt</h3>
                    <p className="text-gray-700">
                      Genom att använda Slotskolan.se godkänner du dessa användarvillkor. Vi förbehåller oss rätten att när som helst ändra villkoren. Fortsatt användning av webbplatsen efter sådana ändringar innebär att du accepterar de nya villkoren.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">2. Åldersgräns</h3>
                    <p className="text-gray-700">
                      Slotskolan.se är endast avsedd för personer över 18 år. Genom att använda vår webbplats bekräftar du att du är minst 18 år gammal.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">3. Innehåll och information</h3>
                    <p className="text-gray-700">
                      Vi strävar efter att tillhandahålla korrekt och uppdaterad information, men vi kan inte garantera att all information på webbplatsen är fullständig, korrekt eller aktuell. All information på Slotskolan.se är endast för informations- och underhållningssyfte.
                    </p>
                    <p className="text-gray-700 mt-2">
                      Vi rekommenderar att du alltid läser de fullständiga villkoren hos respektive casino innan du registrerar dig eller gör en insättning.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">4. Länkar till tredje parts webbplatser</h3>
                    <p className="text-gray-700">
                      Vår webbplats innehåller länkar till externa webbplatser som drivs av tredje part. Vi har ingen kontroll över innehållet på dessa webbplatser och tar inget ansvar för deras innehåll eller integritetspolicy.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">5. Affiliate-länkar</h3>
                    <p className="text-gray-700">
                      Slotskolan.se innehåller affiliate-länkar. Detta innebär att vi kan få provision när du klickar på en länk till ett casino och registrerar dig eller gör en insättning. Detta påverkar inte våra recensioner eller rekommendationer, som alltid är baserade på objektiva kriterier.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">6. Ansvarsfriskrivning</h3>
                    <p className="text-gray-700">
                      Slotskolan.se tar inget ansvar för eventuella förluster eller skador som kan uppstå till följd av användning av information på vår webbplats. Spelande innebär risk för ekonomisk förlust, och vi uppmanar alla att spela ansvarsfullt.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">7. Upphovsrätt</h3>
                    <p className="text-gray-700">
                      Allt innehåll på Slotskolan.se, inklusive text, bilder, grafik, logotyper och design, är skyddat av upphovsrätt och andra immateriella rättigheter. Du får inte kopiera, reproducera, publicera eller distribuera något innehåll från vår webbplats utan vårt skriftliga tillstånd.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4">Integritetspolicy</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">1. Insamling av information</h3>
                    <p className="text-gray-700">
                      Vi samlar in information när du frivilligt skickar den till oss, till exempel när du kontaktar oss via e-post eller använder vårt kontaktformulär. Denna information kan inkludera ditt namn och din e-postadress.
                    </p>
                    <p className="text-gray-700 mt-2">
                      Vi samlar också automatiskt in viss information när du besöker vår webbplats, inklusive din IP-adress, webbläsartyp, operativsystem och de sidor du besöker.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">2. Cookies</h3>
                    <p className="text-gray-700">
                      Slotskolan.se använder cookies för att förbättra din upplevelse på vår webbplats. Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De hjälper oss att förstå hur du använder vår webbplats och gör det möjligt för oss att förbättra funktionaliteten.
                    </p>
                    <p className="text-gray-700 mt-2">
                      Du kan ställa in din webbläsare att avvisa cookies eller meddela dig när cookies skickas. Om du väljer att avvisa cookies kan vissa delar av vår webbplats kanske inte fungera korrekt.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">3. Användning av information</h3>
                    <p className="text-gray-700">
                      Vi använder den information vi samlar in för att:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                      <li>Förbättra vår webbplats och användarupplevelse</li>
                      <li>Svara på dina frågor och förfrågningar</li>
                      <li>Skicka information som du har begärt</li>
                      <li>Analysera användningsmönster för att förbättra vår webbplats</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">4. Delning av information</h3>
                    <p className="text-gray-700">
                      Vi säljer, handlar eller överför inte din personligt identifierbara information till utomstående parter. Detta inkluderar inte betrodda tredje parter som hjälper oss att driva vår webbplats eller utföra våra tjänster, så länge dessa parter går med på att hålla denna information konfidentiell.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">5. Säkerhet</h3>
                    <p className="text-gray-700">
                      Vi implementerar en rad säkerhetsåtgärder för att skydda din personliga information. Vi använder branschstandard-tekniker för att skydda information som överförs till oss och lagras på våra system.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">6. Dina rättigheter</h3>
                    <p className="text-gray-700">
                      Du har rätt att begära information om vilka personuppgifter vi har om dig och hur de används. Du har också rätt att begära rättelse eller radering av dina personuppgifter under vissa omständigheter.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">7. Ändringar i integritetspolicyn</h3>
                    <p className="text-gray-700">
                      Vi kan uppdatera vår integritetspolicy från tid till annan. Vi kommer att meddela eventuella ändringar genom att publicera den nya integritetspolicyn på denna sida.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg mb-4">Har du frågor om våra villkor eller integritetspolicy? Kontakta oss!</p>
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