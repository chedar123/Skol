import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forum | Slotskolan',
  description: 'Diskutera spelautomater, casinon och strategier med andra spelare i vårt forum.',
};

export default function ForumRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-6">
      {children}
    </div>
  );
} 