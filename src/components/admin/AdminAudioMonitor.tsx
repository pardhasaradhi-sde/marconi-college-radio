import { useState, useRef, useEffect } from 'react';
import { Music } from 'lucide-react';
import { useRadio } from '../../contexts/RadioContext';

interface AdminAudioMonitorProps {
  className?: string;
}

export function AdminAudioMonitor({ className = '' }: AdminAudioMonitorProps) {
  const { radioState } = useRadio();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = radioState?.currentTrack;

  // Load track for monitoring only (always muted)
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.fileUrl;
      audioRef.current.volume = 0;
      audioRef.current.muted = true;
      
      // Only play for monitoring if radio is active
      if (radioState?.isPlaying) {
        audioRef.current.play().catch(() => {
          // Ignore auto-play errors - this is just for monitoring
        });
      }
    }
  }, [currentTrack, radioState?.isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 ${className}`}>
      {/* Monitoring Notice */}
      <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-md">
        <p className="text-blue-400 text-xs font-medium">
          📻 Admin Monitor - This shows what's currently being broadcast to users
        </p>
      </div>
      
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        loop
        muted // Always muted for admin monitoring
      />
      
      <div className="flex items-center gap-4">
        {/* Cover Art */}
        <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
          {currentTrack.coverImageUrl ? (
            <img
              src={currentTrack.coverImageUrl}
              alt={currentTrack.songName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="h-6 w-6 text-white/40" />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">
            {currentTrack.songName || currentTrack.fileName}
          </h4>
          <p className="text-white/60 text-sm truncate">
            {currentTrack.artist || 'Unknown Artist'}
          </p>
          <p className="text-white/40 text-xs mt-1">
            Status: {radioState?.isPlaying ? 'Broadcasting' : 'Scheduled'} • Monitor Only
          </p>
        </div>
      </div>

      {/* Progress Bar (View Only) */}
      <div className="mt-3 space-y-1">
        <div className="w-full h-1 bg-white/20 rounded-full">
          <div
            className="h-full bg-accent-500 rounded-full transition-all duration-100"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
