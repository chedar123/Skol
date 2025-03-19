"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ForumLayoutProps {
  children: ReactNode;
}

export default function ForumLayout({ children }: ForumLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.role === 'ADMIN';
  const isModerator = session?.user?.role === 'MODERATOR';
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3 border-b pb-2">Forum</h3>
            <nav className="space-y-1">
              <Link 
                href="/forum" 
                className={`block px-3 py-2 rounded-md ${
                  pathname === '/forum' 
                    ? 'bg-pink-100 text-pink-700 font-medium' 
                    : 'hover:bg-gray-100'
                }`}
              >
                Översikt
              </Link>
              
              {(isAdmin || isModerator) && (
                <Link 
                  href="/forum/moderation" 
                  className={`block px-3 py-2 rounded-md ${
                    pathname === '/forum/moderation' 
                      ? 'bg-pink-100 text-pink-700 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Moderation
                </Link>
              )}
            </nav>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3 border-b pb-2">Min aktivitet</h3>
            <div className="space-y-1">
              {session ? (
                <>
                  <Link 
                    href="/forum/my-threads" 
                    className={`block px-3 py-2 rounded-md ${
                      pathname === '/forum/my-threads' 
                        ? 'bg-pink-100 text-pink-700 font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Mina trådar
                  </Link>
                  <Link 
                    href="/forum/my-posts" 
                    className={`block px-3 py-2 rounded-md ${
                      pathname === '/forum/my-posts' 
                        ? 'bg-pink-100 text-pink-700 font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Mina inlägg
                  </Link>
                </>
              ) : (
                <p className="text-sm text-gray-500 px-3 py-2">
                  <Link href="/login" className="text-pink-600 hover:underline">
                    Logga in
                  </Link> för att se din aktivitet
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3 border-b pb-2">Forum regler</h3>
            <ul className="text-sm text-gray-600 space-y-2 px-3">
              <li>Var respektfull mot andra.</li>
              <li>Ingen spam eller reklam.</li>
              <li>Håll dig till ämnet i trådar.</li>
              <li>Inga personliga påhopp.</li>
              <li>Moderatorer har sista ordet.</li>
            </ul>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
} 