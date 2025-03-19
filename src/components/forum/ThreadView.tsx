"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  MessageSquare, Pin, Lock, Unlock, ThumbsUp, Flag, 
  ChevronLeft, ChevronRight, Reply, Clock, Shield,
  AlertTriangle, MoreVertical, Edit, Trash, Check, X
} from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useThreadActions } from '@/hooks/useThreadActions';
import { usePostActions } from '@/hooks/usePostActions';

// Dynamisk import för att undvika SSR problem med Tiptap
const TiptapEditor = dynamic(() => import('@/components/common/TiptapEditor'), { 
  ssr: false,
  loading: () => <div className="border rounded-md p-3 min-h-[150px] flex items-center justify-center">
    <div className="animate-spin h-5 w-5 border-2 border-pink-600 rounded-full border-r-transparent"></div>
  </div>
});

// Importera typerna från types.ts
import { Thread, Post } from './types';

// Importera de nya komponenterna
import ThreadHeader from './ThreadHeader';
import PostItem from './PostItem';
import ThreadPagination from './ThreadPagination';
import ThreadStats from './ThreadStats';
import ReplyForm from './ReplyForm';

interface ThreadViewProps {
  threadId: string;
}

export default function ThreadView({ threadId }: ThreadViewProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Logga sessionsinformation för debugging
  useEffect(() => {
    console.log('Session i ThreadView:', session);
    console.log('Session user:', session?.user);
    console.log('Session user ID:', session?.user?.id);
    console.log('Session user role:', session?.user?.role);
  }, [session]);
  
  // Tråd- och inläggsdata
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Paginering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Svar-formulär
  const [replyContent, setReplyContent] = useState('');
  const [replyError, setReplyError] = useState<string | undefined>(undefined);
  
  // Tillståndsvariabler för olika åtgärder
  const [isLockingThread, setIsLockingThread] = useState(false);
  const [isPinningThread, setIsPinningThread] = useState(false);
  const [isAcceptingPost, setIsAcceptingPost] = useState(false);
  
  // Använd hooks för att hantera tråd- och inläggsåtgärder
  const { isDeleting: isDeletingThread, handleDeleteThread: deleteThread } = useThreadActions();
  const { 
    isDeletingPost, 
    handleDeletePost: deletePost, 
    handleReportPost: reportPost 
  } = usePostActions();
  
  // Hämta tråd och inlägg
  useEffect(() => {
    const fetchThreadAndPosts = async () => {
      try {
        setLoading(true);
        console.log(`Hämtar tråd med ID: ${threadId} och inlägg för sida ${currentPage}`);
        const response = await fetch(`/api/forum/threads/${threadId}/posts?page=${currentPage}&limit=10`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          console.error(`Fel vid hämtning av tråd: ${response.status} ${response.statusText}`);
          const errorData = await response.json().catch(() => ({}));
          console.error('API-svar:', errorData);
          throw new Error(errorData.error || 'Kunde inte hämta tråd och inlägg');
        }
        
        const data = await response.json();
        console.log('Hämtade tråd- och inläggsdata:', data);
        setThread(data.thread);
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error('Error fetching thread:', err);
        setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      } finally {
        setLoading(false);
      }
    };
    
    fetchThreadAndPosts();
  }, [threadId, currentPage]);
  
  // Hantera paginering
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Gilla ett inlägg
  const handleLikePost = async (postId: string) => {
    if (!session) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      const response = await fetch(`/api/forum/posts/${postId}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunde inte gilla inlägget');
      }
      
      // Uppdatera inlägg lokalt
      const data = await response.json();
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
            ...post,
              _count: { ...post._count, likes: data.liked ? post._count.likes + 1 : post._count.likes - 1 },
              hasLiked: data.liked
            } 
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
      toast.error(err instanceof Error ? err.message : 'Ett fel uppstod');
    }
  };
  
  // Skicka ett svar
  const handleSubmitReply = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    if (!replyContent.trim()) {
      setReplyError('Skriv ett svar innan du skickar');
      return;
    }
    
    setReplyError(undefined);
    
    try {
      const response = await fetch(`/api/forum/threads/${threadId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunde inte skapa svar');
      }
      
      const data = await response.json();
      
      // Återställ formulär
      setReplyContent('');
      
      // Uppdatera inläggslistan
      if (posts.length < 10) {
        setPosts([...posts, data.post]);
      } else {
        // Om vi är på sista sidan, gå till den nya sista sidan
        setCurrentPage(totalPages + 1);
      }
      
      toast.success('Svar skickat');
    } catch (err) {
      console.error('Error creating reply:', err);
      setReplyError(err instanceof Error ? err.message : 'Ett fel uppstod vid skapande av svar');
    }
  };
  
  // Låsa/låsa upp tråd
  const handleToggleLock = async () => {
    if (!session || !thread) return;
    
    try {
      setIsLockingThread(true);
      
      const response = await fetch(`/api/forum/threads/${threadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isLocked: !thread.isLocked,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunde inte ändra trådens låsstatus');
      }
      
      const data = await response.json();
      setThread(data.thread);
      
      toast.success(thread.isLocked ? 'Tråden har låsts upp' : 'Tråden har låsts');
    } catch (err) {
      console.error('Error toggling thread lock:', err);
      toast.error(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setIsLockingThread(false);
    }
  };
  
  // Markera ett inlägg som godkänt svar
  const handleAcceptPost = async (postId: string) => {
    if (!session || !thread) return;
    
    try {
      setIsAcceptingPost(true);
      
      const response = await fetch(`/api/forum/threads/${threadId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunde inte markera inlägget som godkänt svar');
      }
      
      const data = await response.json();
      setThread(data.thread);
      
      toast.success('Inlägget har markerats som godkänt svar');
    } catch (err) {
      console.error('Error accepting post:', err);
      toast.error(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setIsAcceptingPost(false);
    }
  };
  
  // Klistra/ta bort klistring av tråd
  const handleToggleSticky = async () => {
    if (!session || !thread) return;
    
    try {
      setIsPinningThread(true);
      
      const response = await fetch(`/api/forum/threads/${threadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isSticky: !thread.isSticky,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunde inte ändra trådens klistringsstatus');
      }
      
      const data = await response.json();
      setThread(data.thread);
      
      toast.success(thread.isSticky ? 'Tråden är inte längre klistrad' : 'Tråden har klistrats');
    } catch (err) {
      console.error('Error toggling sticky status:', err);
      toast.error(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setIsPinningThread(false);
    }
  };
  
  // Ersätt den befintliga handleDeletePost-funktionen med en wrapper
  const handleDeletePost = async (postId: string, authorId: string) => {
    const isFirstPost = posts.length > 0 && posts[0].id === postId;
    
    deletePost(
      postId, 
      authorId, 
      session,
      // Vid lyckad borttagning
      (deletedPostId) => {
        // Uppdatera inläggsdata genom att filtrera bort borttaget inlägg
        setPosts(posts.filter(p => p.id !== deletedPostId));
      },
      // Om det är trådstartar-inlägget, hantera det som en trådborttagning
      isFirstPost ? () => {
        // Navigera tillbaka till forum eller kategori
        if (thread?.category?.slug) {
          router.push(`/forum/${thread.category.slug}`);
        } else {
          router.push('/forum');
        }
      } : undefined
    );
  };
  
  // Ersätt den befintliga handleDeleteThread-funktionen med en wrapper
  const handleDeleteThread = async () => {
    if (!thread) return;
    
    deleteThread(
      threadId, 
      thread.author.id, 
      session,
      () => {
        // Navigera tillbaka till forumet eller kategorisidan
        if (thread?.category?.slug) {
          router.push(`/forum/${thread.category.slug}`);
        } else {
          router.push('/forum');
        }
      }
    );
  };
  
  // Wrapper för att rapportera inlägg
  const handleReportPost = async (postId: string) => {
    reportPost(postId, session);
  };
  
  // Rendering för laddning och fel
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Laddar tråd...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <h2 className="text-xl font-bold text-red-700 mb-2">Ett fel uppstod</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Försök igen
        </button>
      </div>
    );
  }
  
  if (!thread || posts.length === 0) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-center">
        <h2 className="text-xl font-bold text-yellow-700 mb-2">Tråden hittades inte</h2>
        <p className="text-yellow-600 mb-4">Tråden kan ha tagits bort eller så har ett fel uppstått.</p>
        <a 
          href="/forum"
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 inline-block"
        >
          Tillbaka till forumet
        </a>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Trådrubrik och knappar */}
      <ThreadHeader 
        thread={thread}
        isLockingThread={isLockingThread}
        isPinningThread={isPinningThread}
        isDeletingThread={isDeletingThread}
        handleToggleLock={handleToggleLock}
        handleToggleSticky={handleToggleSticky}
        handleDeleteThread={handleDeleteThread}
      />
      
      {/* Trådstatistik */}
      <ThreadStats postCount={posts.length} viewCount={thread.viewCount} />
      
      {/* Inlägg */}
      <div className="space-y-6">
        {/* Första inlägget (trådskaparen) */}
        {posts.length > 0 && (
          <PostItem 
            post={posts[0]} 
            thread={thread}
            isFirstPost={true}
            isAcceptingPost={isAcceptingPost}
            isDeletingPost={isDeletingPost}
            handleLikePost={handleLikePost}
            handleAcceptPost={handleAcceptPost}
            handleDeletePost={handleDeletePost}
            handleReportPost={handleReportPost}
            timeAgo={timeAgo}
          />
        )}
        
        {/* Övriga inlägg */}
        {posts.slice(1).map((post) => (
          <PostItem 
            key={post.id}
            post={post} 
            thread={thread}
            isAcceptingPost={isAcceptingPost}
            isDeletingPost={isDeletingPost}
            handleLikePost={handleLikePost}
            handleAcceptPost={handleAcceptPost}
            handleDeletePost={handleDeletePost}
            handleReportPost={handleReportPost}
            timeAgo={timeAgo}
          />
        ))}
      </div>
      
      {/* Pagination */}
      <ThreadPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
      
      {/* Svarsformulär */}
      <ReplyForm 
        threadId={threadId}
        isLocked={thread.isLocked}
        replyContent={replyContent}
        setReplyContent={setReplyContent}
        replyError={replyError}
        handleSubmitReply={handleSubmitReply}
      />
    </div>
  );
} 