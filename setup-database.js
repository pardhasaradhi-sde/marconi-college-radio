import { Client, Databases, Storage } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey('standard_28da71762a60f74e5b2d38a888524315dd126beff16a1e68ea1463574b2a2e69bf3040215feae6dd94272f0989de188b3f7639a2bb2b17eae7dcd68543e478eefbb1533c98986c7cd91e8038f9c4ff6679f535e215fcb0c84aa2b7151cd2a017aa138fcb65a44abdaa80a368ceacefda1f80e97bb97ac7694507f7afc142a082'); // Replace with your actual API key from Appwrite Console

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.VITE_DATABASE_ID;
const AUDIO_FILES_COLLECTION_ID = process.env.VITE_AUDIO_FILES_COLLECTION_ID;
const RADIO_STATE_COLLECTION_ID = process.env.VITE_RADIO_STATE_COLLECTION_ID;
const STORAGE_BUCKET_ID = process.env.VITE_STORAGE_BUCKET_ID;

async function createAttributeIfNotExists(databaseId, collectionId, createFunction, attributeName) {
  try {
    await createFunction();
    console.log(`✓ Created attribute: ${attributeName}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠ Attribute already exists: ${attributeName}`);
    } else {
      console.error(`✗ Error creating attribute ${attributeName}:`, error.message);
    }
  }
}

async function setupDatabase() {
  console.log('Setting up database attributes...');

  try {
    // Create attributes for audio_files collection
    console.log('\nCreating audio_files collection attributes...');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'fileName', 255, true), 'fileName');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'fileId', 255, true), 'fileId');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'fileUrl', 2000, true), 'fileUrl');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createIntegerAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'duration', true, 0), 'duration');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'uploadedBy', 255, true), 'uploadedBy');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'uploadedAt', 255, true), 'uploadedAt');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'songName', 255, true), 'songName');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'artist', 255, true), 'artist');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'coverImageId', 255, false), 'coverImageId');
    
    await createAttributeIfNotExists(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, AUDIO_FILES_COLLECTION_ID, 'coverImageUrl', 2000, false), 'coverImageUrl');

    console.log('\n✓ Audio files collection setup complete!');

    // Create attributes for radio_state collection
    console.log('\nCreating radio_state collection attributes...');
    
    await createAttributeIfNotExists(DATABASE_ID, RADIO_STATE_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, RADIO_STATE_COLLECTION_ID, 'currentTrack', 5000, false), 'currentTrack');
    
    await createAttributeIfNotExists(DATABASE_ID, RADIO_STATE_COLLECTION_ID, 
      () => databases.createBooleanAttribute(DATABASE_ID, RADIO_STATE_COLLECTION_ID, 'isPlaying', true), 'isPlaying');
    
    await createAttributeIfNotExists(DATABASE_ID, RADIO_STATE_COLLECTION_ID, 
      () => databases.createIntegerAttribute(DATABASE_ID, RADIO_STATE_COLLECTION_ID, 'currentTime', true, 0), 'currentTime');
    
    await createAttributeIfNotExists(DATABASE_ID, RADIO_STATE_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, RADIO_STATE_COLLECTION_ID, 'timestamp', 255, true), 'timestamp');

    console.log('\n✓ Radio state collection setup complete!');
    console.log('\n🎉 Database setup complete!');

  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
