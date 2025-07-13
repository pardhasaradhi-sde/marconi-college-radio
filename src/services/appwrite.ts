import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Configuration
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID || '';
export const RADIO_STATE_COLLECTION_ID = import.meta.env.VITE_RADIO_STATE_COLLECTION_ID || 'radio_state';
export const AUDIO_FILES_COLLECTION_ID = import.meta.env.VITE_AUDIO_FILES_COLLECTION_ID || 'audio_files';
export const STORAGE_BUCKET_ID = import.meta.env.VITE_STORAGE_BUCKET_ID || 'audio_files';
export const ANNOUNCEMENTS_COLLECTION_ID = import.meta.env.VITE_ANNOUNCEMENTS_COLLECTION_ID || 'announcements';

// Types
export interface AudioFile {
  $id: string;
  fileName: string;
  fileId: string;
  fileUrl: string;
  duration: number;
  uploadedBy: string;
  uploadedAt: string;
  // New metadata fields
  songName: string;
  artist: string;
  coverImageId?: string;
  coverImageUrl?: string;
}

export interface RadioState {
  $id: string;
  currentTrack: {
    fileId: string;
    fileName: string;
    fileUrl: string;
    duration: number;
    songName: string;
    artist: string;
    coverImageUrl?: string;
  } | null;
  isPlaying: boolean;
  currentTime: number;
  broadcastStartTime?: string | null; // ISO string when broadcast started
  timestamp: string;
  // Scheduling fields
  scheduledStartTime?: string | null; // When the broadcast should start
  scheduledEndTime?: string | null; // When the broadcast should end
  scheduledTrackId?: string | null; // Which track to play during scheduled time
  isScheduled?: boolean; // Whether there's an active schedule
}

export interface Announcement {
  $id: string;
  title: string;
  content: string;
  imageId?: string;
  imageUrl?: string;
  eventDate?: string | null; // When the event will happen
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication Functions
export const authService = {  // Login with email and password
  async login(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  async register(email: string, password: string, name: string) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      // Auto login after registration
      await this.login(email, password);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  // Logout
  async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Update user name
  async updateName(name: string) {
    try {
      return await account.updateName(name);
    } catch (error) {
      console.error('Update name error:', error);
      throw error;
    }
  }
};

// Audio File Management
export const audioService = {  // Upload audio file
  async uploadAudio(file: File, userId: string, metadata: { songName: string; artist: string }, coverImage?: File) {
    try {
      // Upload to storage with basic permissions
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file,
        [
          Permission.read(Role.any()),
          Permission.write(Role.any())
        ]
      );

      // Upload cover image if provided
      let coverImageId: string | undefined;
      let coverImageUrl: string | undefined;
      
      if (coverImage) {
        const uploadedCover = await storage.createFile(
          STORAGE_BUCKET_ID,
          ID.unique(),
          coverImage,
          [
            Permission.read(Role.any()),
            Permission.write(Role.any())
          ]
        );
        coverImageId = uploadedCover.$id;
        coverImageUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedCover.$id).toString();
      }      // Get file URL
      const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);

      // Create audio duration (you might want to extract this from file metadata)
      const duration = 0; // Will be updated when file is loaded

      // Save metadata to database with basic permissions
      const audioDoc = await databases.createDocument(
        DATABASE_ID,
        AUDIO_FILES_COLLECTION_ID,
        ID.unique(),
        {
          fileName: file.name,
          fileId: uploadedFile.$id,
          fileUrl: fileUrl.toString(),
          duration,
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          songName: metadata.songName,
          artist: metadata.artist,
          coverImageId,
          coverImageUrl
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any())
        ]
      );

      return audioDoc as unknown as AudioFile;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Get all audio files
  async getAudioFiles() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        AUDIO_FILES_COLLECTION_ID,
        [Query.orderDesc('uploadedAt')]
      );
      return response.documents as unknown as AudioFile[];
    } catch (error) {
      console.error('Get audio files error:', error);
      // If it's a permission error, return empty array so UI doesn't break
      if (error instanceof Error && error.message.includes('unauthorized')) {
        console.warn('Permission denied for audio files - returning empty array');
        return [];
      }
      throw error;
    }
  },
  // Update audio file metadata
  async updateAudioFile(audioId: string, updates: Partial<Pick<AudioFile, 'duration' | 'songName' | 'artist'>>) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        AUDIO_FILES_COLLECTION_ID,
        audioId,
        updates
      );
    } catch (error) {
      console.error(`Failed to update audio file ${audioId}:`, error);
      throw error;
    }
  },

  // Delete audio file
  async deleteAudio(audioId: string, fileId: string) {
    let storageDeleteError = null;
    let databaseDeleteError = null;

    try {
      // Try to delete from storage first (but don't fail if file doesn't exist)
      try {
        await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
        console.log('File deleted from storage successfully');
      } catch (storageError: any) {
        storageDeleteError = storageError;
        // Log the error but continue - file might already be deleted or never existed
        console.warn('Storage deletion failed (continuing with database cleanup):', storageError.message);
      }
      
      // Always try to delete from database
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          AUDIO_FILES_COLLECTION_ID,
          audioId
        );
        console.log('Document deleted from database successfully');
      } catch (dbError: any) {
        databaseDeleteError = dbError;
        console.error('Database deletion failed:', dbError.message);
        throw dbError; // This is more critical - we need the database to be consistent
      }

      // If storage failed but database succeeded, log a warning but consider it successful
      if (storageDeleteError && !databaseDeleteError) {
        console.warn('Audio deleted from database but storage cleanup failed. File may remain in storage.');
      }

    } catch (error) {
      console.error('Delete audio error:', error);
      throw error;
    }
  }
};

// Radio State Management
export const radioService = {  // Initialize radio state (call this once)
  async initializeRadioState() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        RADIO_STATE_COLLECTION_ID
      );

      if (response.documents.length === 0) {
        // Create initial state with basic permissions
        const newDoc = await databases.createDocument(
          DATABASE_ID,
          RADIO_STATE_COLLECTION_ID,
          'radio_state',
          {
            currentTrack: null,
            isPlaying: false,
            currentTime: 0,
            timestamp: new Date().toISOString()
          },
          [
            Permission.read(Role.any()),
            Permission.write(Role.any())
          ]
        );
          // Return with proper structure
        return {
          ...newDoc,
          currentTrack: null
        } as unknown as RadioState;
      }      // Deserialize existing document
      const doc = response.documents[0] as any;
      return {
        ...doc,
        currentTrack: doc.currentTrack ? JSON.parse(doc.currentTrack) : null
      } as unknown as RadioState;
    } catch (error) {
      console.error('Initialize radio state error:', error);
      throw error;
    }
  },
  // Update radio state (admin only)
  async updateRadioState(state: Partial<RadioState>) {
    try {
      // First, ensure we have the current radio state document
      try {
        // Try to get existing document first
        await databases.getDocument(
          DATABASE_ID,
          RADIO_STATE_COLLECTION_ID,
          'radio_state'
        );
      } catch (error: any) {
        if (error.code === 404) {
          // Document doesn't exist, create it first
          console.log('Radio state document not found, creating new one...');
          await this.initializeRadioState();
        } else {
          throw error;
        }
      }

      const updateData: any = {
        ...state,
        timestamp: new Date().toISOString()
      };
      
      // Ensure currentTime is always an integer for Appwrite
      if ('currentTime' in state && typeof state.currentTime === 'number') {
        updateData.currentTime = Math.floor(state.currentTime);
      }
      
      // Serialize currentTrack to JSON string if it exists
      if ('currentTrack' in state) {
        updateData.currentTrack = state.currentTrack ? JSON.stringify(state.currentTrack) : null;
      }
      
      return await databases.updateDocument(
        DATABASE_ID,
        RADIO_STATE_COLLECTION_ID,
        'radio_state',
        updateData
      );
    } catch (error) {
      console.error('Update radio state error:', error);
      throw error;
    }
  },  // Get current radio state
  async getRadioState() {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        RADIO_STATE_COLLECTION_ID,
        'radio_state'
      ) as any;
      
      // Deserialize currentTrack from JSON string
      const radioState: RadioState = {
        ...response,
        currentTrack: response.currentTrack ? JSON.parse(response.currentTrack) : null
      };
      
      return radioState;
    } catch (error: any) {
      if (error.code === 404) {
        // Document doesn't exist, create it first
        console.log('Radio state document not found, initializing...');
        return await this.initializeRadioState();
      }
      console.error('Get radio state error:', error);
      throw error;
    }
  },  // Subscribe to radio state changes (real-time)
  subscribeToRadioState(callback: (state: RadioState) => void) {
    let connectionAttempts = 0;
    const maxRetries = 3;
    let reconnectTimeout: number | null = null;
    
    const createSubscription = () => {
      try {
        console.log('Setting up radio state subscription...');
        
        const unsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${RADIO_STATE_COLLECTION_ID}.documents.radio_state`,
          (response: any) => {
            try {
              if (response.events.includes('databases.*.collections.*.documents.*.update')) {
                const payload = response.payload;
                // Deserialize currentTrack from JSON string
                const radioState: RadioState = {
                  ...payload,
                  currentTrack: payload.currentTrack ? JSON.parse(payload.currentTrack) : null
                };
                callback(radioState);
              }
            } catch (error) {
              console.error('Error processing radio state update:', error);
            }
          }
        );

        // Enhanced connection handling
        if (unsubscribe && typeof unsubscribe === 'function') {
          connectionAttempts = 0; // Reset on successful connection
          console.log('✅ Radio state subscription connected successfully');
          return unsubscribe;
        } else {
          throw new Error('Failed to create subscription');
        }

      } catch (error) {
        console.error('❌ Error creating subscription:', error);
        
        // Retry with exponential backoff
        if (connectionAttempts < maxRetries) {
          connectionAttempts++;
          const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 10000);
          
          console.log(`🔄 Retrying subscription in ${delay}ms (attempt ${connectionAttempts}/${maxRetries})`);
          
          reconnectTimeout = window.setTimeout(() => {
            return createSubscription();
          }, delay);
        } else {
          console.warn('⚠️ Max subscription retry attempts reached. Using polling fallback.');
          // Set up polling fallback
          const pollInterval = setInterval(async () => {
            try {
              const state = await this.getCurrentRadioState();
              if (state) callback(state);
            } catch (pollError) {
              console.error('Polling error:', pollError);
            }
          }, 5000); // Poll every 5 seconds
          
          return () => {
            clearInterval(pollInterval);
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
          };
        }
        
        return () => {
          if (reconnectTimeout) clearTimeout(reconnectTimeout);
        };
      }
    };

    return createSubscription();
  },

  // Get current radio state (for polling fallback)
  async getCurrentRadioState(): Promise<RadioState | null> {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        RADIO_STATE_COLLECTION_ID,
        'radio_state'
      );
      
      return {
        ...doc,
        currentTrack: doc.currentTrack ? JSON.parse(doc.currentTrack as string) : null
      } as unknown as RadioState;
    } catch (error) {
      console.error('Error getting current radio state:', error);
      return null;
    }
  },
  // Broadcasts are now controlled only through scheduling

  // Scheduling methods
  async scheduleRadio(trackId: string, startTime: string, endTime: string) {
    const track = await audioService.getAudioFiles().then(files => 
      files.find(f => f.$id === trackId)
    );
    
    if (!track) throw new Error('Track not found');

    return await this.updateRadioState({
      scheduledStartTime: startTime,
      scheduledEndTime: endTime,
      scheduledTrackId: trackId,
      isScheduled: true,
      timestamp: new Date().toISOString()
    });
  },

  async cancelSchedule() {
    return await this.updateRadioState({
      scheduledStartTime: null,
      scheduledEndTime: null,
      scheduledTrackId: null,
      isScheduled: false,
      timestamp: new Date().toISOString()
    });
  },

  // Check if radio should be playing based on schedule
  shouldRadioBePlayingNow(radioState: RadioState): { shouldPlay: boolean; track?: any } {
    if (!radioState.isScheduled || !radioState.scheduledStartTime || !radioState.scheduledEndTime) {
      return { shouldPlay: false };
    }

    const now = new Date();
    const startTime = new Date(radioState.scheduledStartTime);
    const endTime = new Date(radioState.scheduledEndTime);

    const shouldPlay = now >= startTime && now <= endTime;
    
    return { 
      shouldPlay,
      track: shouldPlay ? radioState.currentTrack : null
    };
  },

  // Auto-start scheduled broadcast
  async checkAndStartScheduledBroadcast() {
    try {
      const currentState = await this.getCurrentRadioState();
      if (!currentState) {
        console.log('❌ No radio state found');
        return;
      }

      console.log('📊 Current radio state:', {
        isScheduled: currentState.isScheduled,
        isPlaying: currentState.isPlaying,
        scheduledStartTime: currentState.scheduledStartTime,
        scheduledEndTime: currentState.scheduledEndTime,
        scheduledTrackId: currentState.scheduledTrackId,
        currentTime: new Date().toISOString()
      });

      const { shouldPlay } = this.shouldRadioBePlayingNow(currentState);
      console.log('🎯 Should radio be playing now?', shouldPlay);
      
      if (shouldPlay && currentState.scheduledTrackId) {
        // Check if we need to start or update the broadcast
        const needsTrackUpdate = !currentState.currentTrack || 
                                currentState.currentTrack.fileId !== currentState.scheduledTrackId;
        const needsPlayState = !currentState.isPlaying;
        
        if (needsTrackUpdate || needsPlayState) {
          // Get the scheduled track
          const tracks = await audioService.getAudioFiles();
          const scheduledTrack = tracks.find(t => t.$id === currentState.scheduledTrackId);
          
          if (scheduledTrack) {
            console.log('🎵 Starting/updating scheduled broadcast:', {
              songName: scheduledTrack.songName,
              needsTrackUpdate,
              needsPlayState,
              currentTrackId: currentState.currentTrack?.fileId
            });
            
            // Set broadcastStartTime to the scheduled start time for perfect sync
            const broadcastStartTime = currentState.scheduledStartTime || new Date().toISOString();
            
            await this.updateRadioState({
              currentTrack: scheduledTrack,
              isPlaying: true,
              currentTime: 0,
              broadcastStartTime: broadcastStartTime,
              timestamp: new Date().toISOString()
            });
          } else {
            console.log('❌ Scheduled track not found:', currentState.scheduledTrackId);
          }
        } else {
          console.log('✅ Broadcast already running correctly');
        }
      } else if (!shouldPlay && currentState.isPlaying && currentState.isScheduled) {
        // Auto-stop when schedule ends
        console.log('⏹️ Auto-stopping scheduled broadcast');
        await this.updateRadioState({
          currentTrack: null,
          isPlaying: false,
          currentTime: 0,
          broadcastStartTime: null,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error checking scheduled broadcast:', error);
    }
  },

  // Calculate current position in broadcast based on time elapsed since start
  calculateBroadcastPosition(broadcastStartTime: string | number, audioDuration: number): number {
    console.log('🧮 calculateBroadcastPosition inputs:', {
      broadcastStartTime,
      audioDuration,
      currentTime: new Date().toISOString()
    });
    
    if (!broadcastStartTime || !audioDuration) {
      console.log('❌ Missing inputs for calculation');
      return 0;
    }
    
    // Handle both ISO string and timestamp formats
    const startTime = typeof broadcastStartTime === 'string' 
      ? new Date(broadcastStartTime).getTime() 
      : broadcastStartTime;
    
    // Check if startTime is valid
    if (isNaN(startTime)) {
      console.log('❌ Invalid start time:', broadcastStartTime);
      return 0;
    }
    
    const now = Date.now();
    const elapsed = (now - startTime) / 1000; // Convert to seconds
    
    console.log('⏱️ Time calculation:', {
      startTime: new Date(startTime).toISOString(),
      now: new Date(now).toISOString(),
      elapsedSeconds: elapsed,
      audioDuration,
      willLoop: elapsed > audioDuration
    });
    
    // Handle negative elapsed time (clock sync issues or future start time)
    if (elapsed < 0) {
      console.log('⚠️ Negative elapsed time - broadcast hasn\'t started yet');
      return 0;
    }
    
    const position = elapsed % audioDuration; // Loop the audio
    console.log('🎯 Final position:', position);
    
    return position;
  },

  // Get current playback position for ongoing scheduled broadcast
  getCurrentScheduledPosition(radioState: RadioState): { position: number; shouldPlay: boolean } {
    const { shouldPlay } = this.shouldRadioBePlayingNow(radioState);
    
    console.log('🎯 getCurrentScheduledPosition:', {
      shouldPlay,
      isScheduled: radioState.isScheduled,
      scheduledStartTime: radioState.scheduledStartTime,
      scheduledEndTime: radioState.scheduledEndTime,
      currentTrackDuration: radioState.currentTrack?.duration,
      currentTime: new Date().toISOString(),
      trackInfo: radioState.currentTrack ? {
        songName: radioState.currentTrack.songName,
        duration: radioState.currentTrack.duration
      } : null
    });
    
    if (!shouldPlay || !radioState.scheduledStartTime || !radioState.currentTrack?.duration) {
      console.log('❌ Missing data for position calculation:', {
        shouldPlay,
        hasScheduledStartTime: !!radioState.scheduledStartTime,
        hasCurrentTrack: !!radioState.currentTrack,
        hasDuration: !!radioState.currentTrack?.duration
      });
      return { position: 0, shouldPlay: false };
    }
    
    // Calculate position based on scheduled start time (not when broadcast actually started)
    const position = this.calculateBroadcastPosition(
      radioState.scheduledStartTime,
      radioState.currentTrack.duration
    );
    
    console.log('📊 Calculated position:', {
      scheduledStartTime: radioState.scheduledStartTime,
      duration: radioState.currentTrack.duration,
      calculatedPosition: position,
      currentTime: new Date().toISOString(),
      elapsedSinceStart: (Date.now() - new Date(radioState.scheduledStartTime).getTime()) / 1000
    });
    
    return { position, shouldPlay: true };
  },

  // DEBUG: Quick schedule test broadcast (for testing purposes)
  async scheduleTestBroadcast(trackId: string, durationMinutes: number = 30) {
    const now = new Date();
    const startTime = new Date(now.getTime() - 2 * 60 * 1000); // Start 2 minutes ago
    const endTime = new Date(now.getTime() + durationMinutes * 60 * 1000); // End in X minutes
    
    console.log('🧪 Scheduling test broadcast:', {
      trackId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      currentTime: now.toISOString()
    });
    
    return await this.scheduleRadio(trackId, startTime.toISOString(), endTime.toISOString());
  },
};

// Announcements Management
export const announcementService = {
  // Create new announcement
  async createAnnouncement(
    title: string, 
    content: string, 
    userId: string, 
    eventDate?: string,
    image?: File
  ) {
    try {
      let imageId: string | undefined;
      let imageUrl: string | undefined;
      
      // Upload image if provided
      if (image) {
        const uploadedImage = await storage.createFile(
          STORAGE_BUCKET_ID,
          ID.unique(),
          image,
          [
            Permission.read(Role.any()),
            Permission.write(Role.any())
          ]
        );
        imageId = uploadedImage.$id;
        imageUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedImage.$id).toString();
      }

      // Create announcement document
      const announcementDoc = await databases.createDocument(
        DATABASE_ID,
        ANNOUNCEMENTS_COLLECTION_ID,
        ID.unique(),
        {
          title,
          content,
          imageId,
          imageUrl,
          eventDate: eventDate || null,
          isActive: true,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any())
        ]
      );

      return announcementDoc as unknown as Announcement;
    } catch (error) {
      console.error('Create announcement error:', error);
      throw error;
    }
  },

  // Get all announcements
  async getAnnouncements(activeOnly: boolean = false) {
    try {
      const queries = [Query.orderDesc('createdAt')];
      if (activeOnly) {
        queries.push(Query.equal('isActive', true));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        ANNOUNCEMENTS_COLLECTION_ID,
        queries
      );
      return response.documents as unknown as Announcement[];
    } catch (error) {
      console.error('Get announcements error:', error);
      if (error instanceof Error && error.message.includes('unauthorized')) {
        console.warn('Permission denied for announcements - returning empty array');
        return [];
      }
      throw error;
    }
  },

  // Update announcement
  async updateAnnouncement(
    announcementId: string,
    updates: Partial<Pick<Announcement, 'title' | 'content' | 'eventDate' | 'isActive'>>
  ) {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return await databases.updateDocument(
        DATABASE_ID,
        ANNOUNCEMENTS_COLLECTION_ID,
        announcementId,
        updateData
      );
    } catch (error) {
      console.error('Update announcement error:', error);
      throw error;
    }
  },

  // Delete announcement
  async deleteAnnouncement(announcementId: string, imageId?: string) {
    try {
      // Delete image from storage if it exists
      if (imageId) {
        try {
          await storage.deleteFile(STORAGE_BUCKET_ID, imageId);
        } catch (error) {
          console.warn('Failed to delete announcement image:', error);
        }
      }

      // Delete document from database
      await databases.deleteDocument(
        DATABASE_ID,
        ANNOUNCEMENTS_COLLECTION_ID,
        announcementId
      );
    } catch (error) {
      console.error('Delete announcement error:', error);
      throw error;
    }
  }
};

export { ID };
export default client;
