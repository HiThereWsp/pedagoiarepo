import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BrandProps {
  className?: string;
}

export function Brand({ className }: BrandProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="p-2 bg-primary/10 rounded-xl">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-foreground">Élia</h1>
        <p className="text-sm text-muted-foreground">Assistant pédagogique IA</p>
      </div>
    </div>
  );
}