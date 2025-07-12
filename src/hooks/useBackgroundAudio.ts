import { useState, useEffect, useRef } from 'react';
import { useRadio } from '../contexts/RadioContext';
import { radioService } from '../services/appwrite';

export function useBackgroundAudio() {
  const { radioState, audioFiles } = useRadio();
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

  return {
    audioRef,
    isPlaying,
    isUserPaused,
    currentTrack,
    isBroadcastActive,
    handlePause,
    handleResume,
    startDebugBroadcast
  };
}
