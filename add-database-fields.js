import { Client, Databases, Users } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const databases = new Databases(client);

// We'll use the admin user session for this operation
client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

const databaseId = process.env.VITE_DATABASE_ID;
const collectionId = process.env.VITE_RADIO_STATE_COLLECTION_ID;

async function addDatabaseFields() {
  try {
    console.log('🔧 Adding scheduling fields to radio_state collection...');
    console.log(`Database: ${databaseId}`);
    console.log(`Collection: ${collectionId}`);
    
    const fieldsToAdd = [
      {
        key: 'scheduledStartTime',
        type: 'string',
        size: 255,
        required: false,
        description: 'ISO string for when broadcast should start'
      },
      {
        key: 'scheduledEndTime', 
        type: 'string',
        size: 255,
        required: false,
        description: 'ISO string for when broadcast should end'
      },
      {
        key: 'scheduledTrackId',
        type: 'string', 
        size: 255,
        required: false,
        description: 'ID of track to play during scheduled time'
      },
      {
        key: 'isScheduled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Whether there is an active schedule'
      },
      {
        key: 'broadcastStartTime',
        type: 'string',
        size: 255, 
        required: false,
        description: 'ISO string for when current broadcast started'
      }
    ];

    for (const field of fieldsToAdd) {
      try {
        console.log(`\n📝 Adding field: ${field.key} (${field.type})`);
        
        if (field.type === 'string') {
          await databases.createStringAttribute(
            databaseId,
            collectionId,
            field.key,
            field.size,
            field.required
          );
        } else if (field.type === 'boolean') {
          await databases.createBooleanAttribute(
            databaseId,
            collectionId,
            field.key,
            field.required,
            field.default
          );
        }
        
        console.log(`✅ Successfully added ${field.key}`);
        
        // Wait a bit between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Field ${field.key} already exists`);
        } else if (error.message.includes('Unauthorized')) {
          console.log(`❌ Unauthorized access. Need admin API key.`);
          console.log(`\n🔑 Please add APPWRITE_API_KEY to your .env file:`);
          console.log(`1. Go to Appwrite Console > Settings > API Keys`);
          console.log(`2. Create a new API key with Database permissions`);
          console.log(`3. Add to .env: APPWRITE_API_KEY=your_api_key_here`);
          return;
        } else {
          console.error(`❌ Error adding ${field.key}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Database schema update completed!');
    console.log('Now testing if we can update the radio_state document...');
    
    // Test updating the document with new fields
    try {
      const updateData = {
        scheduledStartTime: null,
        scheduledEndTime: null,
        scheduledTrackId: null,
        isScheduled: false,
        broadcastStartTime: null
      };
      
      const updatedDoc = await databases.updateDocument(
        databaseId,
        collectionId,
        'radio_state',
        updateData
      );
      
      console.log('✅ Successfully updated radio_state document with new fields!');
      console.log('📡 The scheduling system is now ready to use!');
      
    } catch (updateError) {
      console.log('⚠️  Could not update document yet, but fields were added.');
      console.log('The fields will be available once Appwrite processes the schema changes.');
    }
    
  } catch (error) {
    console.error('❌ Failed to add database fields:', error);
    
    if (error.message.includes('Missing or invalid API key')) {
      console.log(`\n🔑 You need to add an API key to your .env file:`);
      console.log(`1. Go to Appwrite Console > Settings > API Keys`);
      console.log(`2. Create a new API key with Database permissions`);
      console.log(`3. Add to .env: APPWRITE_API_KEY=your_api_key_here`);
      console.log(`4. Re-run this script: npm run add-fields`);
    }
  }
}

// Alternative method using session token if API key is not available
async function addFieldsWithUserSession() {
  console.log('\n🔄 Attempting alternative method...');
  console.log('This requires you to be logged in as an admin user.');
  
  // This would require implementing session-based auth
  // For now, we'll provide manual instructions
  console.log('\n📋 Manual setup instructions:');
  console.log('Since automated setup requires an API key, please add these fields manually:');
  console.log('\n1. Go to: https://cloud.appwrite.io/console');
  console.log('2. Navigate to your project > Databases > radio_state collection');
  console.log('3. Click "Attributes" tab');
  console.log('4. Add these 5 attributes:');
  
  const fields = [
    'scheduledStartTime (String, Size: 255, Required: No)',
    'scheduledEndTime (String, Size: 255, Required: No)', 
    'scheduledTrackId (String, Size: 255, Required: No)',
    'isScheduled (Boolean, Required: No, Default: false)',
    'broadcastStartTime (String, Size: 255, Required: No)'
  ];
  
  fields.forEach((field, index) => {
    console.log(`   ${index + 1}. ${field}`);
  });
  
  console.log('\n5. After adding all fields, test the scheduling system!');
}

// Check if we have an API key and run appropriate method
if (process.env.APPWRITE_API_KEY) {
  client.setKey(process.env.APPWRITE_API_KEY);
  addDatabaseFields();
} else {
  console.log('⚠️  No APPWRITE_API_KEY found in .env file');
  addFieldsWithUserSession();
}
