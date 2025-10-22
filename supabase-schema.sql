-- Meeting Tracker Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create the meetings table

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'not_confirmed', 'in_process')),
  twg_person TEXT,
  company_name TEXT,
  partner TEXT,
  phone TEXT,
  location TEXT,
  agenda TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on event_id for faster queries
CREATE INDEX IF NOT EXISTS idx_meetings_event_id ON meetings(event_id);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date);

-- Create composite index on event_id, date, and time_slot for uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_meetings_unique_slot
  ON meetings(event_id, date, time_slot);

-- Enable Row Level Security (RLS)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
-- Modify these policies based on your security requirements
CREATE POLICY "Enable read access for all users" ON meetings
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON meetings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON meetings
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON meetings
  FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO meetings (event_id, date, time_slot, status, twg_person, company_name, partner, phone, location, agenda)
VALUES
  ('sigma-rome-2025', '2025-11-03', '10:00', 'confirmed', 'John Smith', 'Tech Solutions Inc', 'Sarah Johnson', '+1 555-0123', 'Conference Room A', 'Discuss partnership opportunities and Q4 strategy'),
  ('sigma-rome-2025', '2025-11-03', '11:30', 'in_process', 'Emma Davis', 'Global Marketing Co', 'Michael Chen', '+1 555-0456', 'Meeting Room B', 'Review marketing campaign results'),
  ('sigma-rome-2025', '2025-11-04', '14:00', 'not_confirmed', 'Robert Brown', 'Innovation Labs', 'Lisa Anderson', '+1 555-0789', 'Board Room', 'Product demo and technical discussion'),
  ('sigma-rome-2025', '2025-11-05', '10:30', 'confirmed', 'Alice Wilson', 'Future Ventures', 'David Martinez', '+1 555-0321', 'Executive Suite', 'Investment opportunities and growth strategies')
ON CONFLICT (event_id, date, time_slot) DO NOTHING;
