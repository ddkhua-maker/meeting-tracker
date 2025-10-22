// Mock data for meetings
export const initialMeetings = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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

// Generate time slots from 10:00 to 15:30 in 30-minute intervals
export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour < 16; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      if (time <= '15:30') {
        slots.push(time);
      }
    }
  }
  return slots;
};

// Date configuration for the event
export const eventDates = ['2025-11-03', '2025-11-04', '2025-11-05', '2025-11-06'];

// Format date to display format: "Nov 3 (Mon)"
export const formatDateDisplay = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  return `${month} ${day} (${weekday})`;
};
