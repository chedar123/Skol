"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import MobileMenu from './MobileMenu';
import { FaSearch, FaHome, FaStar, FaGift, FaGamepad, FaBan, FaSignInAlt, FaUserCircle, FaDice, FaComments, FaChevronDown, FaBook } from "react-icons/fa";
import NavLink from "@/components/common/NavLink";

export default function GlobalHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [casinoGuidesOpen, setCasinoGuidesOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const casinoGuidesRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push('/profil');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (casinoGuidesRef.current && !casinoGuidesRef.current.contains(event.target as Node)) {
        setCasinoGuidesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Search for:", searchQuery);
    setSearchOpen(false);
    setSearchQuery("");
    // Redirect to search results page
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isCasinoGuidePath = () => {
    return pathname.startsWith('/casinoguider');
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow py-2" 
          : "bg-white border-b border-gray-200 py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink href="/" className="flex items-center">
            <Image
              src="/images/logos/Logo3.png"
              alt="Slotskolan Logo"
              width={200}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </NavLink>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink 
              href="/" 
              className={`flex items-center text-base ${
                isActive("/") ? "text-pink-600 font-medium" : "text-gray-700 hover:text-pink-600"
              } transition-colors`}
              activeClassName="text-pink-600"
              exact
            >
              <FaHome className="mr-1.5" />
              Hem
            </NavLink>
            <NavLink 
              href="/recension" 
              className={`flex items-center text-base ${
                isActive("/recension") ? "text-pink-600 font-medium" : "text-gray-700 hover:text-pink-600"
              } transition-colors`}
              activeClassName="text-pink-600"
            >
              <FaStar className="mr-1.5" />
              Recensioner
            </NavLink>
            <NavLink 
              href="/bonusar" 
              className={`flex items-center text-base ${
                isActive("/bonusar") ? "text-pink-600 font-medium" : "text-gray-700 hover:text-pink-600"
              } transition-colors`}
              activeClassName="text-pink-600"
            >
              <FaGift className="mr-1.5" />
              Bonusar
            </NavLink>
            <NavLink 
              href="/spel" 
              className={`flex items-center text-base ${
                isActive("/spel") ? "text-pink-600 font-medium" : "text-gray-700 hover:text-pink-600"
              } transition-colors`}
              activeClassName="text-pink-600"
            >
              <FaDice className="mr-1.5" />
              Spel
            </NavLink>
            <NavLink 
              href="/forum" 
              className={`flex items-center text-base ${
                pathname.startsWith("/forum") ? "text-pink-600 font-medium" : "text-gray-700 hover:text-pink-600"
              } transition-colors`}
              activeClassName="text-pink-600"
            >
              <FaComments className="mr-1.5" />
              Forum
            </NavLink>
            
            {/* Casinoguider Dropdown */}
            <div className="relative" ref={casinoGuidesRef}>
              <button 
                onClick={() => setCasinoGuidesOpen(!casinoGuidesOpen)}
                className={`flex items-center text-base ${
                  isCasinoGuidePath() ? "text-pink-600 font-medium" : "text-gray-700 hover:text-pink-600"
                } transition-colors`}
                aria-expanded={casinoGuidesOpen}
                aria-haspopup="true"
              >
                <FaBook className="mr-1.5" />
                Casinoguider
                <FaChevronDown className={`ml-1.5 transform transition-transform ${casinoGuidesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {casinoGuidesOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/casinoguider/nyborjare"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                    onClick={() => setCasinoGuidesOpen(false)}
                  >
                    Casinoguide för nybörjare
                  </Link>
                  <Link
                    href="/casinoguider/rng"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                    onClick={() => setCasinoGuidesOpen(false)}
                  >
                    Förklaring av RNG
                  </Link>
                  <Link
                    href="/casinoguider/omsattningskrav"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                    onClick={() => setCasinoGuidesOpen(false)}
                  >
                    Omsättningskrav
                  </Link>
                  <Link
                    href="/casinoguider/gratis-casino"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                    onClick={() => setCasinoGuidesOpen(false)}
                  >
                    Kan man spela gratis casino?
                  </Link>
                  <Link
                    href="/casinoguider/pay-n-play"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                    onClick={() => setCasinoGuidesOpen(false)}
                  >
                    Pay N Play Casino
                  </Link>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <Link
                      href="/casinoguider"
                      className="block px-4 py-2 text-sm font-medium text-pink-600 hover:bg-gray-100"
                      onClick={() => setCasinoGuidesOpen(false)}
                    >
                      Se alla guider
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search, Login and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-700 hover:text-pink-600 transition-colors"
              aria-label="Sök"
            >
              <FaSearch className="h-5 w-5" />
            </button>

            {/* Login/Profile Button */}
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-pink-600 transition-colors p-2"
                  aria-label="Profilmeny"
                >
                  {session?.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session?.user?.name || 'Profilbild'} 
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="h-12 w-12" />
                  )}
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      {session?.user?.name || 'Användare'}
                    </div>
                    <NavLink
                      href="/profil"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      activeClassName="bg-gray-100"
                    >
                      Min profil
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logga ut
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                href="/login"
                className={`hidden md:flex items-center ${
                  isScrolled 
                    ? "text-white bg-pink-600 hover:bg-pink-700" 
                    : "text-gray-900 bg-white hover:bg-white/90"
                } px-4 py-2 rounded-md transition-colors`}
                activeClassName={isScrolled ? "bg-pink-700" : "bg-white/90"}
              >
                <FaSignInAlt className="mr-1.5" />
                Logga in
              </NavLink>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-pink-600 transition-colors"
              aria-label="Meny"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 mt-2 rounded-b-lg">
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                placeholder="Sök efter casino, slots eller bonusar..."
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-pink-600 text-white p-2 rounded-r-md hover:bg-pink-700 transition-colors"
              >
                <FaSearch className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
} 