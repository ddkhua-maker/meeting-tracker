// Test Supabase connection
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✓ Present' : '✗ Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection by fetching meetings
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Connection error:', error.message);
      console.error('Details:', error);
      process.exit(1);
    }

    console.log('✅ Connection successful!');
    console.log(`Found ${data.length} meetings in database`);

    if (data.length > 0) {
      console.log('\nSample meeting:', data[0]);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

testConnection();
