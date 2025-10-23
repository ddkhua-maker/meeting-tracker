import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumn() {
  console.log('🔄 Attempting to add meeting_summary column...\n');

  try {
    // First, let's check if we can query the table
    console.log('📋 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('meetings')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection error:', testError);
      process.exit(1);
    }

    console.log('✅ Database connection successful\n');

    // Try to add a meeting with the new field to test if column exists
    console.log('🔍 Testing if meeting_summary column exists...');
    const { error: insertError } = await supabase
      .from('meetings')
      .insert([{
        event_id: 'test-column-check',
        date: '2999-12-31',
        time_slot: '23:59',
        status: 'confirmed',
        meeting_summary: 'test'
      }])
      .select();

    if (insertError && insertError.message.includes('meeting_summary')) {
      console.log('❌ Column does not exist yet\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 MANUAL ACTION REQUIRED');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('Please follow these steps:\n');
      console.log('1. Open your Supabase Dashboard:');
      console.log('   https://supabase.com/dashboard/project/ezschiacgkrwysbfgyvc\n');
      console.log('2. Click on "SQL Editor" in the left sidebar\n');
      console.log('3. Click "New Query"\n');
      console.log('4. Copy and paste this SQL:\n');
      console.log('   ┌─────────────────────────────────────────────────┐');
      console.log('   │ ALTER TABLE meetings                            │');
      console.log('   │ ADD COLUMN IF NOT EXISTS meeting_summary TEXT;  │');
      console.log('   └─────────────────────────────────────────────────┘\n');
      console.log('5. Click "Run" or press Ctrl+Enter\n');
      console.log('6. You should see: "Success. No rows returned"\n');
      console.log('7. Refresh your application and try again\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // Delete the test record if it was inserted
      await supabase
        .from('meetings')
        .delete()
        .eq('event_id', 'test-column-check');

    } else if (insertError) {
      console.error('❌ Unexpected error:', insertError);
    } else {
      console.log('✅ Column already exists!\n');
      console.log('Cleaning up test data...');

      // Delete the test record
      await supabase
        .from('meetings')
        .delete()
        .eq('event_id', 'test-column-check');

      console.log('✅ Test data cleaned up');
      console.log('\n🎉 The meeting_summary column is ready to use!');
      console.log('Refresh your application and the error should be gone.\n');
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

addColumn();
