"use client";

import React from 'react';

interface CasinoFeaturesProps {
  pros?: string[];
  cons?: string[];
  paymentMethods?: string[];
  gameProviders?: string[];
  withdrawalTime?: string;
  customerSupport?: string[];
}

export default function CasinoFeatures({
  pros = [],
  cons = [],
  paymentMethods = [],
  gameProviders = [],
  withdrawalTime = 'Inom 24 timmar',
  customerSupport = []
}: CasinoFeaturesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      {/* Fördelar och nackdelar */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
        <h3 className="text-xl font-bold mb-5 text-[hsl(var(--primary))] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Fördelar och nackdelar
        </h3>
        
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute -left-2 top-0 w-1 h-full bg-green-400 rounded-full"></div>
            <h4 className="font-semibold text-green-600 text-lg mb-3 pl-3">
              Fördelar
            </h4>
            <ul className="space-y-3 pl-3">
              {pros.map((pro, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{pro}</span>
                </li>
              ))}
              {pros.length === 0 && (
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500">Information saknas</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="relative">
            <div className="absolute -left-2 top-0 w-1 h-full bg-red-400 rounded-full"></div>
            <h4 className="font-semibold text-red-600 text-lg mb-3 pl-3">
              Nackdelar
            </h4>
            <ul className="space-y-3 pl-3">
              {cons.map((con, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{con}</span>
                </li>
              ))}
              {cons.length === 0 && (
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500">Information saknas</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Betalningsmetoder och spelleverantörer */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <h3 className="text-xl font-bold mb-5 text-[hsl(var(--primary))] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
          Betalningsmetoder och spel
        </h3>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <h4 className="font-semibold text-blue-600 text-lg flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Betalningsmetoder
            </h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method, index) => (
                <span key={index} className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm font-medium border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors">
                  {method}
                </span>
              ))}
              {paymentMethods.length === 0 && (
                <div className="bg-gray-50 text-gray-500 rounded-lg px-4 py-3 text-sm border border-gray-100 w-full">
                  Information saknas
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <h4 className="font-semibold text-purple-600 text-lg flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Spelleverantörer
            </h4>
            <div className="flex flex-wrap gap-2">
              {gameProviders.map((provider, index) => (
                <span key={index} className="inline-flex items-center bg-purple-50 text-purple-700 rounded-full px-3 py-1 text-sm font-medium border border-purple-100 hover:bg-purple-100 hover:border-purple-200 transition-colors">
                  {provider}
                </span>
              ))}
              {gameProviders.length === 0 && (
                <div className="bg-gray-50 text-gray-500 rounded-lg px-4 py-3 text-sm border border-gray-100 w-full">
                  Information saknas
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <h4 className="font-semibold text-green-600 text-lg flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Utbetalningstid
              </h4>
              <div className="bg-green-50 text-green-700 rounded-lg px-4 py-3 text-base font-medium border border-green-100">
                {withdrawalTime}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <h4 className="font-semibold text-amber-600 text-lg flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Kundtjänst
              </h4>
              <div className="flex flex-wrap gap-2">
                {customerSupport.map((support, index) => (
                  <span key={index} className="inline-flex items-center bg-amber-50 text-amber-700 rounded-full px-3 py-1 text-sm font-medium border border-amber-100 hover:bg-amber-100 hover:border-amber-200 transition-colors">
                    {support}
                  </span>
                ))}
                {customerSupport.length === 0 && (
                  <div className="bg-gray-50 text-gray-500 rounded-lg px-4 py-3 text-sm border border-gray-100 w-full">
                    Information saknas
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 