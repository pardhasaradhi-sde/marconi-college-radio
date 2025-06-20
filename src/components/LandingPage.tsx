import React from 'react';
import { Hero } from './landing/Hero';
import { About } from './landing/About';
import { Features } from './landing/Features';
import { CTA } from './landing/CTA';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900">
      <Hero onGetStarted={onGetStarted} />
      <About />
      <Features />
      <CTA onGetStarted={onGetStarted} />
    </div>
  );
}