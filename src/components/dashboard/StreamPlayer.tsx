import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, Pause } from 'lucide-react';
import { useRadio } from '../../contexts/RadioContext';
import { radioService } from '../../services/appwrite';

export function StreamPlayer() {
  const { radioState, isLoading } = useRadio();
  const [volume] = useState(50);
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
    if (!isBroadcastActive || isUserPaused) {
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
        if (audioRef.current && !isUserPaused) {
          syncAudioPosition();
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(console.error);
        }
      };

      audioRef.current.addEventListener('canplay', handleCanPlay);
      
      syncIntervalRef.current = setInterval(syncAudioPosition, 5000);

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
    if (isBroadcastActive && audioRef.current) {
      syncAudioPosition();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
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
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        {/* Inactive Orb */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-96 h-96 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-700/20 blur-3xl"
          />
          
          <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-gray-600/30 to-gray-800/30 backdrop-blur-sm border border-gray-500/30 flex items-center justify-center shadow-2xl">
            <Radio className="h-20 w-20 text-gray-400" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      {/* Ultra Advanced Orb Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative"
      >
        {/* Quantum Particle Ring System */}
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              background: `linear-gradient(45deg, 
                hsl(${260 + i * 15}, 80%, 70%), 
                hsl(${200 + i * 10}, 90%, 80%))`,
              filter: 'blur(0.5px)',
            }}
            animate={{
              x: [0, Math.cos(i * (360/16) * Math.PI / 180) * (250 + Math.sin(Date.now() * 0.001 + i) * 50)],
              y: [0, Math.sin(i * (360/16) * Math.PI / 180) * (250 + Math.cos(Date.now() * 0.001 + i) * 50)],
              scale: [0.3, 1.5, 0.3],
              opacity: [0.2, 1, 0.2],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}

        {/* Floating Energy Spheres */}
        {isPlaying && Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`sphere-${i}`}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: `radial-gradient(circle, 
                rgba(168, 85, 247, 0.8), 
                rgba(59, 130, 246, 0.6),
                transparent)`,
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 300, 0],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 300, 0],
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}

        {/* Quantum Energy Rings */}
        <motion.div
          className="absolute inset-0 w-[600px] h-[600px]"
          style={{ left: '50%', top: '50%', marginLeft: -300, marginTop: -300 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(from 0deg, 
                rgba(147, 51, 234, 0.1) 0deg,
                rgba(59, 130, 246, 0.3) 60deg,
                rgba(6, 182, 212, 0.2) 120deg,
                rgba(236, 72, 153, 0.25) 180deg,
                rgba(168, 85, 247, 0.15) 240deg,
                rgba(124, 58, 237, 0.3) 300deg,
                rgba(147, 51, 234, 0.1) 360deg)`,
              filter: 'blur(3px)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Middle Quantum Ring */}
        <motion.div
          className="absolute inset-0 w-[450px] h-[450px]"
          style={{ left: '50%', top: '50%', marginLeft: -225, marginTop: -225 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(from 90deg, 
                rgba(59, 130, 246, 0.2) 0deg,
                rgba(168, 85, 247, 0.35) 90deg,
                rgba(236, 72, 153, 0.25) 180deg,
                rgba(6, 182, 212, 0.3) 270deg,
                rgba(59, 130, 246, 0.2) 360deg)`,
              filter: 'blur(2px)'
            }}
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.7
            }}
          />
        </motion.div>

        {/* Quantum Ripple Effects */}
        {isPlaying && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`quantum-ripple-${i}`}
            className="absolute rounded-full border"
            style={{
              width: `${350 + i * 60}px`,
              height: `${350 + i * 60}px`,
              left: '50%',
              top: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              borderColor: `hsla(${260 + i * 20}, 80%, 70%, ${0.4 - i * 0.05})`,
              filter: 'blur(1px)',
            }}
            animate={{
              scale: [0.8, 1.4, 0.8],
              opacity: [0, 0.8, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 2.5 + i * 0.3,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Ultimate Quantum Orb */}
        <motion.div
          className="relative w-80 h-80 rounded-full overflow-hidden"
          style={{
            background: `radial-gradient(circle at 30% 30%, 
              hsla(260, 80%, 70%, 0.9),
              hsla(220, 90%, 60%, 0.8),
              hsla(200, 85%, 50%, 0.95))`,
            boxShadow: `
              0 0 80px hsla(260, 80%, 70%, 0.7),
              0 0 160px hsla(220, 90%, 60%, 0.5),
              0 0 280px hsla(200, 85%, 50%, 0.3),
              inset 0 0 120px rgba(255, 255, 255, 0.1)
            `
          }}
        >
          {/* Quantum Liquid Motion */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, 
                hsla(260, 80%, 70%, 0.4),
                hsla(220, 90%, 60%, 0.6),
                hsla(180, 85%, 55%, 0.4),
                hsla(300, 75%, 65%, 0.5),
                hsla(260, 80%, 70%, 0.4))`,
              filter: `blur(1px)`,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: "linear" }
            }}
          />

          {/* Prismatic Layer */}
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, 
                transparent 0deg,
                hsla(260, 100%, 80%, 0.3) 45deg,
                transparent 90deg,
                hsla(220, 100%, 75%, 0.4) 135deg,
                transparent 180deg,
                hsla(180, 100%, 70%, 0.3) 225deg,
                transparent 270deg,
                hsla(300, 100%, 75%, 0.4) 315deg,
                transparent 360deg)`,
            }}
            animate={{
              rotate: -360,
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" }
            }}
          />

          {/* Quantum Floating Orbs */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`quantum-orb-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${6 + Math.sin(i) * 4}px`,
                height: `${6 + Math.sin(i) * 4}px`,
                background: `hsla(${220 + i * 20}, 90%, 80%, 0.8)`,
                left: `${25 + Math.sin(i * 0.523) * 35}%`,
                top: `${30 + Math.cos(i * 0.523) * 30}%`,
                filter: 'blur(0.5px)',
              }}
              animate={{
                x: [0, Math.sin(i * 0.785) * 30, 0],
                y: [0, Math.cos(i * 0.785) * 25, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Enhanced Track Cover with Quantum Effects */}
          {currentTrack.coverImageUrl ? (
            <motion.div
              className="absolute inset-16 rounded-full overflow-hidden"
              animate={{
                rotate: isPlaying ? 360 : 0,
              }}
              transition={{
                duration: 40,
                repeat: isPlaying ? Infinity : 0,
                ease: "linear"
              }}
            >
              <img
                src={currentTrack.coverImageUrl}
                alt={currentTrack.songName}
                className="w-full h-full object-cover"
                style={{
                  filter: `blur(${isPlaying ? 0.8 : 0}px) 
                           brightness(1.2) 
                           contrast(1.1)
                           saturate(1.3)`,
                  opacity: 0.75,
                }}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-purple-500/50 to-blue-500/50 flex items-center justify-center backdrop-blur-sm">
              <motion.div
                animate={{
                  rotate: isPlaying ? 360 : 0,
                }}
                transition={{
                  rotate: { duration: 25, repeat: isPlaying ? Infinity : 0, ease: "linear" }
                }}
                style={{
                  filter: `brightness(1.2)`,
                }}
              >
                <Radio className="h-16 w-16 text-white/80" />
              </motion.div>
            </div>
          )}

          {/* Quantum Central Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={isUserPaused || !isPlaying ? handleResume : handlePause}
            disabled={!isBroadcastActive}
            className="absolute inset-0 flex items-center justify-center group z-10"
          >
            <motion.div
              className="w-28 h-28 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-500 group-hover:border-white/70"
              style={{
                background: `radial-gradient(circle, 
                  rgba(255, 255, 255, 0.15),
                  rgba(168, 85, 247, 0.1))`,
                borderColor: `rgba(255, 255, 255, 0.4)`,
                boxShadow: `
                  0 0 40px rgba(255, 255, 255, 0.3),
                  inset 0 0 20px rgba(255, 255, 255, 0.1)
                `
              }}
              whileHover={{
                background: `radial-gradient(circle, 
                  rgba(255, 255, 255, 0.25),
                  rgba(168, 85, 247, 0.15))`,
                boxShadow: `0 0 50px rgba(255, 255, 255, 0.6)`
              }}
            >
              <div>
                {isUserPaused || !isPlaying ? (
                  <Play className="h-12 w-12 text-white ml-1 drop-shadow-2xl" />
                ) : (
                  <Pause className="h-12 w-12 text-white drop-shadow-2xl" />
                )}
              </div>
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            const audioDuration = audioRef.current.duration;
            audioRef.current.volume = volume / 100;
            
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
        onTimeUpdate={() => {
          // Audio time update - can be used for future features
        }}
      />
    </div>
  );
}
