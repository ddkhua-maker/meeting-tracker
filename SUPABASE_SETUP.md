# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Meeting Tracker application.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in (or create an account)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Meeting Tracker (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to provision (2-3 minutes)

## Step 2: Create the Database Table

1. In your Supabase project dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL
6. You should see a success message

This will create:
- The `meetings` table with all required columns
- Indexes for better performance
- Row Level Security (RLS) policies
- A trigger to auto-update timestamps
- Sample data (4 meetings)

## Step 3: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll see two important values:
   - **Project URL** (starts with https://...)
   - **anon public** key (long string under "Project API keys")
4. Copy both values

## Step 4: Configure Your Application

1. In your project root, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Make sure `.env` is in your `.gitignore` (it already is!)

## Step 5: Restart Your Development Server

1. Stop the current dev server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

3. The application will now connect to Supabase!

## Verifying the Setup

1. Open your application in the browser
2. Open browser DevTools (F12) and check the Console
3. You should see the sample meetings loaded
4. Try creating a new meeting
5. Go to Supabase dashboard → Table Editor → meetings table
6. You should see your new meeting in the database!

## Real-time Updates

The application is configured for real-time updates. If you:
- Open the app in multiple browser windows/tabs
- Make changes in one window
- Changes will automatically appear in other windows!

## Testing Without Supabase

The application works without Supabase configured:
- It will use mock data from `src/utils/mockData.js`
- All CRUD operations work in-memory
- Data is lost on page refresh

## Troubleshooting

### Issue: "Failed to load meetings"
- Check your `.env` file has correct credentials
- Verify your Supabase project is active
- Check browser console for detailed error messages

### Issue: "Row Level Security" errors
- The SQL schema includes permissive RLS policies
- For production, customize the policies in `supabase-schema.sql`
- Currently allows all operations for all users

### Issue: Changes not appearing
- Check if real-time is enabled in Supabase (it's on by default)
- Verify the subscription in browser console
- Refresh the page to force reload

## Security Notes

### For Development
- Current RLS policies allow all operations
- This is fine for development/testing

### For Production
You should update the RLS policies to:
- Require authentication
- Restrict access based on user roles
- Add user_id column to track meeting owners

Example production policy:
```sql
-- Require authentication
CREATE POLICY "Authenticated users only" ON meetings
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can only modify their own meetings
CREATE POLICY "Users manage own meetings" ON meetings
  FOR ALL USING (auth.uid()::text = user_id);
```

## Database Schema

The `meetings` table structure:
- `id` - UUID primary key (auto-generated)
- `event_id` - Text (e.g., "sigma-rome-2025")
- `date` - Date (e.g., 2025-11-03)
- `time_slot` - Text (e.g., "10:00")
- `status` - Text (confirmed, not_confirmed, in_process)
- `twg_person` - Text (nullable)
- `company_name` - Text (nullable)
- `partner` - Text (nullable)
- `phone` - Text (nullable)
- `location` - Text (nullable)
- `agenda` - Text (nullable)
- `created_at` - Timestamp (auto-generated)
- `updated_at` - Timestamp (auto-updated)

## Next Steps

After Supabase is working:
1. Add user authentication
2. Customize RLS policies for your security needs
3. Add more events (update event_id in the app)
4. Consider adding:
   - File attachments for meetings
   - Meeting notes/minutes
   - Email notifications
   - Export functionality

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

For application issues:
- Check the browser console for errors
- Verify the data structure matches the schema
- Test with mock data first (remove .env)
