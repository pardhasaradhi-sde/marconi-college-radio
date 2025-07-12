import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey('standard_28da71762a60f74e5b2d38a888524315dd126beff16a1e68ea1463574b2a2e69bf3040215feae6dd94272f0989de188b3f7639a2bb2b17eae7dcd68543e478eefbb1533c98986c7cd91e8038f9c4ff6679f535e215fcb0c84aa2b7151cd2a017aa138fcb65a44abdaa80a368ceacefda1f80e97bb97ac7694507f7afc142a082');

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_DATABASE_ID;
const RADIO_STATE_COLLECTION_ID = process.env.VITE_RADIO_STATE_COLLECTION_ID;

async function initializeRadioState() {
  console.log('🎵 Initializing radio state...');

  try {
    // Check if radio state document already exists
    try {
      const existingDoc = await databases.getDocument(
        DATABASE_ID,
        RADIO_STATE_COLLECTION_ID,
        'radio_state'
      );
      console.log('✓ Radio state document already exists');
      console.log('Current state:', {
        isPlaying: existingDoc.isPlaying,
        currentTime: existingDoc.currentTime,
        hasCurrentTrack: existingDoc.currentTrack ? 'Yes' : 'No'
      });
      return;
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
      // Document doesn't exist, create it
      console.log('⚠ Radio state document not found, creating new one...');
    }

    // Create initial radio state document
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

    console.log('✓ Radio state document created successfully!');
    console.log('Document ID:', newDoc.$id);
    console.log('Initial state:', {
      isPlaying: newDoc.isPlaying,
      currentTime: newDoc.currentTime,
      timestamp: newDoc.timestamp
    });

  } catch (error) {
    console.error('✗ Error initializing radio state:', error);
  }
}

initializeRadioState();
