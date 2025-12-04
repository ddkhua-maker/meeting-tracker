import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

async function getAuthClient() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data, error } = await supabase
    .from('user_tokens')
    .select('*')
    .eq('user_id', 1)
    .single();

  if (error || !data) {
    throw new Error('No authentication tokens found');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: data.google_access_token,
    refresh_token: data.google_refresh_token
  });

  // Handle token refresh
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.refresh_token) {
      await supabase
        .from('user_tokens')
        .update({
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
          token_expiry: new Date(tokens.expiry_date)
        })
        .eq('user_id', 1);
    }
  });

  return oauth2Client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { meeting } = req.body;

    if (!meeting || !meeting.partner_email) {
      return res.status(400).json({ error: 'Meeting data and partner email are required' });
    }

    const auth = await getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: `Meeting with ${meeting.company_name || 'Client'}`,
      description: `
Partner: ${meeting.twg_person || 'N/A'}
Company: ${meeting.company_name || 'N/A'}
Phone: ${meeting.phone_number || 'N/A'}

Agenda:
${meeting.agenda || 'No agenda provided'}
      `.trim(),
      location: meeting.location || '',
      start: {
        dateTime: new Date(meeting.date + 'T' + meeting.time_slot).toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(new Date(meeting.date + 'T' + meeting.time_slot).getTime() + 30 * 60000).toISOString(),
        timeZone: 'UTC'
      },
      attendees: [
        { email: meeting.partner_email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all'
    });

    res.json({
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message || 'Failed to create calendar event' });
  }
}
