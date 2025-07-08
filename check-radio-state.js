import { Client, Databases, Account } from 'node-appwrite';

async function checkRadioState() {
  try {
    const client = new Client()
      .setEndpoint('https://nyc.cloud.appwrite.io/v1')
      .setProject('685e439700344bac94ff');
    
    const databases = new Databases(client);
    
    console.log('Checking radio state document...');
    
    // Try to get the radio state document
    try {
      const document = await databases.getDocument(
        '685e441b000cf8d070f6', // DATABASE_ID
        '685e473c001b905e751a', // RADIO_STATE_COLLECTION_ID
        'radio_state'
      );
      
      console.log('✅ Radio state document found:');
      console.log('- Document ID:', document.$id);
      console.log('- Is Playing:', document.isPlaying);
      console.log('- Current Time:', document.currentTime);
      console.log('- Current Track:', document.currentTrack ? 'Set' : 'Not set');
      console.log('- Permissions:', document.$permissions);
      console.log('- Created At:', document.$createdAt);
      console.log('- Updated At:', document.$updatedAt);
      
    } catch (error) {
      if (error.code === 404) {
        console.log('❌ Radio state document not found (ID: radio_state)');
        console.log('Need to create it or check the document ID');
      } else {
        console.log('❌ Error accessing radio state document:', error.message);
      }
    }
    
    // Try to list all documents in the collection
    console.log('\nListing all documents in radio state collection...');
    try {
      const response = await databases.listDocuments(
        '685e441b000cf8d070f6', // DATABASE_ID
        '685e473c001b905e751a'  // RADIO_STATE_COLLECTION_ID
      );
      
      console.log(`Found ${response.documents.length} documents:`);
      response.documents.forEach((doc, index) => {
        console.log(`${index + 1}. ID: ${doc.$id}, Permissions: ${JSON.stringify(doc.$permissions)}`);
      });
      
    } catch (error) {
      console.log('❌ Error listing documents:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
}

checkRadioState();
