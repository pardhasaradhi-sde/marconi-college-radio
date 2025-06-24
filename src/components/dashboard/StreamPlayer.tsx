import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, VolumeX, 
  Heart, MessageCircle, Share2, Radio, Repeat, Clock
} from 'lucide-react';
import { useRadio } from '../../contexts/RadioContext';

export function StreamPlayer() {
  const { radioState, isLoading } = useRadio();
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [reactions, setReactions] = useState({ hearts: 247, comments: 89, shares: 34 });
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = radioState?.currentTrack;
  const isPlaying = radioState?.isPlaying || false;

  // Update audio element when radio state changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.fileUrl;
      audioRef.current.currentTime = radioState?.currentTime || 0;
      audioRef.current.loop = true; // Enable looping
      
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying, radioState?.currentTime]);

  // Update time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => {
      // The loop attribute will handle replay automatically
      setCurrentTime(0);
    });

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [currentTrack]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleReaction = (type: 'hearts' | 'comments' | 'shares') => {
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    
    if (type === 'hearts') {
      setIsLiked(!isLiked);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-white/60 font-body">Loading stream...</p>
        </div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-md mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Radio className="h-16 w-16 text-white/40" />
            </div>
            <h3 className="text-3xl font-heading font-bold text-white mb-4">
              Welcome to Marconi Radio
            </h3>
            <p className="text-white/60 font-body text-lg">
              No music is currently playing. Admins can start the broadcast from their dashboard.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 md:p-6">
      {/* Boxed Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
      >
        {/* Main Player Content */}
        <div className="flex flex-col items-center text-center p-6 md:p-10">        {/* Large Album Art */}
        <div className="w-72 h-72 md:w-80 md:h-80 bg-white/5 rounded-3xl overflow-hidden shadow-2xl mb-6 relative group">
          {currentTrack.coverImageUrl ? (
            <img
              src={currentTrack.coverImageUrl}
              alt={currentTrack.songName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-800/50 to-accent-800/50">
              <Radio className="h-20 w-20 text-white/40" />
            </div>
          )}
          
          {/* Live Indicator Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/90 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">LIVE</span>
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-6 w-full">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 leading-tight">
            {currentTrack.songName || currentTrack.fileName}
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-body mb-4">
            {currentTrack.artist || 'Unknown Artist'}
          </p>          
          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isPlaying ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
              }`}></div>
              <span className="font-medium">
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-accent-400 text-sm">
              <Repeat className="h-4 w-4" />
              <span>Loop</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock className="h-4 w-4" />
              <span>Auto-loop</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-lg mx-auto mb-4">
            <div className="flex items-center gap-4 text-sm text-white/60 mb-2">
              <span className="w-12 text-right">{formatTime(currentTime)}</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>
              <span className="w-12">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between w-full max-w-2xl gap-6">
          {/* Social Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('hearts')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                isLiked 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-white/5 text-white/60 hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{reactions.hearts}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('comments')}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{reactions.comments}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('shares')}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 text-white/60 hover:text-green-400 hover:bg-green-500/10 transition-all"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">{reactions.shares}</span>
            </motion.button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (audioRef.current) {
                  audioRef.current.volume = isMuted ? volume / 100 : 0;
                }
              }}
              className="text-white/60 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            
            <div className="flex items-center gap-2 w-28">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <span className="text-xs text-white/60 w-8">{isMuted ? 0 : volume}</span>
            </div>
          </div>
        </div>
        </div>
      </motion.div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        className="hidden"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
      />
    </div>
  );
}
