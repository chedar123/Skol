"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  casinoId: string;
  isFavorite?: boolean;
  favoriteId?: string;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  onFavoriteUpdate?: (favorite: { id: string } | undefined) => void;
}

export default function FavoriteButton({ 
  casinoId, 
  isFavorite = false, 
  favoriteId, 
  showCount = true,
  size = "md",
  onFavoriteUpdate
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFav, setIsFav] = useState(isFavorite);
  const [favId, setFavId] = useState(favoriteId);
  const [likeCount, setLikeCount] = useState(0);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Storlekar för olika komponenter baserat på size prop
  const sizeClasses = {
    sm: {
      button: "p-1.5",
      icon: "h-4 w-4",
      badge: "text-[10px] px-1 py-0.5 min-w-[16px]",
      container: "h-7"
    },
    md: {
      button: "p-2",
      icon: "h-5 w-5",
      badge: "text-xs px-1.5 py-0.5 min-w-[20px]",
      container: "h-9"
    },
    lg: {
      button: "p-2.5",
      icon: "h-6 w-6",
      badge: "text-xs px-2 py-1 min-w-[24px]",
      container: "h-10"
    }
  };

  // Uppdatera isFav när isFavorite ändras (t.ex. när props uppdateras)
  useEffect(() => {
    setIsFav(isFavorite);
    setFavId(favoriteId);
  }, [isFavorite, favoriteId]);

  // Hämta antal likes för casinot
  useEffect(() => {
    if (showCount && casinoId) {
      fetchLikeCount();
    }
  }, [casinoId, showCount]);

  const fetchLikeCount = async () => {
    try {
      setIsCountLoading(true);
      const response = await fetch(`/api/favorites/count?casinoId=${casinoId}`);
      
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.count);
      }
    } catch (error) {
      console.error("Fel vid hämtning av antal likes:", error);
    } finally {
      setIsCountLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (status !== "authenticated") {
      // Omdirigera till inloggningssidan om användaren inte är inloggad
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsLoading(true);

    try {
      if (isFav && favId) {
        // Ta bort från favoriter
        const response = await fetch(`/api/favorites?id=${favId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFav(false);
          setFavId(undefined);
          // Uppdatera antal likes
          if (showCount) {
            setLikeCount(prev => Math.max(0, prev - 1));
          }
          // Meddela föräldrakomponenten om ändringen
          if (onFavoriteUpdate) {
            onFavoriteUpdate(undefined);
          }
        }
      } else {
        // Lägg till i favoriter
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            casinoId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsFav(true);
          setFavId(data.favorite.id);
          // Visa animation när användaren gillar
          setShowAnimation(true);
          setTimeout(() => setShowAnimation(false), 1000);
          // Uppdatera antal likes
          if (showCount) {
            setLikeCount(prev => prev + 1);
          }
          // Meddela föräldrakomponenten om ändringen
          if (onFavoriteUpdate) {
            onFavoriteUpdate({ id: data.favorite.id });
          }
        }
      }
    } catch (error) {
      console.error("Fel vid hantering av favorit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${sizeClasses[size].container}`}>
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`flex items-center justify-center ${sizeClasses[size].button} rounded-full transition-all duration-300 ${
          isFav
            ? "bg-pink-100 text-[hsl(var(--primary))] hover:bg-pink-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={isFav ? "Ta bort från favoriter" : "Lägg till i favoriter"}
        title={isFav ? "Ta bort från favoriter" : "Lägg till i favoriter"}
      >
        {isLoading ? (
          <svg className={`animate-spin ${sizeClasses[size].icon}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClasses[size].icon} ${showAnimation ? 'animate-heartbeat' : ''}`}
            viewBox="0 0 20 20"
            fill={isFav ? "currentColor" : "none"}
            stroke={isFav ? "none" : "currentColor"}
            strokeWidth={isFav ? "0" : "1.5"}
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      
      {showCount && likeCount > 0 && (
        <div 
          className={`absolute -top-1 -right-1 bg-[hsl(var(--primary))] text-white rounded-full ${sizeClasses[size].badge} flex items-center justify-center font-medium shadow-sm transition-all duration-300 ${isCountLoading ? 'opacity-70' : ''}`}
        >
          {isCountLoading ? '...' : likeCount}
        </div>
      )}
    </div>
  );
} 