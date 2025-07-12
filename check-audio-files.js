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
const AUDIO_FILES_COLLECTION_ID = process.env.VITE_AUDIO_FILES_COLLECTION_ID;

async function listAudioFiles() {
  console.log('🎵 Checking audio files in database...');
  console.log('Database ID:', DATABASE_ID);
  console.log('Collection ID:', AUDIO_FILES_COLLECTION_ID);

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      AUDIO_FILES_COLLECTION_ID
    );

    console.log(`\n📊 Found ${response.documents.length} audio files in database:`);
    
    if (response.documents.length === 0) {
      console.log('❌ No audio files found. You need to upload some files first.');
      console.log('\nSteps to upload:');
      console.log('1. Login as admin in your app');
      console.log('2. Go to Admin Dashboard → Upload Manager');
      console.log('3. Upload audio files');
    } else {
      response.documents.forEach((doc, index) => {
        console.log(`\n${index + 1}. ${doc.songName || doc.fileName}`);
        console.log(`   Artist: ${doc.artist || 'Unknown'}`);
        console.log(`   File: ${doc.fileName}`);
        console.log(`   Uploaded: ${doc.uploadedAt}`);
        console.log(`   ID: ${doc.$id}`);
      });
    }

  } catch (error) {
    console.error('❌ Error fetching audio files:', error);
    
    if (error.code === 404) {
      console.log('\n💡 This might mean:');
      console.log('- Collection doesn\'t exist');
      console.log('- Wrong collection ID in .env file');
      console.log('- Database doesn\'t exist');
    }
  }
}

listAudioFiles();
