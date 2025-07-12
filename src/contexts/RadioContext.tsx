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
  deleteAudio: (audioId: string, fileId: string) => Promise<void>;
  
  // Scheduling controls
  scheduleRadio: (trackId: string, startTime: string, endTime: string) => Promise<void>;
  scheduleTestBroadcast: (trackId: string, durationMinutes?: number) => Promise<void>; // DEBUG helper
  cancelSchedule: () => Promise<void>;
  getScheduledBroadcasts: () => Promise<any[]>;
  
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
        
        // Add a small delay to ensure Appwrite client is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!isMounted) return;
        
        subscriptionRef.current = radioService.subscribeToRadioState((newState) => {
          if (!isMounted) return;
          
          setRadioState(newState);
          
          // Note: Audio sync is now handled by individual StreamPlayer components
          // using time-based calculation, not real-time currentTime updates
        });
        
        console.log('Radio state subscription set up successfully');
      } catch (error) {
        console.error('Failed to setup radio state subscription:', error);
        
        // Fallback to polling if real-time fails
        console.log('Setting up polling fallback...');
        const pollInterval = setInterval(async () => {
          if (!isMounted) return;
          
          try {
            const currentState = await radioService.getCurrentRadioState();
            if (currentState && isMounted) {
              setRadioState(currentState);
            }
          } catch (pollError) {
            console.error('Polling error:', pollError);
          }
        }, 3000); // Poll every 3 seconds
        
        // Store poll interval for cleanup
        subscriptionRef.current = () => clearInterval(pollInterval);
      }
    };

    setupSubscription();

    // Auto-check for scheduled broadcasts every 10 seconds for better responsiveness
    const scheduleCheckInterval = setInterval(async () => {
      try {
        console.log('🔄 Checking scheduled broadcasts...');
        await radioService.checkAndStartScheduledBroadcast();
      } catch (error) {
        console.error('Failed to check scheduled broadcasts:', error);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      setIsLoading(false);
      isMounted = false;
      
      // Clear the schedule check interval
      clearInterval(scheduleCheckInterval);
      
      // Cleanup subscription
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
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

  // Scheduling functions
  const scheduleRadio = async (trackId: string, startTime: string, endTime: string) => {
    if (user?.role !== 'admin') throw new Error('Only admins can schedule broadcasts');
    
    try {
      await radioService.scheduleRadio(trackId, startTime, endTime);
    } catch (error) {
      console.error('Schedule broadcast failed:', error);
      throw error;
    }
  };

  const scheduleTestBroadcast = async (trackId: string, durationMinutes: number = 30) => {
    if (user?.role !== 'admin') throw new Error('Only admins can schedule broadcasts');
    
    try {
      await radioService.scheduleTestBroadcast(trackId, durationMinutes);
    } catch (error) {
      console.error('Schedule test broadcast failed:', error);
      throw error;
    }
  };

  const cancelSchedule = async () => {
    if (user?.role !== 'admin') throw new Error('Only admins can cancel broadcasts');
    
    try {
      await radioService.cancelSchedule();
    } catch (error) {
      console.error('Cancel scheduled broadcast failed:', error);
      throw error;
    }
  };

  const getScheduledBroadcasts = async () => {
    if (user?.role !== 'admin') throw new Error('Only admins can view scheduled broadcasts');
    
    try {
      // For now, return empty array since we don't have a getScheduledBroadcasts method yet
      return [];
    } catch (error) {
      console.error('Get scheduled broadcasts failed:', error);
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
        deleteAudio,
        refreshAudioFiles,
        scheduleRadio,
        scheduleTestBroadcast,
        cancelSchedule,
        getScheduledBroadcasts,
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
