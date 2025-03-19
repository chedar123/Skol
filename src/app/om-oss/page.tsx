"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OmOss() {
  return (
    <>
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold text-[hsl(var(--primary))] mb-6 md:mb-8 text-center">
              Om Slotskolan
            </h1>
            
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Vår historia</h2>
              <p className="text-gray-700 mb-4">
                Slotskolan grundades 2022 av en grupp passionerade casinospelare med målet att skapa en pålitlig guide för svenska spelare. 
                Vi insåg att det fanns ett behov av ärlig och transparent information om casinobonusar och slots i en bransch som ofta kan vara förvirrande.
              </p>
              <p className="text-gray-700 mb-4">
                Sedan starten har vi vuxit till att bli en av Sveriges mest respekterade casinoguider, med fokus på att hjälpa spelare att hitta de bästa bonusarna och de mest underhållande spelen.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Vårt uppdrag</h2>
              <p className="text-gray-700 mb-4">
                På Slotskolan är vårt uppdrag att:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Erbjuda ärliga och transparenta recensioner av casinon och slots</li>
                <li>Hjälpa spelare att hitta de bästa bonusarna med rättvisa villkor</li>
                <li>Utbilda spelare om ansvarsfullt spelande</li>
                <li>Skapa en gemenskap för casinoentusiaster</li>
                <li>Hålla dig uppdaterad om de senaste trenderna och nyheterna i branschen</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Vårt team</h2>
              <p className="text-gray-700 mb-4">
                Bakom Slotskolan står ett dedikerat team av casinoexperter med många års erfarenhet i branschen. Vårt team består av:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Erik Johansson</h3>
                  <p className="text-[hsl(var(--primary))] font-medium">Grundare & Casinoexpert</p>
                  <p className="text-gray-600 text-center mt-2">
                    Erik har över 10 års erfarenhet av casinobranschen och är passionerad om att hitta de bästa bonusarna.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Anna Lindberg</h3>
                  <p className="text-[hsl(var(--primary))] font-medium">Slotexpert & Innehållsansvarig</p>
                  <p className="text-gray-600 text-center mt-2">
                    Anna är vår slotexpert som testar och recenserar de senaste spelautomaterna för att hitta de mest underhållande spelen.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Ansvarsfullt spelande</h2>
              <p className="text-gray-700 mb-4">
                På Slotskolan tar vi ansvarsfullt spelande på största allvar. Vi tror att gambling ska vara underhållande och aldrig ett sätt att tjäna pengar eller lösa ekonomiska problem.
              </p>
              <p className="text-gray-700 mb-4">
                Vi uppmuntrar alla våra besökare att spela ansvarsfullt och endast satsa pengar de har råd att förlora. Om du känner att ditt spelande börjar bli problematiskt, tveka inte att söka hjälp.
              </p>
              <div className="mt-4">
                <Link 
                  href="/ansvarsfullt-spelande" 
                  className="inline-block px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-md font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors"
                >
                  Läs mer om ansvarsfullt spelande
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-700 mb-4">
                Har du frågor eller funderingar? Vi finns här för att hjälpa dig!
              </p>
              <Link 
                href="/kontakt" 
                className="inline-block px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-md font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors"
              >
                Kontakta oss
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 