"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CasinoUtanSpelpaus() {
  return (
    <>
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Casino Utan Spelpaus - Guide till Utländska Casinon
            </h1>
            
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[hsl(var(--primary))]">
                Vad är Casino Utan Spelpaus?
              </h2>
              
              <p className="text-gray-700 mb-4">
                Casino utan Spelpaus är spelbolag som inte omfattas av den svenska spellicensen och därmed inte är anslutna till det nationella självavstängningsregistret Spelpaus.se. Dessa casinon drivs med licenser från andra jurisdiktioner som Malta, Curaçao eller Gibraltar.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Viktigt:</strong> Vi på Slotskolan främjar ansvarsfullt spelande och rekommenderar i första hand svenska licensierade casinon. Denna information är endast för utbildningssyfte.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <Link 
                  href="/bonusar" 
                  className="inline-block px-6 py-3 bg-pink-600 text-white rounded-md font-medium hover:bg-pink-700 transition-colors"
                >
                  Se våra rekommenderade bonusar
                </Link>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Fördelar och nackdelar med casino utan Spelpaus
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Fördelar</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Tillgängligt för spelare som stängt av sig via Spelpaus</li>
                    <li>Ofta generösare bonusar utan svenska begränsningar</li>
                    <li>Fler betalningsmetoder tillgängliga</li>
                    <li>Ingen begränsning för autoplay eller snabba spel</li>
                    <li>Ofta högre insättningsgränser</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Nackdelar</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Mindre konsumentskydd än på svenska casinon</li>
                    <li>Skattskyldighet på vinster (utanför EU/EES)</li>
                    <li>Kan vara svårare att få hjälp vid problem</li>
                    <li>Färre verktyg för ansvarsfullt spelande</li>
                    <li>Kan ha sämre kundtjänst på svenska</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[hsl(var(--primary))]">
                Hur fungerar Spelpaus?
              </h2>
              
              <p className="text-gray-700 mb-4">
                Spelpaus.se är ett nationellt självavstängningsregister som drivs av Spelinspektionen. Genom att registrera dig på Spelpaus stänger du av dig från alla licensierade spelbolag i Sverige under den tidsperiod du väljer (1, 3, 6 månader eller tills vidare).
              </p>
              
              <p className="text-gray-700 mb-4">
                Alla spelbolag med svensk licens är skyldiga att kontrollera mot Spelpaus-registret innan en spelare tillåts spela. Detta är en viktig del av det svenska konsumentskyddet för spelare.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Om du behöver hjälp med spelproblem, besök vår sida om <Link href="/ansvarsfullt-spelande" className="underline">ansvarsfullt spelande</Link> för mer information och resurser.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[hsl(var(--primary))]">
                Vanliga frågor om Casino Utan Spelpaus
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Är det lagligt att spela på casino utan Spelpaus?</h3>
                  <p className="text-gray-700">
                    Ja, det är lagligt för svenska spelare att spela på utländska casinon. Det är dock olagligt för dessa casinon att rikta sin marknadsföring specifikt mot svenska spelare utan svensk licens.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Måste jag betala skatt på vinster från utländska casinon?</h3>
                  <p className="text-gray-700">
                    Det beror på var casinot har sin licens. Vinster från casinon inom EU/EES är skattefria för svenska spelare. Vinster från casinon utanför EU/EES är skattepliktiga och ska deklareras.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Är casino utan Spelpaus säkra?</h3>
                  <p className="text-gray-700">
                    Säkerheten varierar. Casinon med licenser från respekterade jurisdiktioner som Malta (MGA) har ofta bra säkerhetsstandarder. Det är dock viktigt att göra research innan du registrerar dig på ett utländskt casino.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Vilka betalningsmetoder kan jag använda?</h3>
                  <p className="text-gray-700">
                    Utländska casinon erbjuder ofta fler betalningsmetoder än svenska, inklusive e-plånböcker, kryptovalutor och banköverföringar. Observera att Trustly och BankID ofta inte är tillgängliga på dessa casinon.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-[hsl(var(--soft-pink))] rounded-lg p-6 md:p-8 text-center">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Ansvarsfullt spelande</h2>
              <p className="text-gray-700 mb-4">
                Om du har frågor om ansvarsfullt spelande eller behöver hjälp med spelproblem, besök vår sida om ansvarsfullt spelande.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/ansvarsfullt-spelande" 
                  className="inline-block px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-md font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors"
                >
                  Ansvarsfullt spelande
                </Link>
                <Link 
                  href="/bonusar" 
                  className="inline-block px-6 py-3 bg-pink-600 text-white rounded-md font-medium hover:bg-pink-700 transition-colors"
                >
                  Se alla bonusar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 