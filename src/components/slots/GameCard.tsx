"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/data/games-data';
import { Card, CardContent, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

interface GameCardProps {
  game: Game;
  onClick?: () => void;
  onPlayDemo?: (game: Game) => void;
}

export default function GameCard({ game, onClick, onPlayDemo }: GameCardProps) {
  // Förbereda en standard spelimage om ingen finns
  const imageUrl = game.imageUrl || '/images/slots/default-slot.jpg';
  
  return (
    <Card 
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        <Image 
          src={imageUrl} 
          alt={game.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
        <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-medium px-2 py-1 rounded-full">
          {game.provider}
        </div>
      </div>
      
      <CardContent>
        <CardTitle className="line-clamp-1 mb-4">{game.name}</CardTitle>
        
        <div className="flex justify-between items-center">
          <Link 
            href={`/spel/${game.id}`}
            className="text-pink-600 text-sm font-medium hover:text-pink-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Mer info
          </Link>
          
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onPlayDemo) {
                onPlayDemo(game);
              }
            }}
          >
            Spela demo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 