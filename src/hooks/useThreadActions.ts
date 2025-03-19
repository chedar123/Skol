"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

export function useThreadActions() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  // Funktion för att ta bort en tråd
  const handleDeleteThread = async (
    threadId: string, 
    authorId: string, 
    session: Session | null,
    onSuccess?: (threadId: string) => void
  ) => {
    if (!session || !session.user) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      // Kontrollera behörigheter
      const isAdmin = session.user?.role === 'ADMIN';
      const isModerator = session.user?.role === 'MODERATOR';
      const isOwner = session.user?.id === authorId;
      
      console.log('Session user:', session.user);
      console.log('Author ID:', authorId);
      console.log('Is admin:', isAdmin);
      console.log('Is moderator:', isModerator);
      console.log('Is owner:', isOwner);
      
      if (!isAdmin && !isModerator && !isOwner) {
        toast.error('Du har inte behörighet att ta bort denna tråd');
        return;
      }
      
      // Visa laddningsindikator
      setIsDeleting(true);
      
      // Skicka borttagningsförfrågan till API
      const response = await fetch(`/api/forum/threads/${threadId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'  // Säkerställer att cookies skickas med för session
      });
      
      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
          console.error('Error response data:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        
        console.error(`Delete request failed with status ${response.status}`);
        throw new Error(errorData.error || `Kunde inte ta bort tråden (${response.status})`);
      }
      
      // Anropa callback om den finns
      if (onSuccess) {
        onSuccess(threadId);
      }
      
      toast.success('Tråden har tagits bort');
    } catch (err) {
      console.error('Error deleting thread:', err);
      toast.error(err instanceof Error ? err.message : 'Ett fel uppstod vid borttagning av tråden');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    isDeleting,
    handleDeleteThread
  };
} 