import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="black" />
          <circle cx="35" cy="40" r="8" fill="white" />
          <circle cx="65" cy="40" r="8" fill="white" />
          <path
            d="M35 60 Q50 70 65 60"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M20 30 Q10 40 15 60"
            stroke="black"
            strokeWidth="12"
            fill="none"
            className="tentacle"
          />
          <path
            d="M80 30 Q90 40 85 60"
            stroke="black"
            strokeWidth="12"
            fill="none"
            className="tentacle"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight leading-none">
          <span className="text-[#FFD700]">PEDAGO</span>
          <span className="text-[#FF69B4]">IA</span>
        </h1>
        <p className="text-sm text-muted-foreground italic">L'éducation simplifiée</p>
      </div>
    </div>
  );
}