"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

declare global {
  interface Window {
    Twitch?: {
      Embed: new (elementId: string, options: any) => {
        addEventListener: (event: string, callback: () => void) => void;
        getPlayer: () => any;
      };
    };
  }
}

export default function StreamPage() {
  const twitchEmbedRef = useRef<HTMLDivElement>(null);
  const twitchEmbedLoaded = useRef(false);

  useEffect(() => {
    // Initialize Twitch embed when the script is loaded
    if (window.Twitch && twitchEmbedRef.current && !twitchEmbedLoaded.current) {
      twitchEmbedLoaded.current = true;
      
      const embed = new window.Twitch.Embed("twitch-embed", {
        width: "100%",
        height: "100%",
        channel: "slotskolan",
        layout: "video-with-chat",
        autoplay: true,
        muted: false,
        theme: "dark",
        // Parent domains that will embed this stream
        parent: ["localhost", "slotskolan.se"]
      });

      embed.addEventListener('VIDEO_READY', () => {
        console.log('The video is ready');
      });
    }
  }, []);

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
            <span className="text-gray-600">Stream</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-[hsl(var(--primary))] mb-8">Slotskolan Live Stream</h1>
            
            <div className="mb-8">
              <p className="text-lg text-center text-gray-700 mb-6">
                Välkommen till vår livestream! Här kan du se när vi spelar slots, diskuterar strategier och delar med oss av de senaste nyheterna inom casinovärlden.
              </p>
              <p className="text-center text-gray-700">
                Följ oss på Twitch för att få notifieringar när vi går live!
              </p>
            </div>
            
            {/* Twitch Embed Container */}
            <div className="w-full aspect-[16/9] md:aspect-auto md:h-[600px] bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-8">
              <div id="twitch-embed" ref={twitchEmbedRef} className="w-full h-full"></div>
            </div>
            
            {/* Stream Schedule */}
            <div className="bg-[hsl(var(--neutral-light))] rounded-lg p-6 shadow-sm mt-8">
              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">Stream Schema</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">Måndag - Torsdag</h3>
                  <p className="text-gray-700">18:00 - 21:00 CET</p>
                  <p className="text-gray-600 mt-1">Bonus Hunt Sessions</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">Lördag</h3>
                  <p className="text-gray-700">19:00 - 23:00 CET</p>
                  <p className="text-gray-600 mt-1">High Roller Session</p>
                </div>
              </div>
              <p className="text-gray-600 mt-4 text-center">
                Schemat kan ändras. Följ oss på sociala medier för uppdateringar!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Twitch Embed Script */}
      <Script 
        src="https://embed.twitch.tv/embed/v1.js"
        strategy="afterInteractive"
      />
    </>
  );
} 