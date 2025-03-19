"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Pin, Lock, MessageSquare, Plus, Clock, ChevronLeft, ChevronRight, Trash, X, AlertTriangle } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useThreadActions } from '@/hooks/useThreadActions';

interface Thread {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  isSticky: boolean;
  isLocked: boolean;
  viewCount: number;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  lastPostAt: string;
  _count: {
    posts: number;
  };
  excerpt?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface ThreadListProps {
  categoryId?: string;
  categorySlug?: string;
  hideHeader?: boolean;
}

export default function ThreadList({ categoryId, categorySlug, hideHeader = false }: ThreadListProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session } = useSession();
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const { isDeleting, handleDeleteThread: deleteThread } = useThreadActions();
  const router = useRouter();
  
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        
        // Använd kategori-ID för att filtrera om tillgängligt
        const queryParams = new URLSearchParams();
        
        if (page) {
          queryParams.append('page', page.toString());
        }
        
        if (categoryId) {
          queryParams.append('categoryId', categoryId);
        }
        
        const response = await fetch(`/api/forum/threads?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Kunde inte hämta trådar');
        }
        
        const data = await response.json();
        
        setThreads(data.threads);
        setTotalPages(data.pagination.totalPages);
        
        // Om vi har en kategori-ID, hämta även kategori-information
        if (categoryId) {
          const categoryResponse = await fetch(`/api/forum/categories/${categoryId}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategory(categoryData.category);
          }
        }
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      } finally {
        setLoading(false);
      }
    };
    
    fetchThreads();
  }, [categoryId, page]);
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const onDeleteThread = async (threadId: string, authorId: string) => {
    console.log('Försöker ta bort tråd:', threadId, 'av författare:', authorId);
    
    if (!session || !session.user) {
      console.log('Ingen session hittades, omdirigerar till inloggningssidan');
      toast.error('Du måste vara inloggad för att ta bort en tråd');
      return;
    }
    
    deleteThread(threadId, authorId, session, (deletedThreadId) => {
      // Uppdatera UI genom att filtrera bort den borttagna tråden
      console.log('Tråden har tagits bort framgångsrikt:', deletedThreadId);
      setThreads(threads.filter(t => t.id !== deletedThreadId));
      setThreadToDelete(null);
      toast.success('Tråden har tagits bort');
    });
  };
  
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Laddar trådar...</p>
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
  
  return (
    <div className="space-y-4">
      {!hideHeader && (
        <div className="flex justify-between items-center">
          <div>
            {category ? (
              <>
                {category.description && (
                  <p className="text-gray-600">{category.description}</p>
                )}
              </>
            ) : (
              <div></div>
            )}
          </div>
          
          {session?.user && (
            <Link 
              href={categorySlug 
                ? `/forum/${categorySlug}/new` 
                : `/forum/new${categoryId ? `?categoryId=${categoryId}` : ''}`
              }
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ny tråd
            </Link>
          )}
        </div>
      )}
      
      {threads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Inga trådar hittades</h2>
          <p className="text-gray-600 mb-6">Det verkar som att inga trådar har skapats i denna kategori än.</p>
          
          {!hideHeader && session?.user && (
            <Link 
              href={categorySlug 
                ? `/forum/${categorySlug}/new` 
                : `/forum/new${categoryId ? `?categoryId=${categoryId}` : ''}`
              }
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Skapa den första tråden
            </Link>
          )}
        </div>
      ) : (
        <>
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
                    <div className="flex-shrink-0 mr-3">
                      {thread.author.image ? (
                        <Image 
                          src={thread.author.image} 
                          alt={thread.author.name || 'Användare'} 
                          width={40} 
                          height={40} 
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {thread.author.name ? thread.author.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                      )}
                    </div>
                    
                    <div className="col-span-8">
                      <div>
                        <div className="flex items-center justify-between">
                          <Link href={categorySlug
                            ? `/forum/${categorySlug}/${thread.slug}`
                            : `/forum/${category?.slug || 'uncategorized'}/${thread.slug}`}
                            className="flex items-center">
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
                          
                          {/* Admin/ägare-knappar för att hantera trådar */}
                          {session && (session.user?.role === 'ADMIN' || session.user?.role === 'MODERATOR' || session.user?.id === thread.author.id) && (
                            <div className="relative">
                              {/* Ta bort knapp */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Öppnar dialogrutan för att ta bort tråd:', thread.id);
                                  setThreadToDelete(thread.id);
                                }}
                                className="ml-2 p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded"
                                title="Ta bort tråd"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mt-1">
                          <span>Av </span>
                          <Link href={`/profil/${thread.author.name || thread.author.id}`} className="hover:underline">
                            {thread.author.name || 'Okänd användare'}
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
                  <span className="font-medium text-gray-700">{thread._count.posts}</span>
                </div>
                
                <div className="col-span-1 text-center my-auto">
                  <span className="text-gray-700">{thread.viewCount}</span>
                </div>
                
                <div className="col-span-2 text-right my-auto">
                  <span className="flex items-center justify-end text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1 text-gray-500" />
                    {timeAgo(new Date(thread.lastPostAt))}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`flex items-center px-3 py-1 rounded ${
                  page === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-pink-600 hover:bg-pink-50'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Föregående
              </button>
              
              <span className="text-gray-600">
                Sida {page} av {totalPages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`flex items-center px-3 py-1 rounded ${
                  page === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-pink-600 hover:bg-pink-50'
                }`}
              >
                Nästa
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          )}

          {/* Ta bort-bekräftelse */}
          {threadToDelete && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => {
                console.log('Stänger dialog genom att klicka utanför');
                setThreadToDelete(null);
              }}
            >
              <div 
                className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center mb-3 text-red-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <h3 className="text-lg font-medium">Bekräfta borttagning</h3>
                </div>
                <p className="mb-4 text-gray-600">
                  Är du säker på att du vill ta bort denna tråd? Denna åtgärd kan inte ångras.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      console.log('Stänger borttagningsdialog');
                      setThreadToDelete(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={() => {
                      const thread = threads.find(t => t.id === threadToDelete);
                      if (thread && threadToDelete) {
                        onDeleteThread(threadToDelete, thread.author.id);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                        Tar bort...
                      </>
                    ) : (
                      "Ta bort"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 