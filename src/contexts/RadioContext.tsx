import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { AudioFile, RadioState, audioService, radioService } from '../services/appwrite';
import { useAuth } from './AuthContext';

interface RadioContextType {
  // Radio state
  radioState: RadioState | null;
  audioFiles: AudioFile[];
  isLoading: boolean;
  
  // Admin controls
  uploadAudio: (file: File, metadata: { songName: string; artist: string }, coverImage?: File) => Promise<void>;
  playTrack: (audioFile: AudioFile) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  updateCurrentTime: (time: number) => Promise<void>;
  deleteAudio: (audioId: string, fileId: string) => Promise<void>;
  
  // User controls
  refreshAudioFiles: () => Promise<void>;
  
  // Audio element ref for sync
  audioRef: HTMLAudioElement | null;
  setAudioRef: (ref: HTMLAudioElement | null) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

interface RadioProviderProps {
  children: ReactNode;
}

export function RadioProvider({ children }: RadioProviderProps) {
  const { user } = useAuth();
  const [radioState, setRadioState] = useState<RadioState | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const subscriptionRef = useRef<(() => void) | null>(null);

  // Initialize radio state and load audio files
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
          // Initialize radio state
        const state = await radioService.initializeRadioState();
        setRadioState(state as RadioState);
        
        // Load audio files
        const files = await audioService.getAudioFiles();
        setAudioFiles(files);
        
      } catch (error) {
        console.error('Failed to initialize radio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      initialize();
    }
  }, [user]);  // Subscribe to real-time radio state changes
  useEffect(() => {
    if (!user) {
      // Clean up any existing subscription
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
      return;
    }

    // Don't create multiple subscriptions
    if (subscriptionRef.current) {
      return;
    }

    let isMounted = true;

    const setupSubscription = async () => {
      try {
        if (!isMounted) return;
        
        subscriptionRef.current = radioService.subscribeToRadioState((newState) => {
          if (!isMounted) return;
          
          setRadioState(newState);
          
          // Sync audio element with new state
          if (audioRef && newState.currentTrack) {
            if (newState.isPlaying) {
              audioRef.currentTime = newState.currentTime;
              audioRef.play().catch(console.error);
            } else {
              audioRef.pause();
            }
          }
        });
      } catch (error) {
        console.error('Failed to setup radio state subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current();
          subscriptionRef.current = null;
        } catch (error) {
          console.error('Error unsubscribing from radio state:', error);
        }
      }
    };  }, [user, audioRef]);

  // Admin functions
  const uploadAudio = async (file: File, metadata: { songName: string; artist: string }, coverImage?: File) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const uploadedFile = await audioService.uploadAudio(file, user.id, metadata, coverImage);
      setAudioFiles(prev => [uploadedFile, ...prev]);
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const playTrack = async (audioFile: AudioFile) => {
    if (user?.role !== 'admin') throw new Error('Only admins can control playback');
    
    try {
      await radioService.playTrack(audioFile);
    } catch (error) {
      console.error('Play track failed:', error);
      throw error;
    }
  };

  const pauseTrack = async () => {
    if (user?.role !== 'admin') throw new Error('Only admins can control playback');
    
    try {
      await radioService.pauseTrack();
    } catch (error) {
      console.error('Pause track failed:', error);
      throw error;
    }
  };

  const resumeTrack = async () => {
    if (user?.role !== 'admin') throw new Error('Only admins can control playback');
    
    try {
      await radioService.resumeTrack();
    } catch (error) {
      console.error('Resume track failed:', error);
      throw error;
    }
  };

  const stopTrack = async () => {
    if (user?.role !== 'admin') throw new Error('Only admins can control playback');
    
    try {
      await radioService.stopTrack();
    } catch (error) {
      console.error('Stop track failed:', error);
      throw error;
    }
  };

  const updateCurrentTime = async (time: number) => {
    if (user?.role !== 'admin') throw new Error('Only admins can control playback');
    
    try {
      await radioService.updateCurrentTime(time);
    } catch (error) {
      console.error('Update time failed:', error);
      throw error;
    }
  };

  const deleteAudio = async (audioId: string, fileId: string) => {
    if (user?.role !== 'admin') throw new Error('Only admins can delete files');
    
    try {
      await audioService.deleteAudio(audioId, fileId);
      setAudioFiles(prev => prev.filter(file => file.$id !== audioId));
    } catch (error) {
      console.error('Delete audio failed:', error);
      throw error;
    }
  };

  const refreshAudioFiles = async () => {
    try {
      const files = await audioService.getAudioFiles();
      setAudioFiles(files);
    } catch (error) {
      console.error('Refresh audio files failed:', error);
      throw error;
    }
  };

  return (
    <RadioContext.Provider
      value={{
        radioState,
        audioFiles,
        isLoading,
        uploadAudio,
        playTrack,
        pauseTrack,
        resumeTrack,
        stopTrack,
        updateCurrentTime,
        deleteAudio,
        refreshAudioFiles,
        audioRef,
        setAudioRef,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
}
