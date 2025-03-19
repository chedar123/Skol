"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  onClick?: () => void;
}

export default function NavLink({
  href,
  children,
  className = '',
  activeClassName = 'text-pink-600',
  exact = false,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact 
    ? pathname === href
    : pathname.startsWith(href) && (href !== '/' || pathname === '/');
  
  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`;

  return (
    <Link 
      href={href} 
      className={combinedClassName}
      onClick={onClick}
    >
      {children}
    </Link>
  );
} 