"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MessageSquare, Plus, Shield } from 'lucide-react';

interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  _count: {
    threads: number;
  };
}

export default function CategoryList() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  
  const isAdminOrMod = session?.user?.role === 'ADMIN' || session?.user?.role === 'MODERATOR';
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/forum/categories');
        
        if (!response.ok) {
          throw new Error('Kunde inte hämta forum-kategorier');
        }
        
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Laddar kategorier...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-lg">
        <p className="text-red-600">Fel: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Försök igen
        </button>
      </div>
    );
  }
  
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Inga kategorier hittades</h2>
        <p className="text-gray-600 mb-6">Det verkar som att inga forum-kategorier har skapats än.</p>
        
        {isAdminOrMod && (
          <button
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 inline-flex items-center"
            onClick={() => {/* TODO: Add modal for creating category */}}
          >
            <Plus className="w-4 h-4 mr-2" />
            Skapa kategori
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 border-b font-medium text-gray-700">
          <div className="col-span-7">Kategori</div>
          <div className="col-span-2 text-center">Trådar</div>
          <div className="col-span-3 text-center">Aktivitet</div>
        </div>
        
        {categories.map((category) => (
          <div key={category.id} className="grid grid-cols-12 py-4 px-4 border-b border-gray-100 hover:bg-gray-50">
            <div className="col-span-7">
              <Link href={`/forum/${category.slug}`} className="block">
                <h3 className="text-lg font-semibold text-pink-700 hover:text-pink-800">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{category.description}</p>
              </Link>
            </div>
            
            <div className="col-span-2 text-center my-auto">
              <span className="font-medium text-gray-700">{category._count?.threads || 0}</span>
            </div>
            
            <div className="col-span-3 flex justify-center items-center">
              <Link 
                href={`/forum/${category.slug}`}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm inline-flex items-center transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Visa trådar
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {isAdminOrMod && (
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500 flex items-start">
          <Shield className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700">Du är inloggad som {session?.user?.role === 'ADMIN' ? 'administratör' : 'moderator'} och har behörighet att hantera kategorier och trådar.</p>
          </div>
        </div>
      )}
    </div>
  );
} 