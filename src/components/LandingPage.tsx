import { motion } from 'framer-motion';
import { Hero } from './landing/Hero';
import { About } from './landing/About';
import { Features } from './landing/Features';
import { CTA } from './landing/CTA';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900 overflow-x-hidden"
    >
      {/* Navigation Dots for Desktop */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {['Hero', 'About', 'Features', 'CTA'].map((section) => (
          <motion.button
            key={section}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/60 transition-all duration-300 border border-white/50"
            onClick={() => {
              const element = document.getElementById(section.toLowerCase());
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            title={section}
          />
        ))}
      </div>

      {/* Page Sections */}
      <div id="hero">
        <Hero onGetStarted={onGetStarted} />
      </div>
      
      <div id="about">
        <About />
      </div>
      
      <div id="features">
        <Features />
      </div>
      
      <div id="cta">
        <CTA onGetStarted={onGetStarted} />
      </div>

      {/* Footer */}
      <footer className="bg-primary-950/80 backdrop-blur-sm border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-white/80 font-heading font-semibold text-lg">Marconi</p>
              <p className="text-white/60 text-sm font-body">The Official Broadcast Hub of Anurag University</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/60 font-body">
              <span>© 2025 Anurag University</span>
              <span>•</span>
              <span>Made with ❤️ by AU Students</span>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}