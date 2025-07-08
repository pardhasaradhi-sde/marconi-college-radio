import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // You'll need to add this to .env

const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = process.env.VITE_APPWRITE_RADIO_STATE_COLLECTION_ID;

async function updateCollectionSchema() {
  try {
    console.log('Updating radio_state collection schema with scheduling fields...');

    // Add scheduledStartTime field
    try {
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        'scheduledStartTime',
        255,
        false
      );
      console.log('✅ Added scheduledStartTime field');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ scheduledStartTime field already exists');
      } else {
        throw error;
      }
    }

    // Add scheduledEndTime field
    try {
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        'scheduledEndTime',
        255,
        false
      );
      console.log('✅ Added scheduledEndTime field');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ scheduledEndTime field already exists');
      } else {
        throw error;
      }
    }

    // Add scheduledTrackId field
    try {
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        'scheduledTrackId',
        255,
        false
      );
      console.log('✅ Added scheduledTrackId field');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ scheduledTrackId field already exists');
      } else {
        throw error;
      }
    }

    // Add isScheduled field
    try {
      await databases.createBooleanAttribute(
        databaseId,
        collectionId,
        'isScheduled',
        false
      );
      console.log('✅ Added isScheduled field');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ isScheduled field already exists');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Database schema updated successfully!');
    console.log('The radio_state collection now supports scheduling fields.');
    
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
}

updateCollectionSchema();
