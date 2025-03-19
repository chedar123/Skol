"use client";

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="bg-[hsl(var(--light-pink))] py-2 mb-6 rounded-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center text-sm">
          {items.map((item, index) => (
            <React.Fragment key={item.href}>
              {index > 0 && <span className="text-gray-400 mx-1">&raquo;</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-600">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] transition-colors">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
} 