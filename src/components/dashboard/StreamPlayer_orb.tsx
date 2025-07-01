import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, Pause } from 'lucide-react';
import { useRadio } from '../../contexts/RadioContext';
import { radioService } from '../../services/appwrite';

export function StreamPlayer() {
  const { radioState, audioFiles, isLoading } = useRadio();
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const syncIntervalRef = useRef<number | null>(null);

  const currentTrack = radioState?.currentTrack;
  const isBroadcastActive = radioState?.isPlaying && currentTrack;

  // Calculate current broadcast position based on time elapsed since broadcast started
  const calculateCurrentPosition = (): number => {
    const actualDuration = audioRef.current?.duration;
    const databaseDuration = currentTrack?.duration || 0;
    
    const validDuration = (actualDuration && !isNaN(actualDuration) && actualDuration > 0) 
      ? actualDuration 
      : (databaseDuration > 0 ? databaseDuration : 0);
    
    if (!validDuration || !isBroadcastActive) {
      return 0;
    }

    if (radioState?.isScheduled && radioState.scheduledStartTime) {
      const position = radioService.calculateBroadcastPosition(
        radioState.scheduledStartTime,
        validDuration
      );
      return position;
    }

    const startTime = radioState?.broadcastStartTime || 
                     (radioState?.isPlaying ? radioState?.timestamp : null);
    
    if (!startTime) {
      return radioState?.currentTime || 0;
    }
    
    const position = radioService.calculateBroadcastPosition(
      startTime,
      validDuration
    );
    
    return position;
  };

  // Sync audio position with calculated broadcast position
  const syncAudioPosition = () => {
    if (!audioRef.current || !isBroadcastActive || isUserPaused) return;

    if (audioRef.current.readyState < 2) {
      return;
    }

    const targetPosition = calculateCurrentPosition();
    
    if (targetPosition === 0 && (!audioRef.current.duration || isNaN(audioRef.current.duration))) {
      return;
    }

    const currentAudioPosition = audioRef.current.currentTime || 0;
    const difference = Math.abs(targetPosition - currentAudioPosition);

    if (difference > 2) {
      audioRef.current.currentTime = targetPosition;
      console.log(`🔄 Synced audio: ${targetPosition.toFixed(1)}s (diff: ${difference.toFixed(1)}s)`);
    }
  };

  // Sync on mount and when track changes
  useEffect(() => {
    if (!currentTrack) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    if (audioRef.current && currentTrack) {
      const audioSrc = currentTrack.fileUrl;
      if (audioRef.current.src !== audioSrc) {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
      }

      const handleCanPlay = () => {
        if (audioRef.current && !isUserPaused && isBroadcastActive) {
          syncAudioPosition();
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(console.error);
        }
      };

      audioRef.current.addEventListener('canplay', handleCanPlay);
      
      if (isBroadcastActive) {
        syncIntervalRef.current = setInterval(syncAudioPosition, 5000);
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplay', handleCanPlay);
        }
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
          syncIntervalRef.current = null;
        }
      };
    }
  }, [currentTrack, isBroadcastActive, isUserPaused]);

  const handlePause = () => {
    setIsUserPaused(true);
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  };

  const handleResume = () => {
    setIsUserPaused(false);
    if (audioRef.current && currentTrack) {
      syncAudioPosition();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  // Debug helper to start a broadcast if none is active
  const startDebugBroadcast = async () => {
    if (!currentTrack && audioFiles.length > 0) {
      try {
        await radioService.updateRadioState({
          currentTrack: audioFiles[0],
          isPlaying: true,
          currentTime: 0,
          broadcastStartTime: new Date().toISOString(),
          timestamp: new Date().toISOString()
        });
        console.log('🎵 Debug broadcast started with first audio file');
      } catch (error) {
        console.error('Failed to start debug broadcast:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        {/* Inactive Orb */}
        <div className="relative mb-8">
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm border border-gray-500/20 flex items-center justify-center">
            <Radio className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-gray-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Scheduled Broadcast</h3>
        <p className="text-gray-400 text-lg mb-4">The radio station is currently offline. Check back during scheduled broadcast times.</p>
        
        {/* Debug: Start broadcast button if audio files are available */}
        {audioFiles.length > 0 && (
          <button
            onClick={startDebugBroadcast}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Start Test Broadcast
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="orb-center-absolute">
      {/* Main Orb Container - Perfectly centered and responsive */}
      <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-full flex items-center justify-center"
        >

          {/* Beautiful Animated Orb - Enhanced with color changing and rotation */}
          <motion.div
            className="absolute w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden left-1/2 top-1/2 no-layout-shift"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: "linear" }
            }}
          >
            {/* Animated Background with Color Changing */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: [
                  `radial-gradient(circle at 30% 30%, 
                    hsla(260, 80%, 75%, 0.9),
                    hsla(220, 90%, 65%, 0.8),
                    hsla(200, 85%, 55%, 0.95))`,
                  `radial-gradient(circle at 40% 20%, 
                    hsla(300, 80%, 75%, 0.9),
                    hsla(260, 90%, 65%, 0.8),
                    hsla(220, 85%, 55%, 0.95))`,
                  `radial-gradient(circle at 20% 40%, 
                    hsla(200, 80%, 75%, 0.9),
                    hsla(300, 90%, 65%, 0.8),
                    hsla(260, 85%, 55%, 0.95))`,
                  `radial-gradient(circle at 30% 30%, 
                    hsla(260, 80%, 75%, 0.9),
                    hsla(220, 90%, 65%, 0.8),
                    hsla(200, 85%, 55%, 0.95))`
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                boxShadow: `
                  0 0 100px hsla(260, 80%, 70%, 0.8),
                  0 0 200px hsla(220, 90%, 60%, 0.6),
                  0 0 300px hsla(200, 85%, 50%, 0.4),
                  inset 0 0 120px rgba(255, 255, 255, 0.15)
                `
              }}
            />

            {/* Inner Rotating Ring */}
            <motion.div
              className="absolute inset-4 rounded-full border-2"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                background: 'transparent'
              }}
              animate={{
                rotate: -360,
                borderColor: [
                  'rgba(255, 255, 255, 0.3)',
                  'rgba(168, 85, 247, 0.5)',
                  'rgba(59, 130, 246, 0.5)',
                  'rgba(236, 72, 153, 0.5)',
                  'rgba(255, 255, 255, 0.3)'
                ]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                borderColor: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
            />

            {/* Floating Particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: '3px',
                  height: '3px',
                  background: `hsla(${200 + i * 20}, 80%, 80%, 0.8)`,
                  left: `${30 + Math.sin(i * 0.785) * 25}%`,
                  top: `${30 + Math.cos(i * 0.785) * 25}%`,
                  filter: 'blur(0.5px)',
                }}
                animate={{
                  x: [0, Math.sin(i * 0.8) * 15, 0],
                  y: [0, Math.cos(i * 0.8) * 15, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
            {/* Track Cover */}
            {currentTrack.coverImageUrl ? (
              <img
                src={currentTrack.coverImageUrl}
                alt={currentTrack.songName}
                className="absolute inset-16 w-48 h-48 rounded-full object-cover no-layout-shift"
                style={{
                  filter: `brightness(1.2) contrast(1.1)`,
                  opacity: 0.8,
                }}
              />
            ) : (
              <div className="absolute inset-16 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 flex items-center justify-center backdrop-blur-sm">
                <div className="no-layout-shift">
                  <Radio className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-white/90" />
                </div>
              </div>
            )}

            {/* Enhanced Play/Pause Button - No scaling animations */}
            <button
              onClick={isUserPaused || !isPlaying ? handleResume : handlePause}
              disabled={!currentTrack}
              className="absolute inset-0 flex items-center justify-center group z-10 no-layout-shift"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-500 no-layout-shift"
                style={{
                  background: `radial-gradient(circle, 
                    rgba(255, 255, 255, 0.2),
                    rgba(168, 85, 247, 0.1))`,
                  borderColor: `rgba(255, 255, 255, 0.5)`,
                  boxShadow: `
                    0 0 40px rgba(255, 255, 255, 0.4),
                    inset 0 0 20px rgba(255, 255, 255, 0.1)
                  `
                }}
              >
                <div className="no-layout-shift">
                  {isUserPaused || !isPlaying ? (
                    <Play className="h-10 w-10 text-white ml-1 drop-shadow-lg" />
                  ) : (
                    <Pause className="h-10 w-10 text-white drop-shadow-lg" />
                  )}
                </div>
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            const audioDuration = audioRef.current.duration;
            audioRef.current.volume = 0.5; // Default volume
            
            console.log('🎵 Audio loaded:', {
              fileName: currentTrack?.fileName,
              songName: currentTrack?.songName,
              databaseDuration: currentTrack?.duration,
              actualAudioDuration: audioDuration,
              durationMismatch: currentTrack?.duration !== audioDuration
            });
            
            if (currentTrack && Math.abs((currentTrack.duration || 0) - audioDuration) > 1) {
              console.warn('⚠️ Duration mismatch detected - database should be updated');
            }
          }
        }}
      />
    </div>
  );
}
