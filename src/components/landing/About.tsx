import { motion } from 'framer-motion';
import { Headphones, Users, Mic, Award, Zap, Globe, TrendingUp, Music, Clock } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '5000+',
    label: 'Active Users',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  {
    icon: Clock,
    value: '12hrs',
    label: 'Daily Content',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  {
    icon: Mic,
    value: '50+',
    label: 'Content Creators',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
  {
    icon: Award,
    value: '99.9%',
    label: 'Uptime',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20'
  }
];

const highlights = [
  {
    icon: Globe,
    title: 'Global Recognition',
    description: 'Award-winning platform recognized for innovation in educational broadcasting'
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'Sub-second loading times with 99.9% uptime guarantee'
  },
  {
    icon: TrendingUp,
    title: 'Growing Community',
    description: 'Rapidly expanding user base with 200% growth year-over-year'
  },
  {
    icon: Music,
    title: 'Rich Content Library',
    description: 'Thousands of hours of educational and entertainment content'
  }
];

export function About() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900 to-primary-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1),transparent_60%)]" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 lg:order-1"
          >
            {/* Section Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-300 rounded-full text-sm font-medium border border-accent-500/30"
            >
              <Headphones className="w-4 h-4" />
              About Marconi
            </motion.div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-accent-200 bg-clip-text text-transparent">
                What is Marconi?
              </span>
            </h2>

            {/* Description */}
            <div className="space-y-4 sm:space-y-6">
              <p className="text-lg sm:text-xl text-white/80 font-body leading-relaxed">
                Marconi is Anurag University's <span className="text-accent-300 font-semibold">premier digital broadcasting platform</span>, 
                designed to connect our campus community through the power of audio and video streaming. Named after the 
                father of wireless communication, we carry forward the legacy of innovation.
              </p>
              <p className="text-base sm:text-lg text-white/70 font-body leading-relaxed">
                From daily music sessions to live academic discussions, cultural events to tech talks, 
                Marconi is your gateway to everything happening on campus. <span className="text-white font-medium">Built by students, for students.</span>
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
                    <highlight.icon className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white text-sm sm:text-base mb-1">
                      {highlight.title}
                    </h4>
                    <p className="text-white/60 text-xs sm:text-sm font-body leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 lg:mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className={`${stat.bgColor} rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-all duration-300 border border-white/10`}>
                    <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                  </div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white group-hover:text-accent-200 transition-colors duration-300">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm font-body">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Visual Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative lg:order-2"
          >
            {/* Main Container */}
            <div className="relative bg-gradient-to-br from-accent-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 backdrop-blur-lg border border-white/20 shadow-2xl">
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-accent-400/30 to-purple-500/30 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-cyan-500/30 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {/* Audio Visualization */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-white/10"
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/80 text-xs sm:text-sm font-medium">Live Audio</span>
                    </div>
                    <div className="flex items-end gap-1 h-16 sm:h-20">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-sm flex-1"
                          animate={{
                            height: [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 50}%`],
                          }}
                          transition={{
                            duration: 0.5 + Math.random() * 0.5,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Video Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-white/10"
                >
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-white/80 text-xs sm:text-sm font-medium">Live Video</span>
                    </div>
                    <div className="w-full h-16 sm:h-20 bg-gradient-to-br from-red-500/40 to-orange-500/40 rounded-xl relative overflow-hidden">
                      <motion.div
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* User Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-white/10 col-span-2"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/80 text-xs sm:text-sm font-medium">Active Listeners</span>
                    <span className="text-accent-300 text-xs sm:text-sm font-bold">2,847 online</span>
                  </div>
                  
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                          className={`w-8 h-8 rounded-full ${
                            i === 0 ? 'bg-accent-500' : i === 1 ? 'bg-purple-500' : 'bg-green-500'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="h-2 bg-white/20 rounded-full mb-1 w-3/4"></div>
                          <div className="h-1.5 bg-white/10 rounded-full w-1/2"></div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}