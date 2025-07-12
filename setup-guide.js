import { Client, Account, Teams } from 'appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const account = new Account(client);
const teams = new Teams(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

async function setupApiKey() {
  try {
    console.log('🔐 Appwrite API Key Setup Guide');
    console.log('=====================================\n');
    
    console.log('To add database fields automatically, you need an API key.');
    console.log('Here\'s how to get one:\n');
    
    console.log('1. 🌐 Go to: https://cloud.appwrite.io/console');
    console.log('2. 📂 Select your project (Marconi College Radio)');
    console.log('3. ⚙️  Go to Settings → API Keys');
    console.log('4. ➕ Click "Create API Key"');
    console.log('5. 📝 Give it a name like "Database Schema Manager"');
    console.log('6. 🔓 Grant these permissions:');
    console.log('   - ✅ Database (Read, Write)');
    console.log('   - ✅ Collection (Read, Write)');
    console.log('7. 💾 Copy the generated API key');
    console.log('8. 📄 Add to your .env file: APPWRITE_API_KEY=your_api_key_here');
    console.log('9. 🚀 Run: npm run add-fields\n');
    
    console.log('🎯 Quick copy-paste for .env:');
    console.log('APPWRITE_API_KEY=your_api_key_here\n');
    
    console.log('📋 Alternative: Manual Database Setup');
    console.log('=====================================');
    console.log('If you prefer to add fields manually:\n');
    
    console.log('1. Go to: https://cloud.appwrite.io/console');
    console.log('2. Navigate to: Project → Databases → radio_state collection → Attributes');
    console.log('3. Add these 5 attributes:\n');
    
    const fields = [
      { name: 'scheduledStartTime', type: 'String', size: '255', required: 'No' },
      { name: 'scheduledEndTime', type: 'String', size: '255', required: 'No' },
      { name: 'scheduledTrackId', type: 'String', size: '255', required: 'No' },
      { name: 'isScheduled', type: 'Boolean', required: 'No', default: 'false' },
      { name: 'broadcastStartTime', type: 'String', size: '255', required: 'No' }
    ];
    
    fields.forEach((field, index) => {
      console.log(`   ${index + 1}. Field Name: ${field.name}`);
      console.log(`      Type: ${field.type}`);
      if (field.size) console.log(`      Size: ${field.size}`);
      console.log(`      Required: ${field.required}`);
      if (field.default) console.log(`      Default: ${field.default}`);
      console.log('');
    });
    
    console.log('🎉 After adding the fields, your scheduling system will be ready!');
    console.log('📱 Test it by going to Admin Dashboard → Schedule tab\n');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

setupApiKey();
