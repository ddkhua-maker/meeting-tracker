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
    const insertData = {
      event_id: 'sigma-rome-2025',
      ...meetingData
    };

    if (import.meta.env.DEV) {
      console.log('📤 Creating meeting with data:', insertData);
      console.log('📋 meeting_summary in data:', insertData.meeting_summary);
    }

    const { data, error } = await supabase
      .from('meetings')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      if (import.meta.env.DEV) console.error('❌ Create error:', error);
    } else {
      if (import.meta.env.DEV) console.log('✅ Meeting created:', data);
    }

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
    if (import.meta.env.DEV) {
      console.log('📤 Updating meeting ID:', id);
      console.log('📤 Update data:', meetingData);
      console.log('📋 meeting_summary in data:', meetingData.meeting_summary);
    }

    const { data, error } = await supabase
      .from('meetings')
      .update(meetingData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (import.meta.env.DEV) console.error('❌ Update error:', error);
    } else {
      if (import.meta.env.DEV) console.log('✅ Meeting updated:', data);
    }

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
    if (import.meta.env.DEV) console.log('🗑️ Deleting meeting ID:', id);
    
    const { data, error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      if (import.meta.env.DEV) console.error('❌ Delete error:', error);
    } else {
      if (import.meta.env.DEV) console.log('✅ Meeting deleted:', data);
    }

    return { error };
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error deleting meeting:', error);
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
