"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  comment: string;
  createdAt: string;
}

interface CommentSectionProps {
  casinoId: string;
}

export default function CommentSection({ casinoId }: CommentSectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hämta kommentarer när komponenten laddas
  useEffect(() => {
    fetchComments();
  }, [casinoId]);

  // Funktion för att hämta kommentarer
  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/comments?casinoId=${casinoId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Kunde inte hämta kommentarer');
      }
    } catch (error) {
      console.error('Fel vid hämtning av kommentarer:', error);
      setError('Ett fel uppstod när kommentarerna skulle hämtas');
    } finally {
      setIsLoading(false);
    }
  };

  // Funktion för att skicka en ny kommentar
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      setError('Du måste vara inloggad för att kommentera');
      return;
    }
    
    if (!newComment.trim()) {
      setError('Kommentaren kan inte vara tom');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          casinoId,
          comment: newComment,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(prevComments => [data.comment, ...prevComments]);
        setNewComment('');
        setSuccessMessage('Din kommentar har publicerats!');
        
        // Rensa framgångsmeddelandet efter 3 sekunder
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Kunde inte publicera kommentaren');
      }
    } catch (error) {
      console.error('Fel vid publicering av kommentar:', error);
      setError('Ett fel uppstod när kommentaren skulle publiceras');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funktion för att ta bort en kommentar
  const handleDeleteComment = async (commentId: string) => {
    if (!session) {
      setError('Du måste vara inloggad för att ta bort en kommentar');
      return;
    }
    
    if (!window.confirm('Är du säker på att du vill ta bort denna kommentar?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          casinoId,
          commentId,
        }),
      });
      
      if (response.ok) {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        setSuccessMessage('Kommentaren har tagits bort!');
        
        // Rensa framgångsmeddelandet efter 3 sekunder
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Kunde inte ta bort kommentaren');
      }
    } catch (error) {
      console.error('Fel vid borttagning av kommentar:', error);
      setError('Ett fel uppstod när kommentaren skulle tas bort');
    } finally {
      setIsLoading(false);
    }
  };

  // Funktion för att navigera till en användares profil
  const navigateToUserProfile = (userId: string, userName: string) => {
    if (!userName) return;
    
    // Navigera till profilsidan med användarnamnet
    router.push(`/profil/${userName.replace(/\s+/g, '-').toLowerCase()}`);
  };

  // Formatera datum
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 w-full max-w-none">
      <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">Kommentarer</h2>
      
      {/* Kommentarsformulär */}
      {status === "authenticated" ? (
        <form onSubmit={handleSubmitComment} className="mb-8 w-full">
          <div className="flex items-start space-x-4 w-full">
            <div className="flex-shrink-0">
              {session.user?.image ? (
                <div 
                  className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => session.user?.name && navigateToUserProfile(session.user.id || '', session.user.name)}
                >
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || 'Användare'} 
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
                  onClick={() => session.user?.name && navigateToUserProfile(session.user.id || '', session.user.name)}
                >
                  <span className="text-gray-500 text-lg">
                    {session.user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow w-full">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Skriv en kommentar..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent resize-none min-h-[120px]"
                disabled={isSubmitting}
              />
              <div className="mt-3 flex justify-between items-center">
                <div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-md hover:bg-[hsl(var(--primary))]/90 transition-colors disabled:opacity-50 font-medium"
                >
                  {isSubmitting ? 'Publicerar...' : 'Publicera kommentar'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-100 rounded-lg p-6 mb-8 text-center w-full">
          <p className="text-gray-700 mb-3">Du måste vara inloggad för att kommentera.</p>
          <Link 
            href="/login" 
            className="inline-block px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-md hover:bg-[hsl(var(--primary))]/90 transition-colors font-medium"
          >
            Logga in
          </Link>
        </div>
      )}
      
      {/* Lista med kommentarer */}
      <div className="space-y-8 w-full">
        {isLoading && comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[hsl(var(--primary))] border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Laddar kommentarer...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Inga kommentarer ännu. Var först med att kommentera!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-8 last:border-0 w-full">
              <div className="flex items-start space-x-4 w-full">
                <div className="flex-shrink-0">
                  {comment.userImage ? (
                    <div 
                      className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => navigateToUserProfile(comment.userId, comment.userName)}
                    >
                      <Image 
                        src={comment.userImage} 
                        alt={comment.userName} 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                      onClick={() => navigateToUserProfile(comment.userId, comment.userName)}
                    >
                      <span className="text-gray-500 text-lg">
                        {comment.userName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 
                        className="font-medium text-gray-900 hover:text-[hsl(var(--primary))] transition-colors cursor-pointer"
                        onClick={() => navigateToUserProfile(comment.userId, comment.userName)}
                      >
                        {comment.userName}
                      </h3>
                      <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                    </div>
                    {session && (session.user?.id === comment.userId || session.user?.role === 'ADMIN') && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Ta bort kommentar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="mt-3 text-gray-700 whitespace-pre-line text-base">
                    {comment.comment}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 