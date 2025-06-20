import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Users, Mic } from 'lucide-react';

export function About() {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900 to-primary-950" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
              What is Marconi?
            </h2>
            <p className="text-lg text-white/70 font-body leading-relaxed">
              Marconi is Anurag University's premier digital broadcasting platform, designed to connect 
              our campus community through the power of audio and video streaming. Named after the 
              father of wireless communication, we carry forward the legacy of innovation.
            </p>
            <p className="text-lg text-white/70 font-body leading-relaxed">
              From daily music sessions to live academic discussions, cultural events to tech talks, 
              Marconi is your gateway to everything happening on campus. Built by students, for students.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-accent-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-accent-400" />
                </div>
                <p className="text-2xl font-heading font-bold text-white">5000+</p>
                <p className="text-white/60 text-sm font-body">Active Users</p>
              </div>
              <div className="text-center">
                <div className="bg-accent-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Headphones className="h-8 w-8 text-accent-400" />
                </div>
                <p className="text-2xl font-heading font-bold text-white">12hrs</p>
                <p className="text-white/60 text-sm font-body">Daily Content</p>
              </div>
              <div className="text-center">
                <div className="bg-accent-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Mic className="h-8 w-8 text-accent-400" />
                </div>
                <p className="text-2xl font-heading font-bold text-white">50+</p>
                <p className="text-white/60 text-sm font-body">Content Creators</p>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-accent-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="w-full h-24 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/20 rounded w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="w-full h-24 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-xl mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/20 rounded w-2/3"></div>
                    <div className="h-2 bg-white/20 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-accent-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-2 bg-white/20 rounded w-1/3 mb-1"></div>
                      <div className="h-1.5 bg-white/10 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-16 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-xl"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}