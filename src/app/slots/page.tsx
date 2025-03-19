import { Metadata } from "next";
import SlotsPageClient from './SlotsPageClient';
import { slotList } from '@/lib/data/casino-data';

export const metadata: Metadata = {
  title: "Populära Slots | Spela Gratis Demo & Hitta Bästa Spelautomater | Slotskolan",
  description: "Utforska de bästa och mest populära slots på Slotskolan. Prova gratis demos, lär dig om RTP, volatilitet och bonusfunktioner. Din guide till spelautomater online.",
  keywords: "slots, spelautomater, casino slots, gratis slots, slot demos, populära slots, online slots, slotskolan, slot recensioner, slot guider",
  openGraph: {
    title: "Populära Slots | Spela Gratis Demo & Hitta Bästa Spelautomater | Slotskolan",
    description: "Utforska de bästa och mest populära slots på Slotskolan. Prova gratis demos, lär dig om RTP, volatilitet och bonusfunktioner. Din guide till spelautomater online.",
    url: "https://slotskolan.se/slots",
    siteName: "Slotskolan",
    locale: "sv_SE",
    type: "website",
    images: [
      {
        url: "https://slotskolan.se/images/og/slots-page.jpg",
        width: 1200,
        height: 630,
        alt: "Populära slots på Slotskolan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Populära Slots | Spela Gratis Demo & Hitta Bästa Spelautomater | Slotskolan",
    description: "Utforska de bästa och mest populära slots på Slotskolan. Prova gratis demos, lär dig om RTP, volatilitet och bonusfunktioner. Din guide till spelautomater online.",
    images: ["https://slotskolan.se/images/og/slots-page.jpg"],
  },
  alternates: {
    canonical: "https://slotskolan.se/slots",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: "Slotskolan Team" }],
  creator: "Slotskolan",
  publisher: "Slotskolan",
};

export default function SlotsPage() {
  return <SlotsPageClient slots={slotList} />;
} 