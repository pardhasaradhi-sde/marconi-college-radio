import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Stream {
  id: string;
  title: string;
  type: 'audio' | 'video';
  isLive: boolean;
  viewers: number;
  duration: string;
  host: string;
  thumbnail?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'ad';
  day: string;
  startTime: string;
  endTime: string;
  host?: string;
  duration: number;
}

interface StreamContextType {
  currentStream: Stream | null;
  schedule: ScheduleItem[];
  isPlaying: boolean;
  volume: number;
  setCurrentStream: (stream: Stream | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  updateSchedule: (items: ScheduleItem[]) => void;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

interface StreamProviderProps {
  children: ReactNode;
}

export function StreamProvider({ children }: StreamProviderProps) {
  const [currentStream, setCurrentStream] = useState<Stream | null>({
    id: '1',
    title: 'Morning Campus Vibes',
    type: 'audio',
    isLive: true,
    viewers: 247,
    duration: '2:34:12',
    host: 'DJ Rohan',
  });
  
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    {
      id: '1',
      title: 'Morning Campus Vibes',
      type: 'audio',
      day: 'Monday',
      startTime: '08:00',
      endTime: '10:00',
      host: 'DJ Rohan',
      duration: 120
    },
    {
      id: '2',
      title: 'Tech Talk Tuesday',
      type: 'video',
      day: 'Tuesday',
      startTime: '16:00',
      endTime: '17:00',
      host: 'Prof. Sharma',
      duration: 60
    },
    {
      id: '3',
      title: 'Study Session Beats',
      type: 'audio',
      day: 'Wednesday',
      startTime: '14:00',
      endTime: '16:00',
      host: 'DJ Priya',
      duration: 120
    },
    {
      id: '4',
      title: 'Weekly Campus News',
      type: 'video',
      day: 'Friday',
      startTime: '18:00',
      endTime: '19:00',
      host: 'Media Club',
      duration: 60
    }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);

  const updateSchedule = (items: ScheduleItem[]) => {
    setSchedule(items);
  };

  return (
    <StreamContext.Provider value={{
      currentStream,
      schedule,
      isPlaying,
      volume,
      setCurrentStream,
      setIsPlaying,
      setVolume,
      updateSchedule
    }}>
      {children}
    </StreamContext.Provider>
  );
}

export function useStream() {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
}