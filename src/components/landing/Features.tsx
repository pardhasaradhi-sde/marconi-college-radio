import { motion } from 'framer-motion';
import { Radio, Video, Shield, Calendar, Settings, Clock, Users, Zap, Heart, Globe } from 'lucide-react';
import { Card } from '../ui/Card';

const features = [
  {
    icon: Radio,
    title: '8-12 Hour Daily Audio Stream',
    description: 'Continuous music, talks, and campus content throughout college hours with crystal-clear quality',
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-400/30'
  },
  {
    icon: Video,
    title: 'Weekly Live Video Broadcast',
    description: 'Exclusive HD video content, events, and interactive sessions with real-time chat',
    color: 'text-red-400',
    bgColor: 'from-red-500/20 to-red-600/20',
    borderColor: 'border-red-400/30'
  },
  {
    icon: Shield,
    title: 'AU Email-Only Access',
    description: 'Secure, encrypted platform exclusively for Anurag University community members',
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-green-600/20',
    borderColor: 'border-green-400/30'
  },
  {
    icon: Calendar,
    title: 'Real-Time Schedule',
    description: 'Smart scheduling system with notifications and personalized recommendations',
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-400/30'
  },
  {
    icon: Settings,
    title: 'Advanced Admin Dashboard',
    description: 'Comprehensive management tools with analytics and content moderation features',
    color: 'text-orange-400',
    bgColor: 'from-orange-500/20 to-orange-600/20',
    borderColor: 'border-orange-400/30'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock access with offline mode and synchronized playback across devices',
    color: 'text-cyan-400',
    bgColor: 'from-cyan-500/20 to-cyan-600/20',
    borderColor: 'border-cyan-400/30'
  },
  {
    icon: Users,
    title: 'Community Features',
    description: 'Connect with peers, join discussions, and participate in live polls and events',
    color: 'text-pink-400',
    bgColor: 'from-pink-500/20 to-pink-600/20',
    borderColor: 'border-pink-400/30'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized streaming with instant loading and minimal buffering for seamless experience',
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-yellow-600/20',
    borderColor: 'border-yellow-400/30'
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 to-primary-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.1),transparent_70%)]" />
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-accent-500/5 to-purple-500/5 blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 sm:mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-300 rounded-full text-sm font-medium border border-accent-500/30">
              <Globe className="w-4 h-4" />
              Platform Features
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-white via-white to-accent-200 bg-clip-text text-transparent">
              Why Choose Marconi?
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto font-body leading-relaxed"
          >
            Experience the future of campus broadcasting with our feature-rich platform designed for the modern university community
          </motion.p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.6,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <Card 
                glass 
                hover 
                className={`p-6 sm:p-8 h-full relative overflow-hidden border-2 ${feature.borderColor} hover:border-opacity-50 transition-all duration-300`}
              >
                {/* Card Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Enhanced Icon Container */}
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 mb-4 sm:mb-6 ${feature.color} backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300 shadow-lg`}
                  >
                    <feature.icon size={32} className="sm:w-10 sm:h-10" />
                  </motion.div>
                  
                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 sm:mb-4 group-hover:text-accent-200 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/70 font-body leading-relaxed text-sm sm:text-base group-hover:text-white/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500/20 to-purple-500/20 rounded-full border border-accent-400/30 backdrop-blur-md">
            <span className="text-white/80 font-body text-sm sm:text-base">
              🚀 Ready to experience the future of campus broadcasting?
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}