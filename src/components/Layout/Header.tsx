import React from 'react';
import { Logo } from '../Logo/Logo';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#1E1E1E] text-white border-b border-white/10 transition-all duration-300 h-16">
      <div className="h-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center h-16 transition-all duration-300">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <Logo className="w-10 h-10 md:w-14 md:h-14 -ml-1 filter drop-shadow-xl" />
            </div>
            <h1 className="ml-2 text-lg md:text-2xl font-medium text-white truncate tracking-wide font-andika drop-shadow-md">
              Élia, votre assistant pédagogique IA
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}