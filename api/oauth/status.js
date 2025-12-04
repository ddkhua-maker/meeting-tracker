import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Check if user has valid tokens
    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', 1)
      .single();

    if (error || !data) {
      return res.json({ connected: false });
    }

    // Check if token is expired
    const isExpired = new Date(data.token_expiry) < new Date();

    res.json({
      connected: true,
      expired: isExpired
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check connection status' });
  }
}
