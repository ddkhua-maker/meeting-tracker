import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import MeetingDetails from './components/MeetingDetails';
import { initialMeetings, eventDates } from './utils/mockData';
import { isSupabaseConfigured } from './lib/supabase';
import {
  fetchMeetings,
  createMeeting,
  updateMeeting,
  subscribeToMeetings
} from './services/meetingService';

function App() {
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(eventDates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load meetings on mount
  useEffect(() => {
    loadMeetings();

    // Subscribe to real-time updates if Supabase is configured
    let subscription = null;
    if (isSupabaseConfigured()) {
      subscription = subscribeToMeetings('sigma-rome-2025', (payload) => {
        console.log('Real-time update:', payload);
        // Reload meetings on any change
        loadMeetings();
      });
    }

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Load meetings from Supabase or mock data
  const loadMeetings = async () => {
    setIsLoading(true);

    const { data, error } = await fetchMeetings('sigma-rome-2025');

    if (error) {
      console.error('Error loading meetings:', error);
      // Fallback to mock data
      setMeetings(initialMeetings);
    } else {
      setMeetings(data || []);
    }

    setIsLoading(false);
  };

  // Handle slot click (empty or filled)
  const handleSlotClick = (timeSlot, meeting) => {
    setSelectedSlot(timeSlot);
    setSelectedMeeting(meeting || null);
    setIsDetailsOpen(true);
  };

  // Handle close details panel
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedSlot(null);
    setSelectedMeeting(null);
  };

  // Handle save meeting (create or update)
  const handleSaveMeeting = async (formData) => {
    console.log('🔵 App.jsx handleSaveMeeting - Received formData:', formData);
    console.log('🔵 meeting_summary in formData:', formData.meeting_summary);

    if (selectedMeeting) {
      // Update existing meeting
      console.log('🔵 Updating existing meeting ID:', selectedMeeting.id);
      const { error } = await updateMeeting(selectedMeeting.id, formData);

      if (error) {
        console.error('Error updating meeting:', error);
        alert('Failed to update meeting');
        return;
      }

      // Update local state
      setMeetings(prev =>
        prev.map(m =>
          m.id === selectedMeeting.id
            ? { ...m, ...formData }
            : m
        )
      );
    } else {
      // Create new meeting
      console.log('🔵 Creating new meeting');
      const { data, error } = await createMeeting(formData);

      if (error) {
        console.error('Error creating meeting:', error);
        alert('Failed to create meeting');
        return;
      }

      // Add to local state
      setMeetings(prev => [...prev, data]);
    }

    handleCloseDetails();

    // Reload to ensure sync with database
    if (isSupabaseConfigured()) {
      loadMeetings();
    }
  };


  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile: Full screen modal, Desktop: Two-column layout */}

      {/* Left Panel - Calendar */}
      <div className={`${
        isDetailsOpen ? 'hidden lg:block' : 'block'
      } w-full lg:w-1/2 xl:w-2/5`}>
        <Calendar
          meetings={meetings}
          onSlotClick={handleSlotClick}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Right Panel - Meeting Details */}
      {isDetailsOpen && (
        <div className={`${
          isDetailsOpen ? 'block' : 'hidden lg:block'
        } w-full lg:w-1/2 xl:w-3/5 lg:border-l lg:border-gray-200`}>
          <MeetingDetails
            meeting={selectedMeeting}
            timeSlot={selectedSlot}
            selectedDate={selectedDate}
            onClose={handleCloseDetails}
            onSave={handleSaveMeeting}
          />
        </div>
      )}

      {/* Empty state for right panel on desktop when nothing selected */}
      {!isDetailsOpen && (
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 items-center justify-center bg-white border-l border-gray-200">
          <div className="text-center text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg font-medium">Select a time slot</p>
            <p className="text-sm">Click on a time slot to view or create a meeting</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
