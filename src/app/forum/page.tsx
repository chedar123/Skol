"use client";

import { useEffect, useState } from 'react';
import ForumLayout from '@/components/forum/ForumLayout';
import CategoryList from '@/components/forum/CategoryList';
import Link from 'next/link';
import { Plus, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ForumPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulera en kort laddningstid för att förhindra flimmer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ForumLayout>
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Laddar forum...</p>
        </div>
      </ForumLayout>
    );
  }

  if (error) {
    return (
      <ForumLayout>
        <div className="p-8 text-center bg-red-50 rounded-lg">
          <p className="text-red-600">Fel: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Försök igen
          </button>
        </div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Forum</h1>
          
          <div className="flex space-x-3">
            {session?.user && (
              <Link 
                href="/forum/new"
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Skapa ny tråd
              </Link>
            )}
            
            {(session?.user?.role === 'ADMIN' || session?.user?.role === 'MODERATOR') && (
              <Link 
                href="/forum/admin"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 inline-flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Hantera kategorier
              </Link>
            )}
          </div>
        </div>
        
        <CategoryList />
      </div>
    </ForumLayout>
  );
} 