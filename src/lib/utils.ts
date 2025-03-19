"use client";

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Konverterar en sträng till en slug-sträng
 * @param text Texten som ska konverteras till en slug
 * @param makeUnique Om true, lägger till en kort timestamp för att göra slugen unik
 * @returns En slug-sträng
 */
export function slugify(text: string, makeUnique = false): string {
  const baseSlug = text
    .toString()
    .normalize('NFD')                   // Normalisera till decomposed form
    .replace(/[\u0300-\u036f]/g, '')   // Ta bort diakritiska tecken
    .toLowerCase()                      // Konvertera till gemener
    .trim()                             // Ta bort inledande och avslutande mellanslag
    .replace(/\s+/g, '-')              // Ersätt mellanslag med bindestreck
    .replace(/[^\w\-]+/g, '')          // Ta bort alla icke-ord tecken
    .replace(/\-\-+/g, '-')            // Ersätt flera bindestreck med ett
    .replace(/^-+/, '')                // Ta bort inledande bindestreck
    .replace(/-+$/, '');               // Ta bort avslutande bindestreck
    
  if (makeUnique) {
    // Lägg till en unik tidsstämpel (sista 8 tecken av current time)
    const timestamp = Date.now().toString().slice(-8);
    return `${baseSlug}-${timestamp}`;
  }
  
  return baseSlug;
}

/**
 * Formaterar ett datum till en läsbar sträng
 * @param date Datumet som ska formateras
 * @returns Ett formaterat datum som sträng
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Beräknar tiden sedan ett givet datum
 * @param date Datumet att beräkna från
 * @returns En sträng som anger tiden sedan datumet
 */
export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Hantera ogiltiga datum
  if (seconds < 0) {
    return 'just nu';
  }
  
  // Tidsintervaller i sekunder
  const intervals = {
    år: 31536000,
    månad: 2592000,
    vecka: 604800,
    dag: 86400,
    timme: 3600,
    minut: 60,
    sekund: 1
  };
  
  // Pluralformer
  const plurals = {
    år: 'år',
    månad: 'månader',
    vecka: 'veckor',
    dag: 'dagar',
    timme: 'timmar',
    minut: 'minuter',
    sekund: 'sekunder'
  };
  
  // Hitta lämpligt tidsintervall
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    
    if (interval >= 1) {
      // Hantera singular/plural
      const unitStr = interval === 1 ? unit : plurals[unit as keyof typeof plurals];
      return `${interval} ${unitStr} sedan`;
    }
  }
  
  return 'just nu';
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  }).format(price);
}
