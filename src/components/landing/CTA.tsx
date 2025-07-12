import { motion } from 'framer-motion';
import { ArrowRight, Shield, Sparkles, Users, Zap, Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface CTAProps {
  onGetStarted: () => void;
}

export function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900 to-accent-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_70%)]" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent-400/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `100%`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative bg-white/5 backdrop-blur-lg rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Decorative Elements */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-accent-400/20 to-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl"
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6 sm:mb-8"
            >
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent-500/30 to-purple-500/30 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-white/30 shadow-2xl">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white drop-shadow-lg" />
                
                {/* Floating Stars */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.7,
                    }}
                    className="absolute"
                    style={{
                      top: `${10 + i * 15}%`,
                      right: `${-20 - i * 10}%`,
                    }}
                  >
                    <Star className="w-4 h-4 text-accent-300" fill="currentColor" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-transparent">
                Ready to Tune In?
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-6 sm:mb-8 font-body max-w-3xl mx-auto leading-relaxed"
            >
              Join thousands of students and faculty already enjoying exclusive campus content. 
              Your AU email is your key to the <span className="text-accent-300 font-semibold">future of campus broadcasting.</span>
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
            >
              {[
                { icon: Users, text: '5000+ Users' },
                { icon: Zap, text: 'Instant Access' },
                { icon: Sparkles, text: 'Premium Content' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 text-sm sm:text-base text-white/80 hover:bg-white/15 transition-all duration-300"
                >
                  <feature.icon className="w-4 h-4 text-accent-400" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mb-6 sm:mb-8"
            >
              <Button 
                variant="primary" 
                size="lg" 
                icon={ArrowRight}
                iconPosition="right"
                onClick={onGetStarted}
                className="text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-5 shadow-2xl shadow-accent-500/30 hover:shadow-accent-500/50 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Get Started Now
              </Button>
            </motion.div>
            
            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full border border-green-400/30 backdrop-blur-sm"
            >
              <Shield size={18} className="text-green-400" />
              <span className="text-white/80 text-sm sm:text-base font-medium">
                Secure • Exclusive • Free for AU Community
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-6 sm:mt-8 text-xs sm:text-sm text-white/50 font-body"
            >
              <p>No credit card required • Instant activation • 24/7 support</p>
            </motion.div>
          </div>

          {/* Shine Effect */}
          <motion.div
            initial={{ x: '-100%' }}
            whileInView={{ x: '100%' }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
          />
        </motion.div>
      </div>
    </section>
  );
}