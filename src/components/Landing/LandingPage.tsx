import React from 'react';
import { HeroSection } from './HeroSection';
import ChallengesAndSolutions from './ChallengesSection';
import { MetricsSection } from './MetricsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { CTASection } from './CTASection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ChallengesAndSolutions />
      <MetricsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}