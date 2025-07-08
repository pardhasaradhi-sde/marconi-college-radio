// Update radio state schema to include broadcastStartTime
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client();
client
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('685e439700344bac94ff')
  .setKey('standard_0f1b6633e1e31c7d3c4c2e7d4b4be9e6ab8bb95dbe8a2b51a9e97dba54c0e90b88e3a4c4ad4aa90e1f75b28ad30e1e8ed7ee4abf9de5c3d72f8b4a9c6e5f1d3b98');

const databases = new Databases(client);

async function updateRadioState() {
  try {
    console.log('Updating radio state to include broadcastStartTime...');
    
    // Update the document to add broadcastStartTime field
    const result = await databases.updateDocument(
      '685e441b000cf8d070f6', // DATABASE_ID
      '685e473c001b905e751a', // RADIO_STATE_COLLECTION_ID
      '685e47500033dbcaa8d4', // RADIO_STATE_DOC_ID
      {
        broadcastStartTime: null, // Initialize as null
      }
    );
    
    console.log('✅ Radio state updated successfully:', result);
    
    // Test the new startBroadcast functionality
    console.log('\n📡 Testing time-based broadcast...');
    
    const broadcastStart = new Date().toISOString();
    const testResult = await databases.updateDocument(
      '685e441b000cf8d070f6',
      '685e473c001b905e751a',
      '685e47500033dbcaa8d4',
      {
        isPlaying: true,
        broadcastStartTime: broadcastStart,
        currentTime: 0, // Reset current time 
        timestamp: broadcastStart
      }
    );
    
    console.log('✅ Test broadcast started at:', broadcastStart);
    console.log('Updated state:', testResult);
    
    // Calculate a test position after 5 seconds
    setTimeout(() => {
      const now = Date.now();
      const startTime = new Date(broadcastStart).getTime();
      const elapsed = (now - startTime) / 1000;
      
      console.log(`\n⏱️  After ${elapsed.toFixed(1)} seconds:`);
      console.log(`Calculated position for 30s track: ${elapsed % 30} seconds`);
      console.log(`Calculated position for 240s track: ${elapsed % 240} seconds`);
    }, 5000);
    
  } catch (error) {
    console.error('❌ Error updating radio state:', error);
  }
}

updateRadioState();
