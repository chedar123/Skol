"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaHome, FaStar, FaGift, FaGamepad, FaBan, FaUser, FaSignOutAlt, FaSignInAlt, FaDice, FaComments, FaBook, FaChevronDown } from "react-icons/fa";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [casinoGuidesOpen, setCasinoGuidesOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    onClose();
    await signOut({ callbackUrl: "/" });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 flex flex-col max-h-screen">
        {/* Menu Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Meny</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Stäng meny"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Menu Content */}
        <div className="flex-grow overflow-y-auto">
          <nav className="p-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="flex items-center text-gray-700 hover:text-pink-600 transition-colors py-2"
                  onClick={onClose}
                >
                  <FaHome className="mr-3 text-xl" />
                  <span className="text-lg">Hem</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/recension" 
                  className="flex items-center text-gray-700 hover:text-pink-600 transition-colors py-2"
                  onClick={onClose}
                >
                  <FaStar className="mr-3 text-xl" />
                  <span className="text-lg">Recensioner</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/bonusar" 
                  className="flex items-center text-gray-700 hover:text-pink-600 transition-colors py-2"
                  onClick={onClose}
                >
                  <FaGift className="mr-3 text-xl" />
                  <span className="text-lg">Bonusar</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/spel" 
                  className="flex items-center text-gray-700 hover:text-pink-600 transition-colors py-2"
                  onClick={onClose}
                >
                  <FaDice className="mr-3 text-xl" />
                  <span className="text-lg">Spel</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/forum" 
                  className="flex items-center text-gray-700 hover:text-pink-600 transition-colors py-2"
                  onClick={onClose}
                >
                  <FaComments className="mr-3 text-xl" />
                  <span className="text-lg">Forum</span>
                </Link>
              </li>
              <li>
                <div className="space-y-2">
                  <button 
                    onClick={() => setCasinoGuidesOpen(!casinoGuidesOpen)}
                    className="flex items-center justify-between w-full text-gray-700 hover:text-pink-600 transition-colors py-2"
                  >
                    <div className="flex items-center">
                      <FaBook className="mr-3 text-xl" />
                      <span className="text-lg">Casinoguider</span>
                    </div>
                    <FaChevronDown className={`transform transition-transform ${casinoGuidesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {casinoGuidesOpen && (
                    <ul className="pl-8 space-y-2">
                      <li>
                        <Link 
                          href="/casinoguider/nyborjare"
                          className="block text-gray-700 hover:text-pink-600 transition-colors py-2"
                          onClick={onClose}
                        >
                          Casinoguide för nybörjare
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/casinoguider/rng"
                          className="block text-gray-700 hover:text-pink-600 transition-colors py-2"
                          onClick={onClose}
                        >
                          Förklaring av RNG
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/casinoguider/omsattningskrav"
                          className="block text-gray-700 hover:text-pink-600 transition-colors py-2"
                          onClick={onClose}
                        >
                          Omsättningskrav
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/casinoguider/gratis-casino"
                          className="block text-gray-700 hover:text-pink-600 transition-colors py-2"
                          onClick={onClose}
                        >
                          Kan man spela gratis casino?
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/casinoguider/pay-n-play"
                          className="block text-gray-700 hover:text-pink-600 transition-colors py-2"
                          onClick={onClose}
                        >
                          Pay N Play Casino
                        </Link>
                      </li>
                      <li className="border-t border-gray-200 mt-2 pt-2">
                        <Link 
                          href="/casinoguider"
                          className="block text-pink-600 hover:text-pink-700 transition-colors py-2 font-medium"
                          onClick={onClose}
                        >
                          Se alla guider
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          {isAuthenticated ? (
            <div className="space-y-3">
              <Link 
                href="/profil" 
                className="flex items-center text-gray-700 hover:text-pink-600 transition-colors py-2"
                onClick={onClose}
              >
                <FaUser className="mr-3 text-xl" />
                <span className="text-lg">Min profil</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center w-full text-left text-gray-700 hover:text-pink-600 transition-colors py-2"
              >
                <FaSignOutAlt className="mr-3 text-xl" />
                <span className="text-lg">Logga ut</span>
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center text-gray-700 hover:text-pink-600 transition-colors py-2"
              onClick={onClose}
            >
              <FaSignInAlt className="mr-3 text-xl" />
              <span className="text-lg">Logga in</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
} 