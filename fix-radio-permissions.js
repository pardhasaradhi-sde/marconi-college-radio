import { Client, Databases, Permission, Role } from 'node-appwrite';

async function fixRadioStatePermissions() {
  try {
    const client = new Client()
      .setEndpoint('https://nyc.cloud.appwrite.io/v1')
      .setProject('685e439700344bac94ff')
      .setKey('standard_34b61f5a67e5daa8b9a62b74b7398a27bc58d8ffd7a1ce34d15ff46fe5e04b0fb7aa8e62a6bb7e8398f2e3bd9fae3a58c96b3f7de87d5bc4dadd9a4b8b9aae8ee94e5c0ba92ed8ccc4c4b28a09e26d842b4bdb7dfe8f8b2ef2f4cf2a5d8f24b3a'); // Server-side API key

    const databases = new Databases(client);
    
    console.log('Fixing radio state document permissions...');
    
    // Update the document with proper permissions
    try {
      const result = await databases.updateDocument(
        '685e441b000cf8d070f6', // DATABASE_ID
        '685e473c001b905e751a', // RADIO_STATE_COLLECTION_ID
        'radio_state',
        {}, // No data updates, just permissions
        [
          Permission.read(Role.any()),           // Anyone can read
          Permission.update(Role.any()),         // Anyone can update (we'll limit this in app logic)
          Permission.delete(Role.any())          // Anyone can delete (admin only in practice)
        ]
      );
      
      console.log('✅ Successfully updated radio state permissions!');
      console.log('New permissions:', result.$permissions);
      
    } catch (error) {
      console.log('❌ Error updating radio state permissions:', error.message);
      
      // Try to recreate the document with proper permissions
      console.log('Attempting to recreate the document...');
      
      // First delete the existing one (if possible)
      try {
        await databases.deleteDocument(
          '685e441b000cf8d070f6', // DATABASE_ID
          '685e473c001b905e751a', // RADIO_STATE_COLLECTION_ID
          'radio_state'
        );
        console.log('✅ Deleted existing document');
      } catch (deleteError) {
        console.log('Could not delete existing document:', deleteError.message);
      }
      
      // Create new one with proper permissions
      try {
        const newDoc = await databases.createDocument(
          '685e441b000cf8d070f6', // DATABASE_ID
          '685e473c001b905e751a', // RADIO_STATE_COLLECTION_ID
          'radio_state',
          {
            isPlaying: false,
            currentTime: 0,
            currentTrack: null,
            timestamp: new Date().toISOString()
          },
          [
            Permission.read(Role.any()),           // Anyone can read
            Permission.update(Role.any()),         // Anyone can update
            Permission.delete(Role.any())          // Anyone can delete
          ]
        );
        
        console.log('✅ Successfully created new radio state document with proper permissions!');
        console.log('Permissions:', newDoc.$permissions);
        
      } catch (createError) {
        console.log('❌ Error creating new document:', createError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
}

fixRadioStatePermissions();
