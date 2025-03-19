import React from 'react';

export default function CasinoguiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 