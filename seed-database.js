// Seed database with sample meetings
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Seeding database with sample meetings...');

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleMeetings = [
  {
    event_id: 'sigma-rome-2025',
    date: '2025-11-03',
    time_slot: '10:00',
    status: 'confirmed',
    twg_person: 'John Smith',
    company_name: 'Tech Solutions Inc',
    partner: 'Sarah Johnson',
    phone: '+1 555-0123',
    location: 'Conference Room A',
    agenda: 'Discuss partnership opportunities and Q4 strategy'
  },
  {
    event_id: 'sigma-rome-2025',
    date: '2025-11-03',
    time_slot: '11:30',
    status: 'in_process',
    twg_person: 'Emma Davis',
    company_name: 'Global Marketing Co',
    partner: 'Michael Chen',
    phone: '+1 555-0456',
    location: 'Meeting Room B',
    agenda: 'Review marketing campaign results'
  },
  {
    event_id: 'sigma-rome-2025',
    date: '2025-11-04',
    time_slot: '14:00',
    status: 'not_confirmed',
    twg_person: 'Robert Brown',
    company_name: 'Innovation Labs',
    partner: 'Lisa Anderson',
    phone: '+1 555-0789',
    location: 'Board Room',
    agenda: 'Product demo and technical discussion'
  },
  {
    event_id: 'sigma-rome-2025',
    date: '2025-11-05',
    time_slot: '10:30',
    status: 'confirmed',
    twg_person: 'Alice Wilson',
    company_name: 'Future Ventures',
    partner: 'David Martinez',
    phone: '+1 555-0321',
    location: 'Executive Suite',
    agenda: 'Investment opportunities and growth strategies'
  }
];

async function seedDatabase() {
  try {
    console.log(`Inserting ${sampleMeetings.length} sample meetings...`);

    const { data, error } = await supabase
      .from('meetings')
      .insert(sampleMeetings)
      .select();

    if (error) {
      console.error('❌ Error inserting data:', error.message);
      console.error('Details:', error);
      process.exit(1);
    }

    console.log('✅ Successfully inserted meetings!');
    console.log(`Inserted ${data.length} meetings:`);
    data.forEach((meeting, index) => {
      console.log(`  ${index + 1}. ${meeting.date} ${meeting.time_slot} - ${meeting.company_name} (${meeting.status})`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

seedDatabase();
