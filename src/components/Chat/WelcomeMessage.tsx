import React from 'react';
import GridPattern from '../ui/grid-pattern';

export function WelcomeMessage() {
  return (
    <div className="relative p-6 md:p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl mb-6 border border-primary/10 shadow-premium backdrop-blur-md overflow-hidden">
      <GridPattern
        squares={[
          [1, 1],
          [2, 2],
          [4, 3],
        ]}
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(350px_circle_at_center,white,transparent)]"
      />
      <h2 className="text-xl md:text-3xl font-light text-foreground mb-4 tracking-tight">
        Bonjour, je suis Élia, votre assistante pédagogique
      </h2>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed tracking-wide">
        Je peux vous aider sur tous les aspects de votre métier.
        Posez simplement votre question !
      </p>
    </div>
  );
}