"use client";

import React from 'react';
import GlobalHeader from '@/components/layout/Header';
import GlobalFooter from '@/components/layout/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalHeader />
      {children}
      <GlobalFooter />
    </div>
  );
} 