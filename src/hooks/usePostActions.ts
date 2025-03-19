"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

export function usePostActions() {
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const router = useRouter();
  
  // Funktion för att ta bort ett inlägg
  const handleDeletePost = async (
    postId: string, 
    authorId: string, 
    session: Session | null,
    onSuccess?: (postId: string) => void,
    onDeleteFirstPost?: () => void
  ) => {
    if (!session || !session.user) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      // Kontrollera behörigheter
      const isAdmin = session.user?.role === 'ADMIN';
      const isModerator = session.user?.role === 'MODERATOR';
      
      // Försöka hämta användar-ID från session
      const userId = session.user?.id || (session as any)?.token?.sub;
      const isOwner = userId === authorId;
      
      console.log('Session user:', session.user);
      console.log('User ID från session:', userId);
      console.log('Author ID:', authorId);
      console.log('Is admin:', isAdmin);
      console.log('Is moderator:', isModerator);
      console.log('Is owner:', isOwner);
      
      if (!isAdmin && !isModerator && !isOwner) {
        toast.error('Du har inte behörighet att ta bort detta inlägg');
        return;
      }
      
      // Visa laddningsindikator
      setIsDeletingPost(true);
      
      // Fråga API:et om att ta bort inlägget
      const response = await fetch(`/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'  // Säkerställer att cookies skickas med för session
      });
      
      console.log('Delete post response status:', response.status);
      
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
          console.error('Error response data:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        
        console.error(`Delete post request failed with status ${response.status}`);
        throw new Error(errorData.error || `Kunde inte ta bort inlägget (${response.status})`);
      }
      
      toast.success('Inlägget har tagits bort');
      
      // Anropa callback om den finns
      if (onSuccess) {
        onSuccess(postId);
      }
      
      // Om det var första inlägget i tråden (trådstart), anropa callback för det
      if (onDeleteFirstPost) {
        onDeleteFirstPost();
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error(err instanceof Error ? err.message : 'Ett fel uppstod vid borttagning av inlägg');
    } finally {
      setIsDeletingPost(false);
    }
  };
  
  // Funktion för att rapportera ett inlägg
  const handleReportPost = async (
    postId: string, 
    session: Session | null
  ) => {
    if (!session) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      const reportReason = prompt('Ange anledning till rapporten:');
      if (!reportReason) return;
      
      setIsReporting(true);
      
      const response = await fetch(`/api/forum/posts/${postId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: reportReason
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Kunde inte rapportera inlägget');
      }
      
      toast.success('Inlägget har rapporterats');
    } catch (err) {
      console.error('Error reporting post:', err);
      toast.error(err instanceof Error ? err.message : 'Ett fel uppstod vid rapportering av inlägg');
    } finally {
      setIsReporting(false);
    }
  };
  
  return {
    isDeletingPost,
    isReporting,
    handleDeletePost,
    handleReportPost
  };
} 