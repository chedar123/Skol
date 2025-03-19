"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CasinoCard from "@/components/CasinoCard";
import GameCard from "@/components/slots/GameCard";
import GameModal from "@/components/slots/GameModal";
import { casinoList, slotList, Slot } from "@/lib/data/casino-data";
import { motion } from "framer-motion";

// Konvertera Slot till Game för användning med våra nya komponenter
interface Game {
  id: string;
  name: string;
  provider: string;
  url: string;
  imageUrl?: string;
}

export default function Home() {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Konvertera selected slot till Game-format
  const selectedGame: Game | null = selectedSlot ? {
    id: selectedSlot.id,
    name: selectedSlot.name,
    provider: 'Spelleverantör',
    url: selectedSlot.gameUrl,
    imageUrl: selectedSlot.image
  } : null;

  const handleOpenModal = (slot: Slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedSlot(null);
    }, 300);
  };
  
  // Konvertera en Slot till en Game för GameCard-komponenten
  const slotToGame = (slot: Slot): Game => ({
    id: slot.id,
    name: slot.name,
    provider: 'Spelleverantör',
    url: slot.gameUrl,
    imageUrl: slot.image
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section med modern design */}
        <section className="relative bg-gradient-to-br from-[#1c0d21] to-[#2c0d33] pt-2 pb-4 overflow-hidden">
          {/* Casino-tema designelement */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-[20%] left-[10%] text-[120px] text-pink-500">♠</div>
              <div className="absolute top-[40%] right-[15%] text-[80px] text-pink-300">♦</div>
              <div className="absolute bottom-[30%] left-[20%] text-[100px] text-pink-400">♣</div>
              <div className="absolute bottom-[10%] right-[10%] text-[140px] text-pink-600">♥</div>
            </div>
          </div>
          
          {/* Glödande effekter */}
          <div className="absolute top-1/4 -left-24 w-96 h-96 bg-pink-900/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-800/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-3 sm:px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 sm:gap-8 mt-4 md:mt-12">
              {/* Text content */}
              <motion.div 
                className="z-10 max-w-xl md:pl-0 md:pr-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 tracking-tight">
                  Välkommen till <span className="text-pink-400">Slotskolan</span>
                </h1>
                <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-8 leading-relaxed">
                  Din guide till de bästa casinobonusarna och spelautomaterna online. Vi hjälper dig att hitta de mest förmånliga erbjudandena och de roligaste spelen.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <Link 
                    href="/bonusar" 
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-all shadow-sm text-sm sm:text-base"
                  >
                    Utforska Bonusar
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <Link 
                    href="/recension" 
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-pink-600 rounded-lg font-medium hover:bg-gray-100 transition-all shadow-sm text-sm sm:text-base"
                  >
                    Utforska Recensioner
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
              
              {/* Featured slot machine or casino graphic */}
              <motion.div 
                className="flex-1 relative max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-0 md:mr-4"
                initial={{ opacity: 0, x: 20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div 
                  onClick={() => {
                    const tombstoneSlot = slotList.find(slot => slot.id === "tombstone");
                    if (tombstoneSlot) {
                      setSelectedSlot(tombstoneSlot);
                      setIsModalOpen(true);
                    }
                  }}
                  className="block cursor-pointer"
                >
                  <div className="relative z-10 transform transition-transform hover:scale-105 duration-500">
                    <div className="relative bg-[#2c0d33] p-0.5 sm:p-1 rounded-xl border border-pink-500 sm:border-2">
                      <Image 
                        src="/images/slots/Tombstone-Slaughter.png" 
                        alt="Featured slot game" 
                        width={500} 
                        height={300}
                        className="rounded-lg w-full h-auto"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 sm:p-4 rounded-b-lg">
                        <p className="text-white font-bold text-sm sm:text-lg">Populär Slot</p>
                        <p className="text-pink-300 text-xs sm:text-base">Tombstone Slaughter</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Vågig separator med anpassad färg */}
          <div className="absolute -bottom-1 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path 
                fill="#f9fafb" 
                fillOpacity="1" 
                d="M0,64L60,58.7C120,53,240,43,360,42.7C480,43,600,53,720,58.7C840,64,960,64,1080,58.7C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Popular Bonuses Section */}
        <section className="py-8 sm:py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-3 sm:px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Populära Bonusar</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {casinoList.slice(0, 4).map((casino, index) => (
                <motion.div
                  key={casino.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CasinoCard casino={casino} />
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link 
                href="/bonusar" 
                className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-all shadow-sm"
              >
                Se alla bonusar
                <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Popular Slots Section */}
        <section className="py-8 sm:py-16 md:py-24 bg-white relative overflow-hidden">
          {/* Dekorativa element */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-100 rounded-full opacity-70 z-0"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-50 rounded-full opacity-70 z-0"></div>
          
          <div className="container mx-auto px-3 sm:px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-3 sm:mb-4 md:mb-0"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Populära slots</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full mt-3 sm:mt-4"></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link 
                  href="/spel"
                  className="group inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
                >
                  Se alla spel
                  <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {slotList.slice(0, 4).map((slot, index) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <GameCard 
                    game={slotToGame(slot)}
                    onClick={() => {}} 
                    onPlayDemo={() => handleOpenModal(slot)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-pink-50 to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-5">
              <path fill="#FF0066" d="M38.5,-65.1C52.4,-60.2,68.1,-54.4,74.3,-42.6C80.5,-30.8,77.2,-13,73.3,2.3C69.3,17.6,64.7,30.5,58.1,44.2C51.5,57.9,42.9,72.3,29.8,79.6C16.8,86.9,-0.7,87.1,-15.4,80.8C-30.1,74.5,-42.1,61.7,-52.9,48.3C-63.7,34.9,-73.4,20.9,-79.5,3.9C-85.5,-13.1,-87.8,-32.9,-80.4,-46.8C-73.1,-60.7,-56,-68.6,-40.2,-72.4C-24.4,-76.2,-9.8,-75.9,2.8,-80.3C15.5,-84.6,24.6,-69.9,38.5,-65.1Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Hur kan vi hjälpa dig?</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full"></div>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">FAQ</h3>
                  <p className="text-gray-600 mb-6 text-center">Hitta svar på vanliga frågor om bonusar och spel.</p>
                  <div className="text-center">
                    <Link href="/faq" className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-pink-600 rounded-lg font-medium transition-colors">
                      Läs mer
                    </Link>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">Ansvarsfullt Spelande</h3>
                  <p className="text-gray-600 mb-6 text-center">Information om hur du spelar ansvarsfullt och får hjälp.</p>
                  <div className="text-center">
                    <Link href="/ansvarsfullt-spelande" className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-pink-600 rounded-lg font-medium transition-colors">
                      Läs mer
                    </Link>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">Villkor</h3>
                  <p className="text-gray-600 mb-6 text-center">Läs våra användarvillkor och integritetspolicy.</p>
                  <div className="text-center">
                    <Link href="/villkor" className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-pink-600 rounded-lg font-medium transition-colors">
                      Läs mer
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-16 text-center"
              >
                <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto relative overflow-hidden border-t-4 border-pink-600">
                  <h3 className="text-2xl font-bold mb-3">Har du frågor eller funderingar?</h3>
                  <p className="text-gray-600 mb-6">Kontakta oss via mejl så återkommer vi så snart som möjligt!</p>
                  <Link 
                    href="mailto:slotskolan@gmail.se" 
                    className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-all shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Mejla oss
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Slot Modal */}
      <GameModal 
        game={selectedGame}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
