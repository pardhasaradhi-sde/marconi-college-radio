import { motion } from 'framer-motion';
import { Play, Video, Radio, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-24 sm:pt-28 lg:pt-32">
      {/* Enhanced Background gradient with mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.2),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(26,115,232,0.3),transparent_70%)]" />
      
      {/* Floating Elements Grid */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Larger floating elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute w-3 h-3 bg-white/10 rounded-full blur-sm"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {/* Smaller sparkling elements */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`small-${i}`}
            className="absolute w-1 h-1 bg-accent-400/60 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 text-center max-w-7xl mx-auto w-full">
        <div className="max-w-4xl mx-auto">
          {/* Logo with enhanced animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
            className="mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-accent-500/25 border border-accent-400/20">
              <Radio className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          {/* Enhanced Title with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-heading font-bold mb-4 sm:mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-white to-accent-200 bg-clip-text text-transparent drop-shadow-2xl">
              Marconi
            </span>
          </motion.h1>

          {/* Enhanced Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-3 sm:mb-4"
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-body font-medium leading-relaxed">
              The Official Broadcast Hub of{' '}
              <span className="text-accent-300 font-semibold">Anurag University</span>
            </p>
          </motion.div>

          {/* Enhanced Subtitle with icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto font-body leading-relaxed mb-4">
              Listen to scheduled streams, watch exclusive college events, and stay updated with campus stories.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm sm:text-base text-white/60">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-accent-400" />
                <span>Live Audio</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-accent-400" />
                <span>Video Streams</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span>Campus Events</span>
              </div>
            </div>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center mb-6 sm:mb-8"
          >
            <Button 
              variant="primary" 
              size="lg" 
              icon={Play} 
              onClick={onGetStarted}
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-2xl shadow-accent-500/25 hover:shadow-accent-500/40 transition-all duration-300 transform hover:scale-105"
            >
              🎧 Start Listening
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              icon={Video}
              onClick={onGetStarted}
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
            >
              📺 Watch Live Stream
            </Button>
          </motion.div>

          {/* Enhanced Note with security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-white/70 font-body">
              Available exclusively to AU email holders
            </span>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}