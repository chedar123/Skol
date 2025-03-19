import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slotskolan - Din guide till slots och casino utan spelpaus",
  description: "Hitta de bästa svenska casinon och lär dig allt om slots och casinospel online. Expertrecensioner, guider och tips för både nybörjare och erfarna spelare.",
  keywords: "slots, casino utan spelpaus, svenska casinon, casinobonusar sverige, slotskolan, spelautomater, casino online",
  authors: [{ name: "Slotskolan Team" }],
  creator: "Slotskolan",
  publisher: "Slotskolan",
  openGraph: {
    title: "Slotskolan - Din guide till slots och casino utan spelpaus",
    description: "Hitta de bästa svenska casinon och lär dig allt om slots och casinospel online. Expertrecensioner, guider och tips för både nybörjare och erfarna spelare.",
    url: "https://slotskolan.se",
    siteName: "Slotskolan",
    locale: "sv_SE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slotskolan - Din guide till slots och casino utan spelpaus",
    description: "Hitta de bästa svenska casinon och lär dig allt om slots och casinospel online. Expertrecensioner, guider och tips för både nybörjare och erfarna spelare.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://slotskolan.se",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        <AuthContext>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthContext>
      </body>
    </html>
  );
}
