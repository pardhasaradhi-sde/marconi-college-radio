import { Client, Databases, Account, Permission, Role } from 'node-appwrite';

async function fixRadioStateWithAdminAuth() {
  try {
    const client = new Client()
      .setEndpoint('https://nyc.cloud.appwrite.io/v1')
      .setProject('685e439700344bac94ff');

    const account = new Account(client);
    const databases = new Databases(client);
    
    console.log('Logging in as admin user...');
    
    // Login as admin first (you'll need to provide admin credentials)
    const adminEmail = 'gollapallisupreeth@gmail.com'; // Your admin email
    console.log(`Please make sure the admin user (${adminEmail}) exists and you know the password.`);
    console.log('You may need to manually log in and fix this in the Appwrite Console instead.');
    
    // Instead of trying to automate login, let's provide manual steps
    console.log('\n🔧 MANUAL FIX REQUIRED:');
    console.log('1. Go to Appwrite Console: https://cloud.appwrite.io/console');
    console.log('2. Navigate to your project > Databases > radioState collection');
    console.log('3. Click on the "radio_state" document');
    console.log('4. Go to "Settings" or "Permissions" tab');
    console.log('5. Set these permissions:');
    console.log('   - Read: Role: Any');
    console.log('   - Update: Role: Any');
    console.log('   - Delete: Role: Any');
    console.log('6. Save the changes');
    console.log('\nAlternatively, delete the document and run the init-radio-state.js script again.');
    
    // Check current status
    try {
      const document = await databases.getDocument(
        '685e441b000cf8d070f6', // DATABASE_ID
        '685e473c001b905e751a', // RADIO_STATE_COLLECTION_ID
        'radio_state'
      );
      console.log('\nCurrent document permissions:', document.$permissions);
    } catch (error) {
      console.log('Cannot read document:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixRadioStateWithAdminAuth();
