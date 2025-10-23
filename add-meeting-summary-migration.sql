-- Migration: Add meeting_summary column to meetings table
-- Run this SQL in your Supabase SQL Editor to add the new field

-- Add meeting_summary column (nullable text field)
ALTER TABLE meetings
ADD COLUMN IF NOT EXISTS meeting_summary TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'meetings' AND column_name = 'meeting_summary';
