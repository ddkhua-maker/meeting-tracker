import { useState, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import MeetingDetails from './components/MeetingDetails';
import { initialMeetings, eventDates } from './utils/mockData';
import { isSupabaseConfigured } from './lib/supabase';
import {
  fetchMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  subscribeToMeetings
} from './services/meetingService';

function App() {
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(eventDates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load meetings from Supabase or mock data
  const loadMeetings = useCallback(async () => {
    setIsLoading(true);

    const { data, error } = await fetchMeetings('sigma-rome-2025');

    if (error) {
      if (import.meta.env.DEV) console.error('Error loading meetings:', error);
      // Fallback to mock data
      setMeetings(initialMeetings);
    } else {
      setMeetings(data || []);
    }

    setIsLoading(false);
  }, []);

  // Load meetings on mount
  useEffect(() => {
    loadMeetings();

    // Subscribe to real-time updates if Supabase is configured
    let subscription = null;
    if (isSupabaseConfigured()) {
      subscription = subscribeToMeetings('sigma-rome-2025', (payload) => {
        if (import.meta.env.DEV) console.log('Real-time update:', payload);
        
        // Optimistically update state based on event type
        if (payload.eventType === 'INSERT') {
          setMeetings(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setMeetings(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
        } else if (payload.eventType === 'DELETE') {
          setMeetings(prev => prev.filter(m => m.id !== payload.old.id));
        }
      });
    }

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [loadMeetings]);

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
    if (import.meta.env.DEV) {
      console.log('🔵 App.jsx handleSaveMeeting - Received formData:', formData);
      console.log('🔵 meeting_summary in formData:', formData.meeting_summary);
    }

    // Check if this is a "clear meeting" operation (all fields empty except date/time/status)
    const isClearing = selectedMeeting && 
      !formData.company_name && 
      !formData.twg_person && 
      !formData.partner;

    if (selectedMeeting) {
      // Update existing meeting
      if (import.meta.env.DEV) console.log('🔵 Updating existing meeting ID:', selectedMeeting.id);
      
      // Optimistic update
      const updatedMeeting = { ...selectedMeeting, ...formData };
      setMeetings(prev =>
        prev.map(m =>
          m.id === selectedMeeting.id ? updatedMeeting : m
        )
      );

      const { error } = await updateMeeting(selectedMeeting.id, formData);

      if (error) {
        if (import.meta.env.DEV) console.error('Error updating meeting:', error);
        alert(isClearing ? 'Failed to clear meeting data' : 'Failed to update meeting');
        // Rollback on error
        setMeetings(prev =>
          prev.map(m =>
            m.id === selectedMeeting.id ? selectedMeeting : m
          )
        );
        return;
      }
    } else {
      // Create new meeting
      if (import.meta.env.DEV) console.log('🔵 Creating new meeting');
      const { data, error } = await createMeeting(formData);

      if (error) {
        if (import.meta.env.DEV) console.error('Error creating meeting:', error);
        alert('Failed to create meeting');
        return;
      }

      // Add to local state (real-time subscription will also add it, but this is immediate)
      if (!isSupabaseConfigured()) {
        setMeetings(prev => [...prev, data]);
      }
    }

    handleCloseDetails();
  };

  // Handle delete meeting
  const handleDeleteMeeting = async (meetingId) => {
    if (!meetingId) {
      if (import.meta.env.DEV) console.error('No meeting ID provided');
      return { error: 'No meeting ID provided' };
    }

    if (import.meta.env.DEV) console.log('🔵 Deleting meeting ID:', meetingId);
    
    // Optimistically remove from state
    const previousMeetings = meetings;
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
    
    const { error } = await deleteMeeting(meetingId);
    
    if (error) {
      if (import.meta.env.DEV) console.error('Error deleting meeting:', error);
      // Rollback - restore previous state
      setMeetings(previousMeetings);
      return { error };
    }
    
    handleCloseDetails();
    return { error: null };
  };


  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-app-bg dark:bg-dark-app-bg transition-theme duration-300">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent dark:border-dark-accent border-r-transparent"></div>
          <p className="mt-3 text-secondary-text dark:text-dark-secondary-text">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-app-bg dark:bg-dark-app-bg transition-theme duration-300">
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
            onDelete={handleDeleteMeeting}
          />
        </div>
      )}

      {/* Empty state for right panel on desktop when nothing selected */}
      {!isDetailsOpen && (
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 items-center justify-center bg-card-bg dark:bg-dark-card-bg border-l border-gray-200 dark:border-gray-700 transition-theme duration-300">
          <div className="text-center text-secondary-text dark:text-dark-secondary-text">
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
            <p className="text-lg font-medium text-primary-text dark:text-dark-primary-text">Select a time slot</p>
            <p className="text-sm">Click on a time slot to view or create a meeting</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
