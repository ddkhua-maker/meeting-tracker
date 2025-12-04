import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    // Store tokens in Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // For now, use a single user approach (user_id = 1)
    // In production, you'd use actual user authentication
    const { error } = await supabase
      .from('user_tokens')
      .upsert({
        user_id: 1,
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        token_expiry: new Date(tokens.expiry_date)
      });

    if (error) {
      console.error('Error storing tokens:', error);
      return res.redirect(`${process.env.FRONTEND_URL}?auth=error`);
    }

    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?auth=error`);
  }
}
