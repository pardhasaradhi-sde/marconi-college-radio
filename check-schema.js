import { Client, Databases } from 'appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

const databaseId = process.env.VITE_DATABASE_ID;
const collectionId = process.env.VITE_RADIO_STATE_COLLECTION_ID;

async function addSchedulingFields() {
  try {
    console.log('Checking current radio state document...');
    
    // Get current document
    const document = await databases.getDocument(databaseId, collectionId, 'radio_state');
    console.log('Current document fields:', Object.keys(document));
    
    // Update document with scheduling fields if they don't exist
    const updateData = {};
    
    if (!document.hasOwnProperty('scheduledStartTime')) {
      updateData.scheduledStartTime = null;
    }
    if (!document.hasOwnProperty('scheduledEndTime')) {
      updateData.scheduledEndTime = null;
    }
    if (!document.hasOwnProperty('scheduledTrackId')) {
      updateData.scheduledTrackId = null;
    }
    if (!document.hasOwnProperty('isScheduled')) {
      updateData.isScheduled = false;
    }
    if (!document.hasOwnProperty('broadcastStartTime')) {
      updateData.broadcastStartTime = null;
    }
    
    if (Object.keys(updateData).length > 0) {
      console.log('Updating document with scheduling fields:', updateData);
      
      const updatedDoc = await databases.updateDocument(
        databaseId,
        collectionId,
        'radio_state',
        updateData
      );
      
      console.log('✅ Document updated successfully!');
      console.log('Updated document:', JSON.stringify(updatedDoc, null, 2));
    } else {
      console.log('✅ All scheduling fields already exist!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error.message.includes('Invalid document structure')) {
      console.log('\n📝 The collection schema needs to be updated first.');
      console.log('Please add these fields to the radio_state collection in Appwrite Console:');
      console.log('- scheduledStartTime (String, Optional)');
      console.log('- scheduledEndTime (String, Optional)'); 
      console.log('- scheduledTrackId (String, Optional)');
      console.log('- isScheduled (Boolean, Optional, Default: false)');
      console.log('- broadcastStartTime (String, Optional)');
      console.log('\nTo do this:');
      console.log('1. Go to your Appwrite Console');
      console.log('2. Navigate to Databases > Your Database > radio_state collection');
      console.log('3. Go to Attributes tab');
      console.log('4. Add each field with the specified type and make them optional');
      console.log('5. Re-run this script');
    }
  }
}

addSchedulingFields();
