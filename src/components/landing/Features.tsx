import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Video, Shield, Calendar, Settings, Clock } from 'lucide-react';
import { Card } from '../ui/Card';

const features = [
  {
    icon: Radio,
    title: '8-12 Hour Daily Audio Stream',
    description: 'Continuous music, talks, and campus content throughout college hours',
    color: 'text-blue-400'
  },
  {
    icon: Video,
    title: 'Weekly Live Video Broadcast',
    description: 'Exclusive video content, events, and interactive sessions',
    color: 'text-red-400'
  },
  {
    icon: Shield,
    title: 'AU Email-Only Access',
    description: 'Secure platform exclusively for Anurag University community',
    color: 'text-green-400'
  },
  {
    icon: Calendar,
    title: 'Real-Time Schedule',
    description: 'Always know what\'s playing next with our live schedule',
    color: 'text-purple-400'
  },
  {
    icon: Settings,
    title: 'Admin Dashboard',
    description: 'Comprehensive management tools for content creators',
    color: 'text-orange-400'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Access your favorite campus content anytime, anywhere',
    color: 'text-cyan-400'
  }
];

export function Features() {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 to-primary-900" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
          >
            Why Choose Marconi?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto font-body"
          >
            Experience the future of campus broadcasting with our feature-rich platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glass hover className="p-6 h-full">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4 ${feature.color}`}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 font-body">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}