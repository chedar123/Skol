"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Casino } from '@/lib/data/casino-data';

interface CasinoInfoProps {
  casino: Casino;
  fullReview?: boolean;
  favorite?: boolean;
  isLoading?: boolean;
  onOpenModal?: () => void;
}

export default function CasinoInfo({
  casino,
  fullReview = false,
  favorite = false,
  isLoading = false,
  onOpenModal
}: CasinoInfoProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Casino logo och favorit-knapp */}
      <div className="relative w-full md:w-56 h-56 flex-shrink-0">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
        ) : (
          <>
            <div className="relative w-full h-full overflow-hidden rounded-xl border border-gray-100 bg-white p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
              {casino.logo ? (
                <Image
                  src={casino.logo}
                  alt={`${casino.name} logotyp`}
                  width={180}
                  height={180}
                  className="object-contain max-h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                  Ingen logotyp
                </div>
              )}
            </div>
            
            {/* Favorit-knapp */}
            {onOpenModal && (
              <button
                onClick={onOpenModal}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md border border-gray-100 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
                aria-label={favorite ? "Ta bort från favoriter" : "Lägg till i favoriter"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={favorite ? "currentColor" : "none"}
                  stroke={favorite ? "none" : "currentColor"}
                  className={`w-5 h-5 ${favorite ? 'text-amber-400' : 'text-gray-400'}`}
                  strokeWidth={favorite ? 0 : 1.5}
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
      
      {/* Casino information */}
      <div className="flex-1">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6" />
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{casino.name}</h2>
            
            {/* Licensinformation */}
            <div className="inline-flex items-center px-3 py-1 bg-green-50 border border-green-100 rounded-full text-sm text-green-700 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{casino.hasSwedishLicense ? "Svensk licens" : "Utländsk licens"}</span>
            </div>
            
            {/* Kort beskrivning */}
            <p className="text-gray-600 mb-5 text-base leading-relaxed">
              {casino.description || "Ingen beskrivning tillgänglig."}
            </p>
            
            {/* Bonusinformation */}
            {casino.bonus && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-5 shadow-sm">
                <h3 className="text-sm font-medium text-blue-800 mb-1 uppercase tracking-wide">Välkomstbonus</h3>
                <p className="text-blue-700 font-bold text-lg">{casino.bonus}</p>
              </div>
            )}
            
            {/* CTA och recensionsknapp */}
            <div className="flex flex-wrap gap-4 mt-6">
              <a 
                href={casino.affiliateLink || casino.ctaLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-pink-600 text-white rounded-full font-medium hover:bg-pink-700 transition-colors shadow-sm hover:shadow-md"
              >
                Besök Casino
              </a>
              
              {!fullReview && casino.reviewLink && (
                <Link 
                  href={casino.reviewLink}
                  className="inline-flex items-center px-6 py-3 border border-pink-600 text-pink-600 rounded-full font-medium hover:bg-pink-50 hover:text-pink-700 hover:border-pink-700 transition-colors"
                >
                  Läs fullständig recension
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 