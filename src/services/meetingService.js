import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialMeetings } from '../utils/mockData';

// Fetch all meetings for an event
export const fetchMeetings = async (eventId = 'sigma-rome-2025') => {
  if (!isSupabaseConfigured()) {
    // Return mock data if Supabase is not configured
    return { data: initialMeetings, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true });

    return { data, error };
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return { data: null, error };
  }
};

// Create a new meeting
export const createMeeting = async (meetingData) => {
  if (!isSupabaseConfigured()) {
    // Return mock success if Supabase is not configured
    const newMeeting = {
      id: Date.now().toString(),
      event_id: 'sigma-rome-2025',
      ...meetingData
    };
    return { data: newMeeting, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('meetings')
      .insert([{
        event_id: 'sigma-rome-2025',
        ...meetingData
      }])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error creating meeting:', error);
    return { data: null, error };
  }
};

// Update an existing meeting
export const updateMeeting = async (id, meetingData) => {
  if (!isSupabaseConfigured()) {
    // Return mock success if Supabase is not configured
    return { data: { id, ...meetingData }, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('meetings')
      .update(meetingData)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error updating meeting:', error);
    return { data: null, error };
  }
};

// Delete a meeting
export const deleteMeeting = async (id) => {
  if (!isSupabaseConfigured()) {
    // Return mock success if Supabase is not configured
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return { error };
  }
};

// Subscribe to real-time changes
export const subscribeToMeetings = (eventId, callback) => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const subscription = supabase
    .channel('meetings-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'meetings',
        filter: `event_id=eq.${eventId}`
      },
      callback
    )
    .subscribe();

  return subscription;
};
