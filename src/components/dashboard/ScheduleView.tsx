import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Radio, Video, Filter } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useStream } from '../../contexts/StreamContext';
import { format, parseISO } from 'date-fns';

export function ScheduleView() {
  const { schedule } = useStream();
  const [filter, setFilter] = useState<'all' | 'audio' | 'video'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredSchedule = schedule.filter(item => 
    filter === 'all' || item.type === filter
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audio': return 'bg-blue-500';
      case 'video': return 'bg-red-500';
      case 'ad': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': 
      default: return Radio;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Schedule</h2>
          <p className="text-white/60 font-body">Stay updated with upcoming streams and events</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-sm font-body transition-all ${
                filter === 'all' ? 'bg-accent-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('audio')}
              className={`px-3 py-1 rounded text-sm font-body transition-all ${
                filter === 'audio' ? 'bg-blue-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Audio
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-3 py-1 rounded text-sm font-body transition-all ${
                filter === 'video' ? 'bg-red-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Video
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid gap-4">
        {filteredSchedule.map((item, index) => {
          const IconComponent = getTypeIcon(item.type);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glass hover className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-heading font-semibold text-white">{item.title}</h3>
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60 font-body">
                        {item.day}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60 font-body">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{item.startTime} - {item.endTime}</span>
                      </div>
                      {item.host && (
                        <span>by {item.host}</span>
                      )}
                      <span>{item.duration} min</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    Notify Me
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredSchedule.length === 0 && (
        <Card glass className="p-8 text-center">
          <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 font-body">No scheduled content for the selected filter.</p>
        </Card>
      )}
    </div>
  );
}