import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function updateRadioStateSchema() {
  try {
    const client = new Client()
      .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
      .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
      .setKey('standard_34b61f5a67e5daa8b9a62b74b7398a27bc58d8ffd7a1ce34d15ff46fe5e04b0fb7aa8e62a6bb7e8398f2e3bd9fae3a58c96b3f7de87d5bc4dadd9a4b8b9aae8ee94e5c0ba92ed8ccc4c4b28a09e26d842b4bdb7dfe8f8b2ef2f4cf2a5d8f24b3a');

    const databases = new Databases(client);
    
    console.log('🎵 Updating radio state for time-based broadcast sync...');
    
    // Delete existing document to recreate with new schema
    try {
      await databases.deleteDocument(
        process.env.VITE_DATABASE_ID,
        process.env.VITE_RADIO_STATE_COLLECTION_ID,
        'radio_state'
      );
      console.log('✓ Deleted old radio state document');
    } catch (error) {
      console.log('Old document not found, creating new one...');
    }

    // Create new radio state document with broadcast-based schema
    const newDoc = await databases.createDocument(
      process.env.VITE_DATABASE_ID,
      process.env.VITE_RADIO_STATE_COLLECTION_ID,
      'radio_state',
      {
        currentTrack: null,
        isPlaying: false,
        broadcastStartTime: null, // When the current broadcast started
        broadcastDuration: 0,     // Duration of the audio file in seconds
        timestamp: new Date().toISOString()
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any())
      ]
    );

    console.log('✓ Created new radio state document with broadcast schema!');
    console.log('New structure:', {
      id: newDoc.$id,
      isPlaying: newDoc.isPlaying,
      broadcastStartTime: newDoc.broadcastStartTime,
      broadcastDuration: newDoc.broadcastDuration,
      permissions: newDoc.$permissions
    });
    
  } catch (error) {
    console.error('❌ Error updating radio state schema:', error);
  }
}

updateRadioStateSchema();
