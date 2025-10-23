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

async function runMigration() {
  console.log('🔄 Running migration: Add meeting_summary column...');

  try {
    // Add the meeting_summary column using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meeting_summary TEXT;'
    });

    if (error) {
      // If the RPC function doesn't exist, we'll provide instructions
      console.log('\n⚠️  Note: The migration SQL needs to be run manually in Supabase SQL Editor.');
      console.log('\n📋 Run this SQL in your Supabase dashboard:');
      console.log('----------------------------------------');
      console.log('ALTER TABLE meetings');
      console.log('ADD COLUMN IF NOT EXISTS meeting_summary TEXT;');
      console.log('----------------------------------------\n');
      console.log('✅ The application will work once the column is added.');
      console.log('📄 You can also find the migration SQL in: add-meeting-summary-migration.sql\n');
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('✅ meeting_summary column added to meetings table');
    }

    // Verify the column exists by checking table structure
    const { data: meetings, error: selectError } = await supabase
      .from('meetings')
      .select('*')
      .limit(1);

    if (!selectError) {
      console.log('✅ Database connection verified');
    }

  } catch (err) {
    console.error('❌ Migration error:', err.message);
    console.log('\n📋 Please run this SQL manually in your Supabase SQL Editor:');
    console.log('----------------------------------------');
    console.log('ALTER TABLE meetings');
    console.log('ADD COLUMN IF NOT EXISTS meeting_summary TEXT;');
    console.log('----------------------------------------\n');
  }
}

runMigration();
