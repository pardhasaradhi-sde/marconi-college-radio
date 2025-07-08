import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function fixAudioFilePermissions() {
  console.log('🔧 Fixing audio file permissions...');
  
  try {
    // First, get all audio files using admin permissions
    const response = await databases.listDocuments(
      process.env.VITE_DATABASE_ID,
      process.env.VITE_AUDIO_FILES_COLLECTION_ID
    );
    
    console.log(`📁 Found ${response.documents.length} audio files to update`);
    
    // Update permissions for each document
    for (const doc of response.documents) {
      console.log(`🔄 Updating permissions for: ${doc.songName || doc.fileName}`);
      console.log(`   Current permissions:`, doc.$permissions);
      
      try {
        // Update with new permissions that allow any authenticated user to read
        await databases.updateDocument(
          process.env.VITE_DATABASE_ID,
          process.env.VITE_AUDIO_FILES_COLLECTION_ID,
          doc.$id,
          {}, // No data changes
          [
            Permission.read(Role.any()),  // Allow anyone to read
            Permission.update(Role.user(doc.uploadedBy)), // Only uploader can update
            Permission.delete(Role.user(doc.uploadedBy))  // Only uploader can delete
          ]
        );
        console.log(`   ✅ Updated permissions for ${doc.songName || doc.fileName}`);
      } catch (error) {
        console.error(`   ❌ Failed to update ${doc.songName || doc.fileName}:`, error.message);
      }
    }
    
    console.log('🎉 Finished updating permissions!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixAudioFilePermissions();
