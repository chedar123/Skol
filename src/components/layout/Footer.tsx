"use client";

import React from 'react';
import Image from 'next/image';
import NavLink from '@/components/common/NavLink';
import { FaHome, FaStar, FaGift, FaDice, FaShieldAlt, FaInfoCircle, FaQuestion, FaFileContract } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1a1f36] to-[#111827] text-white py-12 border-t border-pink-600/20">
      <div className="container mx-auto px-4">
        {/* Logo och beskrivning */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="w-full md:w-1/3 mb-6 md:mb-0 flex items-center justify-center md:justify-start">
            <Image 
              src="/images/logos/Logo3.png" 
              alt="Slotskolan Logo" 
              width={200} 
              height={80} 
              className="h-20 w-auto"
            />
          </div>
          <div className="w-full md:w-2/3 text-center md:text-right">
            <p className="text-gray-300 max-w-xl ml-auto text-sm md:text-base leading-relaxed">
              Din guide till slots och casino utan spelpaus. Vi hjälper dig att hitta de bästa svenska casinon 
              och lär dig allt om slots och casinospel online.
            </p>
          </div>
        </div>

        {/* Länkar och innehåll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="bg-[#232b42]/50 p-6 rounded-xl hover:bg-[#232b42] transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-pink-400">Om Slotskolan</h3>
            <p className="text-gray-300 mb-4">
              Din guide till slots och casino utan spelpaus. Vi hjälper dig att hitta de bästa svenska casinon och lär dig allt om slots och casinospel online.
            </p>
            <div className="flex space-x-5">
              <a href="https://discord.gg/din-discord-inbjudan" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-all duration-300">
                <Image src="/images/socials/discord.png" alt="Discord" width={42} height={42} className="hover:opacity-80 transition-opacity" />
              </a>
              <a href="https://twitch.tv/slotskolan" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-all duration-300">
                <Image src="/images/socials/twitch.png" alt="Twitch" width={42} height={42} className="hover:opacity-80 transition-opacity" />
              </a>
              <a href="https://x.com/slotskolan" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-all duration-300">
                <Image src="/images/socials/twitter.png" alt="Twitter" width={42} height={42} className="hover:opacity-80 transition-opacity" />
              </a>
              <a href="https://youtube.com/@slotskolan" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-all duration-300">
                <Image src="/images/socials/youtube.png" alt="YouTube" width={42} height={42} className="hover:opacity-80 transition-opacity" />
              </a>
            </div>
          </div>

          <div className="bg-[#232b42]/50 p-6 rounded-xl hover:bg-[#232b42] transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-pink-400">Snabblänkar</h3>
            <ul className="space-y-3">
              <li>
                <NavLink href="/recension" className="text-gray-300 hover:text-pink-300 transition-colors flex items-center">
                  <FaStar className="mr-2 text-pink-500" />
                  Recensioner
                </NavLink>
              </li>
              <li>
                <NavLink href="/bonusar" className="text-gray-300 hover:text-pink-300 transition-colors flex items-center">
                  <FaGift className="mr-2 text-pink-500" />
                  Bonusar
                </NavLink>
              </li>
              <li>
                <NavLink href="/spel" className="text-gray-300 hover:text-pink-300 transition-colors flex items-center">
                  <FaDice className="mr-2 text-pink-500" />
                  Slots
                </NavLink>
              </li>
              <li>
                <NavLink href="/casino-utan-spelpaus" className="text-gray-300 hover:text-pink-300 transition-colors flex items-center">
                  <FaShieldAlt className="mr-2 text-pink-500" />
                  Utan Spelpaus
                </NavLink>
              </li>
              <li>
                <NavLink href="/casinobonusar-sverige" className="text-gray-300 hover:text-pink-300 transition-colors flex items-center">
                  <FaGift className="mr-2 text-pink-500" />
                  Svenska Bonusar
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="bg-[#232b42]/50 p-6 rounded-xl hover:bg-[#232b42] transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-pink-400">Information</h3>
            <ul className="space-y-3">
              <li>
                <NavLink href="/om-oss" className="text-gray-300 hover:text-pink-300 transition-colors flex items-center">
                  <FaInfoCircle className="mr-2 text-pink-500" />
                  Om oss
                </NavLink>
              </li>
              <li>
                <NavLink href="/ansvarsfullt-spelande" className="text-gray-300 hover:text-pink-300 transition-colors flex items-center">
                  <FaShieldAlt className="mr-2 text-pink-500" />
                  Ansvarsfullt spelande
                </NavLink>
              </li>
              <li>
                <NavLink href="/faq" className="text-gray-300 hover:text-pink-300 transition-colors flex items-center">
                  <FaQuestion className="mr-2 text-pink-500" />
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink href="/villkor" className="text-gray-300 hover:text-pink-300 transition-colors flex items-center">
                  <FaFileContract className="mr-2 text-pink-500" />
                  Villkor
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="bg-[#232b42]/50 p-6 rounded-xl hover:bg-[#232b42] transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-pink-400">Nyhetsbrev</h3>
            <p className="text-gray-300 mb-4">
              Prenumerera på vårt nyhetsbrev för att få de senaste nyheterna och exklusiva bonusar.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Din e-postadress"
                className="w-full p-3 bg-[#2c2f3b] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 rounded-md hover:from-pink-600 hover:to-pink-700 transition-all duration-300 font-medium"
              >
                Prenumerera
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Slotskolan. Alla rättigheter förbehållna.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Spela ansvarsfullt. Spel kan vara beroendeframkallande. Spela aldrig för mer än du har råd att förlora.
          </p>
        </div>
      </div>
    </footer>
  );
} 