import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

interface CTAProps {
  onGetStarted: () => void;
}

export function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900 to-accent-900" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-500/20 rounded-full mb-6">
              <Shield className="h-10 w-10 text-accent-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Ready to Tune In?
            </h2>
            <p className="text-xl text-white/70 mb-8 font-body max-w-2xl mx-auto">
              Join thousands of students and faculty already enjoying exclusive campus content. 
              Your AU email is your key to the future of campus broadcasting.
            </p>
          </div>

          <div className="space-y-6">
            <Button 
              variant="primary" 
              size="lg" 
              icon={ArrowRight}
              iconPosition="right"
              onClick={onGetStarted}
              className="text-lg px-12 py-4"
            >
              Get Started Now
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-body">
              <Shield size={16} />
              <span>Secure • Exclusive • Free for AU Community</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}