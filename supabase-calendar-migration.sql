-- Migration: Add Google Calendar integration support
-- Created: 2025-12-02

-- Create user_tokens table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS user_tokens (
  user_id UUID PRIMARY KEY,
  google_access_token TEXT NOT NULL,
  google_refresh_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_tokens_expiry ON user_tokens(token_expiry);

-- Add calendar-related fields to meetings table
ALTER TABLE meetings 
ADD COLUMN IF NOT EXISTS partner_email TEXT,
ADD COLUMN IF NOT EXISTS send_calendar_invite BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS google_event_id TEXT,
ADD COLUMN IF NOT EXISTS google_event_link TEXT;

-- Add index for google_event_id lookups
CREATE INDEX IF NOT EXISTS idx_meetings_google_event_id ON meetings(google_event_id);

-- Add comment to document the schema
COMMENT ON TABLE user_tokens IS 'Stores Google OAuth tokens for calendar integration';
COMMENT ON COLUMN meetings.partner_email IS 'Email address for sending calendar invitations';
COMMENT ON COLUMN meetings.send_calendar_invite IS 'Whether to send Google Calendar invite for this meeting';
COMMENT ON COLUMN meetings.google_event_id IS 'Google Calendar event ID for syncing';
COMMENT ON COLUMN meetings.google_event_link IS 'Direct link to Google Calendar event';
