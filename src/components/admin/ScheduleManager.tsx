import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, Edit2, Trash2, Radio, Video } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useStream } from '../../contexts/StreamContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export function ScheduleManager() {
  const { schedule, updateSchedule } = useStream();
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getSlotContent = (day: string, time: string) => {
    return schedule.find(item => 
      item.day === day && 
      item.startTime <= time && 
      item.endTime > time
    );
  };

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
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Schedule Manager</h2>
          <p className="text-white/60 font-body">Plan and organize your broadcasting schedule</p>
        </div>
        <Button variant="primary" icon={Plus}>
          Add Schedule
        </Button>
      </div>

      {/* Weekly Grid */}
      <Card glass className="p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2">
            {/* Header */}
            <div className="p-3 text-center">
              <span className="text-white/60 font-body text-sm">Time</span>
            </div>
            {days.map(day => (
              <div key={day} className="p-3 text-center">
                <span className="text-white font-heading font-semibold">{day.slice(0, 3)}</span>
              </div>
            ))}

            {/* Time Slots */}
            {timeSlots.map(time => (
              <React.Fragment key={time}>
                <div className="p-3 text-center border-r border-white/10">
                  <span className="text-white/60 font-body text-sm">{time}</span>
                </div>
                {days.map(day => {
                  const content = getSlotContent(day, time);
                  
                  return (
                    <motion.div
                      key={`${day}-${time}`}
                      className={`p-2 min-h-[60px] rounded-lg border border-white/10 cursor-pointer transition-all hover:border-white/30 ${
                        content ? getTypeColor(content.type) : 'bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedSlot({ day, time })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {content && (
                        <div className="text-white">
                          <div className="flex items-center gap-1 mb-1">
                            {React.createElement(getTypeIcon(content.type), { size: 12 })}
                            <span className="text-xs font-body truncate">{content.title}</span>
                          </div>
                          <div className="text-xs opacity-80 font-body">
                            {content.startTime} - {content.endTime}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>

      {/* Schedule List */}
      <Card glass className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-heading font-semibold text-white">Current Schedule</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-white/60 text-sm font-body">Audio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-white/60 text-sm font-body">Video</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span className="text-white/60 text-sm font-body">Ads</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {schedule.map((item, index) => {
            const IconComponent = getTypeIcon(item.type);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
              >
                <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-heading font-semibold text-white">{item.title}</h4>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60 font-body">
                      {item.day}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60 font-body">
                    <span>{item.startTime} - {item.endTime}</span>
                    {item.host && <span>by {item.host}</span>}
                    <span>{item.duration} min</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={Edit2}>
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={Trash2}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}