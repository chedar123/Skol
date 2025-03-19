"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Eye, Clock, Pin, Lock } from 'lucide-react';
import ForumLayout from '@/components/forum/ForumLayout';
import { Thread } from '@/types/forum';
import { timeAgo } from '@/lib/utils';

export default function MyThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Omdirigera till inloggningssidan om användaren inte är inloggad
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/forum/my-threads');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      fetchMyThreads();
    }
  }, [status, session, router]);
  
  const fetchMyThreads = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/forum/threads?authorId=${session?.user?.id}`);
      
      if (!response.ok) {
        throw new Error('Kunde inte hämta dina trådar');
      }
      
      const data = await response.json();
      setThreads(data.threads);
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ForumLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mina trådar</h1>
        
        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Laddar trådar...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 rounded-lg text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchMyThreads}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Försök igen
            </button>
          </div>
        ) : threads.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">Du har inte skapat några trådar ännu.</p>
            <Link 
              href="/forum/new"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 inline-flex items-center"
            >
              Skapa en ny tråd
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 border-b font-medium text-gray-700">
              <div className="col-span-8">Tråd</div>
              <div className="col-span-1 text-center">Inlägg</div>
              <div className="col-span-1 text-center">Visningar</div>
              <div className="col-span-2 text-right">Senaste inlägg</div>
            </div>
            
            {threads.map((thread) => (
              <div key={thread.id} className={`grid grid-cols-12 py-4 px-4 border-b border-gray-100 hover:bg-gray-50 ${thread.isSticky ? 'bg-amber-50' : ''}`}>
                <div className="col-span-8">
                  <div className="flex items-start">
                    <div className="col-span-8">
                      <div>
                        <Link href={`/forum/thread/${thread.id}/${thread.slug}`} className="flex items-center">
                          <h3 className="text-lg font-semibold text-pink-700 hover:text-pink-800 group-hover:underline">
                            {thread.title}
                          </h3>
                          
                          {thread.isSticky && (
                            <Pin className="ml-2 w-4 h-4 text-amber-600" />
                          )}
                          
                          {thread.isLocked && (
                            <Lock className="ml-2 w-4 h-4 text-gray-600" />
                          )}
                        </Link>
                        
                        <div className="text-sm text-gray-600 mt-1">
                          <Link 
                            href={`/forum/${thread.category.slug}`} 
                            className="text-pink-600 hover:underline"
                          >
                            {thread.category.name}
                          </Link>
                          <span className="mx-2">•</span>
                          <span>{timeAgo(new Date(thread.createdAt))}</span>
                        </div>

                        {/* Förhandsvisning av trådinnehåll */}
                        {thread.excerpt && (
                          <div className="mt-2 text-sm text-gray-700 line-clamp-2">
                            {thread.excerpt}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 text-center my-auto">
                  <span className="font-medium text-gray-700">{thread._count?.posts || 0}</span>
                </div>
                
                <div className="col-span-1 text-center my-auto">
                  <span className="text-gray-600">{thread.viewCount}</span>
                </div>
                
                <div className="col-span-2 text-right my-auto">
                  <div className="text-sm text-gray-600">
                    <span className="block">{timeAgo(new Date(thread.lastPostAt || thread.createdAt))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ForumLayout>
  );
} 