import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyColumn() {
  console.log('🔍 Verifying meeting_summary column...\n');

  try {
    // Try to select meeting_summary specifically
    console.log('Test 1: Selecting meeting_summary column');
    const { data: test1, error: error1 } = await supabase
      .from('meetings')
      .select('id, meeting_summary')
      .limit(1);

    if (error1) {
      console.log('❌ Failed:', error1.message);
      console.log('   This means the column does NOT exist in Supabase\n');
      return false;
    } else {
      console.log('✅ Success! Column exists');
      console.log('   Sample data:', test1);
    }

    // Try to insert with meeting_summary
    console.log('\nTest 2: Inserting with meeting_summary');
    const testData = {
      event_id: 'test-verify-column',
      date: '2999-12-31',
      time_slot: '23:59',
      status: 'confirmed',
      meeting_summary: 'This is a test summary'
    };

    const { data: test2, error: error2 } = await supabase
      .from('meetings')
      .insert([testData])
      .select();

    if (error2) {
      console.log('❌ Insert failed:', error2.message);
      return false;
    } else {
      console.log('✅ Insert successful:', test2);

      // Clean up test data
      await supabase
        .from('meetings')
        .delete()
        .eq('event_id', 'test-verify-column');
      console.log('✅ Test data cleaned up');
    }

    console.log('\n🎉 Column verification complete! meeting_summary is working.');
    return true;

  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

verifyColumn();
