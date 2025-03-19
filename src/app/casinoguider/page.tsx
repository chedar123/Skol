import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBook, FaDice, FaPercentage, FaGift, FaCreditCard } from 'react-icons/fa';

export const metadata = {
  title: 'Casinoguider | Slotskolan',
  description: 'Utforska våra omfattande guider om casinospel. Från nybörjarguider till fördjupningar i RNG, omsättningskrav och mer.',
};

export default function CasinoguiderIndex() {
  const guides = [
    {
      title: 'Casinoguide för nybörjare',
      description: 'Perfekt startpunkt för dig som är ny inom casinospel. Lär dig grunderna, viktiga termer och smarta strategier.',
      href: '/casinoguider/nyborjare',
      icon: FaBook,
      image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=2340&auto=format&fit=crop',
    },
    {
      title: 'Förklaring av RNG',
      description: 'Förstå hur slumpgeneratorn fungerar i casinospel och varför den är viktig för rättvisa spel.',
      href: '/casinoguider/rng',
      icon: FaDice,
      image: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?q=80&w=2340&auto=format&fit=crop',
    },
    {
      title: 'Omsättningskrav',
      description: 'Allt du behöver veta om omsättningskrav - hur de fungerar, hur du beräknar dem och vad du ska tänka på.',
      href: '/casinoguider/omsattningskrav',
      icon: FaPercentage,
      image: 'https://images.unsplash.com/photo-1611059263703-346d4451c519?q=80&w=2340&auto=format&fit=crop',
    },
    {
      title: 'Kan man spela gratis casino?',
      description: 'Utforska olika sätt att spela casino gratis - från demo-spel till free spins och no deposit bonusar.',
      href: '/casinoguider/gratis-casino',
      icon: FaGift,
      image: 'https://images.unsplash.com/photo-1563341591-ad0a750911cf?q=80&w=2329&auto=format&fit=crop',
    },
    {
      title: 'Pay N Play Casino',
      description: 'Lär dig allt om Pay N Play - den moderna lösningen för snabbt och enkelt casinospel utan registrering.',
      href: '/casinoguider/pay-n-play',
      icon: FaCreditCard,
      image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=2340&auto=format&fit=crop',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Casinoguider</h1>
        <p className="text-lg text-gray-600">
          Välkommen till vårt bibliotek av casinoguider. Här hittar du allt från grundläggande 
          information för nybörjare till djupgående analyser av specifika casinofunktioner.
        </p>
      </div>

      <div className="space-y-8">
        {guides.map((guide, index) => (
          <Link 
            key={guide.href} 
            href={guide.href}
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="md:flex">
                <div className="md:w-1/3 relative">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex items-center mb-2">
                    <guide.icon className="h-5 w-5 text-pink-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                      {guide.title}
                    </h2>
                  </div>
                  <p className="text-gray-600">{guide.description}</p>
                  <div className="mt-4">
                    <span className="text-pink-600 font-medium group-hover:text-pink-700">
                      Läs mer →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Behöver du hjälp?</h2>
        <p className="text-gray-600 mb-6">
          Hittar du inte svaret du söker i våra guider? Besök vårt forum där du kan 
          ställa frågor och få hjälp av andra spelare.
        </p>
        <Link 
          href="/forum" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors"
        >
          Besök forumet
        </Link>
      </div>
    </div>
  );
} 