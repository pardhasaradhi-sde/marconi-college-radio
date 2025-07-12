import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey('standard_28da71762a60f74e5b2d38a888524315dd126beff16a1e68ea1463574b2a2e69bf3040215feae6dd94272f0989de188b3f7639a2bb2b17eae7dcd68543e478eefbb1533c98986c7cd91e8038f9c4ff6679f535e215fcb0c84aa2b7151cd2a017aa138fcb65a44abdaa80a368ceacefda1f80e97bb97ac7694507f7afc142a082'); // Replace with your actual API key from Appwrite Console

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_DATABASE_ID;
const ANNOUNCEMENTS_COLLECTION_ID = process.env.VITE_ANNOUNCEMENTS_COLLECTION_ID || 'announcements';

async function createCollectionIfNotExists(databaseId, collectionId, collectionName) {
  try {
    // Try to get the collection first
    await databases.getCollection(databaseId, collectionId);
    console.log(`⚠ Collection already exists: ${collectionName} (${collectionId})`);
    return false; // Collection exists
  } catch (error) {
    if (error.code === 404) {
      // Collection doesn't exist, create it
      try {
        await databases.createCollection(
          databaseId,
          collectionId,
          collectionName,
          [
            Permission.read(Role.any()),
            Permission.write(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
          ]
        );
        console.log(`✓ Created collection: ${collectionName} (${collectionId})`);
        return true; // Collection created
      } catch (createError) {
        console.error(`✗ Error creating collection ${collectionName}:`, createError.message);
        throw createError;
      }
    } else {
      console.error(`✗ Error checking collection ${collectionName}:`, error.message);
      throw error;
    }
  }
}

async function createAttributeIfNotExists(databaseId, collectionId, createFunction, attributeName) {
  try {
    await createFunction();
    console.log(`✓ Created attribute: ${attributeName}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠ Attribute already exists: ${attributeName}`);
    } else {
      console.error(`✗ Error creating attribute ${attributeName}:`, error.message);
      throw error;
    }
  }
}

async function setupAnnouncementsCollection() {
  console.log('Setting up announcements collection...');

  try {
    // Create the announcements collection
    const collectionCreated = await createCollectionIfNotExists(
      DATABASE_ID, 
      ANNOUNCEMENTS_COLLECTION_ID, 
      'Announcements'
    );

    // Create attributes for announcements collection
    console.log('\nCreating announcements collection attributes...');
    
    await createAttributeIfNotExists(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 'title', 255, true), 'title');
    
    await createAttributeIfNotExists(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 'content', 5000, true), 'content');
    
    await createAttributeIfNotExists(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 'imageId', 255, false), 'imageId');
    
    await createAttributeIfNotExists(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 'imageUrl', 2000, false), 'imageUrl');
    
    await createAttributeIfNotExists(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 'eventDate', 255, false), 'eventDate');
    
    await createAttributeIfNotExists(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 
      () => databases.createBooleanAttribute(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 'isActive', true), 'isActive');
    
    await createAttributeIfNotExists(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 'createdBy', 255, true), 'createdBy');
    
    await createAttributeIfNotExists(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 'createdAt', 255, true), 'createdAt');
    
    await createAttributeIfNotExists(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 
      () => databases.createStringAttribute(DATABASE_ID, ANNOUNCEMENTS_COLLECTION_ID, 'updatedAt', 255, true), 'updatedAt');

    console.log('\n✓ Announcements collection setup complete!');
    
    if (collectionCreated) {
      console.log('\n📢 Announcements collection has been created successfully!');
      console.log('🔧 You can now use the AnnouncementManager in the admin dashboard.');
    } else {
      console.log('\n📢 Announcements collection was already configured.');
    }

  } catch (error) {
    console.error('Error setting up announcements collection:', error);
    process.exit(1);
  }
}

// Check if required environment variables are set
if (!process.env.VITE_APPWRITE_ENDPOINT || !process.env.VITE_APPWRITE_PROJECT_ID || !process.env.VITE_DATABASE_ID) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_APPWRITE_ENDPOINT');
  console.error('   - VITE_APPWRITE_PROJECT_ID');
  console.error('   - VITE_DATABASE_ID');
  console.error('   - VITE_ANNOUNCEMENTS_COLLECTION_ID (optional, defaults to "announcements")');
  process.exit(1);
}

console.log('🚀 Starting announcements collection setup...');
console.log(`📊 Database ID: ${DATABASE_ID}`);
console.log(`📢 Collection ID: ${ANNOUNCEMENTS_COLLECTION_ID}`);

setupAnnouncementsCollection();
