import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://syd.cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('685ad71b00296d6597db'); // Replace with your actual project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Configuration
export const DATABASE_ID = '685ad7ef00079b186d6e'; // Replace with your actual Database ID
export const RADIO_STATE_COLLECTION_ID = 'radio_state';
export const AUDIO_FILES_COLLECTION_ID = 'audio_files';
export const STORAGE_BUCKET_ID = 'audio_files';

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
  timestamp: string;
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
  }
};

// Audio File Management
export const audioService = {  // Upload audio file
  async uploadAudio(file: File, userId: string, metadata: { songName: string; artist: string }, coverImage?: File) {
    try {
      // Upload to storage
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );

      // Upload cover image if provided
      let coverImageId: string | undefined;
      let coverImageUrl: string | undefined;
      
      if (coverImage) {
        const uploadedCover = await storage.createFile(
          STORAGE_BUCKET_ID,
          ID.unique(),
          coverImage
        );
        coverImageId = uploadedCover.$id;
        coverImageUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedCover.$id).toString();
      }      // Get file URL
      const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);

      // Create audio duration (you might want to extract this from file metadata)
      const duration = 0; // Will be updated when file is loaded

      // Save metadata to database
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
        }
      );

      return audioDoc as unknown as AudioFile;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Get all audio files
  async getAudioFiles() {
    try {      const response = await databases.listDocuments(
        DATABASE_ID,
        AUDIO_FILES_COLLECTION_ID,
        [Query.orderDesc('uploadedAt')]
      );
      return response.documents as unknown as AudioFile[];
    } catch (error) {
      console.error('Get audio files error:', error);
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
        // Create initial state
        const newDoc = await databases.createDocument(
          DATABASE_ID,
          RADIO_STATE_COLLECTION_ID,
          'radio_state',
          {
            currentTrack: null,
            isPlaying: false,
            currentTime: 0,
            timestamp: new Date().toISOString()
          }
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
      const updateData: any = {
        ...state,
        timestamp: new Date().toISOString()
      };
      
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
    } catch (error) {
      console.error('Get radio state error:', error);
      throw error;
    }
  },  // Subscribe to radio state changes (real-time)
  subscribeToRadioState(callback: (state: RadioState) => void) {
    try {
      return client.subscribe(
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
    } catch (error) {
      console.error('Error setting up radio state subscription:', error);
      return () => {}; // Return empty cleanup function
    }
  },
  // Admin controls
  async playTrack(audioFile: AudioFile) {
    return await this.updateRadioState({
      currentTrack: {
        fileId: audioFile.fileId,
        fileName: audioFile.fileName,
        fileUrl: audioFile.fileUrl,
        duration: audioFile.duration,
        songName: audioFile.songName,
        artist: audioFile.artist,
        coverImageUrl: audioFile.coverImageUrl
      },
      isPlaying: true,
      currentTime: 0
    });
  },

  async pauseTrack() {
    return await this.updateRadioState({
      isPlaying: false
    });
  },

  async resumeTrack() {
    return await this.updateRadioState({
      isPlaying: true
    });
  },

  async stopTrack() {
    return await this.updateRadioState({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0
    });
  },

  async updateCurrentTime(time: number) {
    return await this.updateRadioState({
      currentTime: time
    });
  }
};

export { ID };
export default client;
