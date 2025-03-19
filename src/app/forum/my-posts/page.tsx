"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import ForumLayout from '@/components/forum/ForumLayout';
import { Post } from '@/types/forum';
import { timeAgo } from '@/lib/utils';

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Omdirigera till inloggningssidan om användaren inte är inloggad
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/forum/my-posts');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      fetchMyPosts();
    }
  }, [status, session, router]);
  
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/forum/posts?authorId=${session?.user?.id}`);
      
      if (!response.ok) {
        throw new Error('Kunde inte hämta dina inlägg');
      }
      
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ForumLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mina inlägg</h1>
        
        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Laddar inlägg...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 rounded-lg text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchMyPosts}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Försök igen
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">Du har inte skrivit några inlägg ännu.</p>
            <Link 
              href="/forum/new"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 inline-flex items-center"
            >
              Skapa en ny tråd
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex justify-between items-start mb-3">
                  <Link 
                    href={`/forum/thread/${post.threadId}`}
                    className="text-lg font-semibold text-pink-700 hover:text-pink-800 hover:underline"
                  >
                    {post.thread?.title || 'Inlägg i tråd'}
                  </Link>
                  
                  <div className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{timeAgo(new Date(post.createdAt))}</span>
                    {post.isEdited && (
                      <span className="ml-2 text-xs text-gray-500">(redigerad)</span>
                    )}
                  </div>
                </div>
                
                <div 
                  className="prose prose-sm max-w-none text-gray-700 mb-3 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                <div className="flex justify-end">
                  <Link 
                    href={`/forum/thread/${post.threadId}#post-${post.id}`}
                    className="text-sm text-pink-600 hover:text-pink-800 hover:underline"
                  >
                    Visa i tråden →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ForumLayout>
  );
} 