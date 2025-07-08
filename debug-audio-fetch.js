import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // Using API key for server-side access

const databases = new Databases(client);

async function testAudioFileFetch() {
  console.log('🔍 Testing audio file fetch...');
  console.log('Database ID:', process.env.VITE_DATABASE_ID);
  console.log('Collection ID:', process.env.VITE_AUDIO_FILES_COLLECTION_ID);
  
  try {
    // Try to list documents like the frontend does
    const response = await databases.listDocuments(
      process.env.VITE_DATABASE_ID,
      process.env.VITE_AUDIO_FILES_COLLECTION_ID,
      [Query.orderDesc('uploadedAt')]
    );
    
    console.log('✅ Successfully fetched documents:', response.documents.length);
    response.documents.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.songName || doc.fileName} by ${doc.artist || 'Unknown'}`);
      console.log(`   ID: ${doc.$id}`);
      console.log(`   File ID: ${doc.fileId}`);
      console.log(`   Uploaded: ${doc.uploadedAt}`);
      console.log('   Permissions:', doc.$permissions);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error fetching audio files:', error);
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testAudioFileFetch();
