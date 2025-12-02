import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for backend
);

// Google OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/oauth/callback'
);

// Generate authentication URL
app.get('/auth/google', (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    state: userId, // Pass userId through state parameter
    prompt: 'consent' // Force consent screen to get refresh token
  });

  res.json({ authUrl });
});

// OAuth callback handler
app.get('/oauth/callback', async (req, res) => {
  const { code, state: userId } = req.query;

  if (!code || !userId) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=missing_code_or_user`);
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in database
    const { error } = await supabase
      .from('user_tokens')
      .upsert({
        user_id: userId,
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        token_expiry: new Date(tokens.expiry_date).toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing tokens:', error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=token_storage_failed`);
    }

    // Redirect back to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}?calendar_connected=true`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=oauth_failed`);
  }
});

// Get user's calendar connection status
app.get('/auth/status/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from('user_tokens')
      .select('token_expiry')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.json({ connected: false });
    }

    const isExpired = new Date(data.token_expiry) < new Date();
    res.json({ 
      connected: true, 
      expired: isExpired 
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// Refresh access token
app.post('/auth/refresh/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Get refresh token from database
    const { data, error } = await supabase
      .from('user_tokens')
      .select('google_refresh_token')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'No tokens found' });
    }

    // Set refresh token and get new access token
    oauth2Client.setCredentials({
      refresh_token: data.google_refresh_token
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update tokens in database
    await supabase
      .from('user_tokens')
      .update({
        google_access_token: credentials.access_token,
        token_expiry: new Date(credentials.expiry_date).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    res.json({ 
      success: true,
      access_token: credentials.access_token 
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Revoke calendar access
app.post('/auth/revoke/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete tokens from database
    const { error } = await supabase
      .from('user_tokens')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to revoke access' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Revoke error:', error);
    res.status(500).json({ error: 'Failed to revoke access' });
  }
});

// Create calendar event
app.post('/calendar/event', async (req, res) => {
  const { userId, meeting } = req.body;

  if (!userId || !meeting) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get user's access token
    const { data, error } = await supabase
      .from('user_tokens')
      .select('google_access_token, token_expiry')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if token is expired
    if (new Date(data.token_expiry) < new Date()) {
      return res.status(401).json({ error: 'Token expired', needsRefresh: true });
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token: data.google_access_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse date and time
    const dateTime = `${meeting.date}T${meeting.time_slot}:00`;
    const [hours, minutes] = meeting.time_slot.split(':');
    const endHour = parseInt(hours) + 1; // 1 hour duration
    const endTime = `${meeting.date}T${endHour.toString().padStart(2, '0')}:${minutes}:00`;

    // Create event object
    const event = {
      summary: `Meeting with ${meeting.company_name}`,
      description: `
TWG Person: ${meeting.twg_person || 'N/A'}
Partner: ${meeting.partner || 'N/A'}
Phone: ${meeting.phone || 'N/A'}

Agenda:
${meeting.agenda || 'No agenda provided'}
      `.trim(),
      location: meeting.location || '',
      start: {
        dateTime: dateTime,
        timeZone: 'Europe/Rome', // Adjust based on your event location
      },
      end: {
        dateTime: endTime,
        timeZone: 'Europe/Rome',
      },
      attendees: meeting.partner_email ? [{ email: meeting.partner_email }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    // Create the event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: meeting.partner_email ? 'all' : 'none', // Send invites if email provided
    });

    res.json({ 
      success: true, 
      eventId: response.data.id,
      eventLink: response.data.htmlLink 
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
});

// Update calendar event
app.put('/calendar/event/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { userId, meeting } = req.body;

  if (!userId || !meeting) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get user's access token
    const { data, error } = await supabase
      .from('user_tokens')
      .select('google_access_token')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    oauth2Client.setCredentials({
      access_token: data.google_access_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse date and time
    const dateTime = `${meeting.date}T${meeting.time_slot}:00`;
    const [hours, minutes] = meeting.time_slot.split(':');
    const endHour = parseInt(hours) + 1;
    const endTime = `${meeting.date}T${endHour.toString().padStart(2, '0')}:${minutes}:00`;

    const event = {
      summary: `Meeting with ${meeting.company_name}`,
      description: `
TWG Person: ${meeting.twg_person || 'N/A'}
Partner: ${meeting.partner || 'N/A'}
Phone: ${meeting.phone || 'N/A'}

Agenda:
${meeting.agenda || 'No agenda provided'}
      `.trim(),
      location: meeting.location || '',
      start: {
        dateTime: dateTime,
        timeZone: 'Europe/Rome',
      },
      end: {
        dateTime: endTime,
        timeZone: 'Europe/Rome',
      },
      attendees: meeting.partner_email ? [{ email: meeting.partner_email }] : [],
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: event,
      sendUpdates: meeting.partner_email ? 'all' : 'none',
    });

    res.json({ success: true, eventId: response.data.id });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update calendar event' });
  }
});

// Delete calendar event
app.delete('/calendar/event/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  try {
    // Get user's access token
    const { data, error } = await supabase
      .from('user_tokens')
      .select('google_access_token')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    oauth2Client.setCredentials({
      access_token: data.google_access_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all', // Notify attendees of cancellation
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete calendar event' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
