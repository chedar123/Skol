"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { MessageSquare, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Dynamisk import för att undvika SSR problem med Tiptap
const TiptapEditor = dynamic(() => import('@/components/common/TiptapEditor'), { 
  ssr: false,
  loading: () => <div className="border rounded-md p-3 min-h-[150px] flex items-center justify-center">
    <div className="animate-spin h-5 w-5 border-2 border-pink-600 rounded-full border-r-transparent"></div>
  </div>
});

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CreateThread() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    content?: string;
    categoryId?: string;
  }>({});
  const { data: session, status } = useSession();

  // Ladda kategorier och sätt kategori-ID från URL
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/forum/categories');
        if (!response.ok) {
          throw new Error('Kunde inte hämta kategorier');
        }
        const data = await response.json();
        setCategories(data.categories);
        
        // Hämta kategori från URL-slug
        const urlSlug = params?.slug as string;
        if (urlSlug) {
          const matchingCategory = data.categories.find((cat: Category) => cat.slug === urlSlug);
          if (matchingCategory) {
            setCategoryId(matchingCategory.id);
            console.log('Kategori-ID satt från URL-slug:', matchingCategory.id);
          }
        } else if (searchParams.get('categoryId')) {
          setCategoryId(searchParams.get('categoryId') || '');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Kunde inte ladda kategorier. Försök igen senare.');
      }
    };

    fetchCategories();
  }, [searchParams, params?.slug]);

  // Omdirigera icke-inloggade användare
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/forum/new');
    }
  }, [status, router]);

  const validateForm = () => {
    const errors: {
      title?: string;
      content?: string;
      categoryId?: string;
    } = {};
    
    if (!title.trim()) {
      errors.title = 'Ange en titel för tråden';
    } else if (title.length < 3) {
      errors.title = 'Titeln måste vara minst 3 tecken';
    } else if (title.length > 100) {
      errors.title = 'Titeln får inte vara längre än 100 tecken';
    }
    
    if (!content.trim()) {
      errors.content = 'Ange innehåll för tråden';
    } else if (content.length < 10) {
      errors.content = 'Innehållet måste vara minst 10 tecken';
    }
    
    if (!categoryId) {
      errors.categoryId = 'Välj en kategori för tråden';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Försöker skapa tråd med:', { title, content, categoryId });
      console.log('Session status:', status, 'Session data:', session);
      
      const response = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          categoryId,
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Server svarade med fel:', responseData);
        const errorMessage = responseData.error || 'Kunde inte skapa tråd';
        
        // Visa detaljerad felinformation om tillgänglig
        if (responseData.details) {
          console.error('Felinformation:', responseData.details);
          setError(`${errorMessage}: ${responseData.details}`);
        } else {
          setError(errorMessage);
        }
        
        return; // Avbryt utan att kasta fel
      }
      
      console.log('Tråd skapad framgångsrikt:', responseData);
      
      // Navigera till den skapade tråden
      router.push(`/forum/thread/${responseData.thread.id}/${responseData.thread.slug}`);
    } catch (err) {
      console.error('Error creating thread:', err);
      setError(err instanceof Error ? err.message : 'Ett fel uppstod vid skapande av tråd');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Laddar...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/forum" className="inline-flex items-center text-pink-600 hover:text-pink-700">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tillbaka till forumet
        </Link>
        <h1 className="text-2xl font-bold mt-2">Skapa ny tråd</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start">
          <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
              validationErrors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Välj kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {validationErrors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.categoryId}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titel
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
              validationErrors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ange en beskrivande titel för din tråd"
            maxLength={100}
            disabled={loading}
          />
          {validationErrors.title ? (
            <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              {title.length}/100 tecken
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Innehåll
          </label>
          <TiptapEditor 
            content={content} 
            onChange={setContent} 
            placeholder="Skriv ditt inlägg här..." 
            error={validationErrors.content}
          />
          {validationErrors.content && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.content}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-gray-600 text-sm">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span>Skapa det första inlägget i denna tråd</span>
          </div>
          
          <div className="flex space-x-2">
            <Link
              href="/forum"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Avbryt
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-1 align-[-2px]"></span>
                  Skapar...
                </>
              ) : (
                'Skapa tråd'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 