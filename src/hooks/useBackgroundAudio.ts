import { useState, useEffect, useRef } from 'react';
import { useRadio } from '../contexts/RadioContext';
import { radioService, audioService } from '../services/appwrite';

export function useBackgroundAudio() {
  const { radioState, audioFiles } = useRadio();
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const syncIntervalRef = useRef<number | null>(null);

  const currentTrack = radioState?.currentTrack;
  const isBroadcastActive = radioState?.isPlaying && currentTrack;

  // Effect to handle audio duration updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleDurationChange = async () => {
      const duration = Math.round(audio.duration);
      const trackInState = audioFiles.find(f => f.fileUrl === audio.src);

      if (trackInState && duration && !isNaN(duration) && duration > 0 && duration !== trackInState.duration) {
        console.log(`Updating duration for ${trackInState.songName}: ${duration}`);
        try {
          // Update the duration in the database, ensuring it is an integer
          await audioService.updateAudioFile(trackInState.$id, { duration });
          // Note: The change will propagate via real-time updates, so no local state change is needed here.
        } catch (error) {
          console.error("Failed to update audio duration:", error);
        }
      }
    };

    audio.addEventListener('durationchange', handleDurationChange);
    return () => {
      audio.removeEventListener('durationchange', handleDurationChange);
    };
  }, [currentTrack, audioFiles]);


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
      console.log('Audio not ready for sync, state:', audioRef.current.readyState);
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
      console.log(`🔄 [Sync] Audio position synced to ${targetPosition.toFixed(1)}s (Difference: ${difference.toFixed(1)}s)`);
    }
  };

  // Sync on mount and when track changes
  useEffect(() => {
    console.log('[Effect] Track or broadcast state changed.', { currentTrack, isBroadcastActive, isUserPaused });

    if (!currentTrack) {
      setIsPlaying(false);
      if (audioRef.current) {
        console.log('[Effect] No current track. Pausing audio.');
        audioRef.current.pause();
        audioRef.current.src = ''; // Clear src
      }
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    if (audioRef.current) {
      const audioSrc = currentTrack.fileUrl;
      if (audioRef.current.src !== audioSrc) {
        console.log(`[Effect] New track detected. Setting src to: ${audioSrc}`);
        audioRef.current.src = audioSrc;
        audioRef.current.load();
      }

      const handleCanPlay = () => {
        console.log('[Event] "canplay" event fired.');
        if (audioRef.current && !isUserPaused && isBroadcastActive) {
          console.log('[Action] Conditions met. Attempting to play.');
          syncAudioPosition();
          audioRef.current.play().then(() => {
            console.log('✅ [Success] Playback started successfully.');
            setIsPlaying(true);
          }).catch(error => {
            console.error('❌ [Error] Playback failed:', error);
            // This can happen due to browser autoplay policies.
            // We'll set isUserPaused to true to show the play button.
            setIsUserPaused(true);
            setIsPlaying(false);
          });
        } else {
          console.log('[Info] Conditions for play not met.', { isUserPaused, isBroadcastActive });
        }
      };

      audioRef.current.addEventListener('canplay', handleCanPlay);
      
      if (isBroadcastActive) {
        if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
        console.log('[Effect] Broadcast is active. Setting up sync interval.');
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
    console.log('[Action] User paused playback.');
    setIsUserPaused(true);
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  };

  const handleResume = () => {
    console.log('[Action] User resumed playback.');
    setIsUserPaused(false);
    if (audioRef.current && currentTrack) {
      syncAudioPosition();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('❌ [Error] Resume failed:', error);
      });
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
