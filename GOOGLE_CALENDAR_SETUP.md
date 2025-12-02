# Google Calendar Integration Setup Guide

This guide will walk you through setting up Google Calendar integration for the Meeting Tracker application.

## Prerequisites

- Google account (Gmail)
- Access to Google Cloud Console
- Meeting Tracker application running locally
- Supabase project configured

---

## Part 1: Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown (top left, next to "Google Cloud")
3. Click "NEW PROJECT"
4. Enter project details:
   - **Project name**: `Meeting Tracker` (or your preferred name)
   - **Organization**: Leave as "No organization" (unless you have one)
5. Click **CREATE**
6. Wait for project creation, then select your new project from the dropdown

### Step 2: Enable Google Calendar API

1. In the left sidebar, navigate to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on **Google Calendar API**
4. Click the **ENABLE** button
5. Wait for the API to be enabled (usually takes a few seconds)

### Step 3: Configure OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace organization)
3. Click **CREATE**

4. Fill in the App Information:
   - **App name**: `Meeting Tracker`
   - **User support email**: Your email address
   - **App logo**: (Optional) Upload your app logo
   - **Application home page**: `http://localhost:5173` (for development)
   - **Application privacy policy link**: (Optional, can skip for now)
   - **Application terms of service link**: (Optional, can skip for now)
   - **Authorized domains**: (Leave empty for local development)
   - **Developer contact email**: Your email address

5. Click **SAVE AND CONTINUE**

6. **Scopes** screen:
   - Click **ADD OR REMOVE SCOPES**
   - Search for "Google Calendar API"
   - Select: `https://www.googleapis.com/auth/calendar.events`
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**

7. **Test users** screen:
   - Click **+ ADD USERS**
   - Add email addresses of team members who will test the app (up to 100 users)
   - Include your own email
   - Click **ADD**
   - Click **SAVE AND CONTINUE**

8. Review and click **BACK TO DASHBOARD**

### Step 4: Create OAuth 2.0 Credentials

1. In the left sidebar, go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**

3. Configure OAuth client:
   - **Application type**: Select **Web application**
   - **Name**: `Meeting Tracker Web Client`

4. **Authorized JavaScript origins**:
   - Click **+ ADD URI**
   - Add: `http://localhost:5173` (frontend URL)
   - Add: `http://localhost:3001` (backend URL)

5. **Authorized redirect URIs**:
   - Click **+ ADD URI**
   - Add: `http://localhost:3001/oauth/callback`
   - ⚠️ **IMPORTANT**: This must match exactly with `GOOGLE_REDIRECT_URI` in `.env`

6. Click **CREATE**

7. **Save your credentials**:
   - A popup will show your **Client ID** and **Client Secret**
   - **Copy both values** - you'll need them for the `.env` file
   - You can also download the JSON file for safekeeping
   - Click **OK**

---

## Part 2: Database Setup

### Step 1: Run Migration in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **+ New query**
5. Copy the contents of `supabase-calendar-migration.sql` from the project
6. Paste into the SQL editor
7. Click **RUN** to execute the migration
8. Verify tables were created:
   - Go to **Table Editor**
   - You should see new table: `user_tokens`
   - Check `meetings` table has new columns: `partner_email`, `send_calendar_invite`, `google_event_id`, `google_event_link`

### Step 2: Get Supabase Service Key

1. In Supabase Dashboard, go to **Settings** → **API**
2. Under "Project API keys", find **service_role** key
3. Click **Reveal** and copy the key
4. ⚠️ **WARNING**: This is a secret key with full database access. Never commit it to Git!

---

## Part 3: Environment Configuration

### Step 1: Create `.env` File

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your editor

3. Fill in the Google Calendar values:
   ```env
   # Supabase Configuration (already filled)
   VITE_SUPABASE_URL=https://ezschiacgkrwysbfgyvc.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Backend Configuration
   VITE_BACKEND_URL=http://localhost:3001
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (paste your service_role key)
   GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com (paste from Google Cloud Console)
   GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrst (paste from Google Cloud Console)
   GOOGLE_REDIRECT_URI=http://localhost:3001/oauth/callback
   FRONTEND_URL=http://localhost:5173
   PORT=3001
   ```

4. Save the file

5. ⚠️ **IMPORTANT**: Add `.env` to `.gitignore` (should already be there)

---

## Part 4: Running the Application

### Step 1: Start Both Frontend and Backend

**Option A: Run both together (recommended)**
```bash
npm run dev:all
```

**Option B: Run separately (for debugging)**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run dev:server
```

### Step 2: Verify Backend is Running

1. Open browser to: `http://localhost:3001/health`
2. You should see: `{"status":"ok","timestamp":"..."}`

### Step 3: Verify Frontend is Running

1. Open browser to: `http://localhost:5173`
2. Meeting Tracker should load normally

---

## Part 5: Testing the Integration

### Step 1: Connect Google Calendar

1. Open Meeting Tracker in browser
2. Click the **Settings gear icon** (top right in Calendar header)
3. Event Settings modal opens
4. Scroll down to **Google Calendar** section
5. Click **Connect Google Calendar** button
6. Google OAuth popup opens
7. Sign in with your Google account (must be a test user you added)
8. Review permissions requested (access to calendar events)
9. Click **Allow**
10. Popup closes automatically
11. You should see "✅ Connected" status in the settings

### Step 2: Create a Meeting with Calendar Invite

1. Close the Event Settings modal
2. Click on an empty time slot in the calendar
3. Fill in the meeting form:
   - **Status**: Confirmed
   - **TWG Person**: Your name
   - **Company Name**: Test Company
   - **Partner**: Partner Name
   - **Phone**: +1234567890
   - **Partner Email**: `partner@example.com` (use a real email you can access for testing)
   - **Location**: Conference Room A
   - **Agenda**: "Test meeting to verify calendar integration"
   - **Send Calendar Invite**: Toggle **ON** (should be blue)
4. Click **Save Meeting**

### Step 3: Verify Calendar Event Created

1. Open [Google Calendar](https://calendar.google.com)
2. Check your primary calendar
3. You should see a new event: "Meeting with Test Company"
4. Event details should include:
   - Date and time from the time slot
   - Location: Conference Room A
   - Description with TWG Person, Partner, Phone, and Agenda
   - Partner email added as attendee

### Step 4: Check Partner's Email

1. Check the inbox of the partner email you used
2. You should receive a Google Calendar invitation email
3. Email contains:
   - Meeting details
   - Accept/Decline/Maybe buttons
   - Add to Calendar link

### Step 5: Test Update Meeting

1. In Meeting Tracker, click on the meeting you just created
2. Click **Edit** button
3. Change the **Agenda** to something different
4. Click **Save Changes**
5. Check Google Calendar - event should be updated
6. Partner should receive an "Event Updated" email

### Step 6: Test Delete Meeting

1. Click on the meeting in Meeting Tracker
2. Click **Clear Meeting Data** button
3. Confirm deletion
4. Check Google Calendar - event should be deleted
5. Partner should receive a "Cancellation" email

---

## Part 6: Production Deployment

### Step 1: Update OAuth Redirect URIs

1. Go back to Google Cloud Console
2. **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add production URLs to **Authorized JavaScript origins**:
   - Add: `https://your-app.vercel.app`
5. Add production URL to **Authorized redirect URIs**:
   - Add: `https://your-backend.vercel.app/oauth/callback`
   - OR if using same domain: `https://your-app.vercel.app/api/oauth/callback`
6. Click **SAVE**

### Step 2: Update Environment Variables on Vercel

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add all variables from `.env`:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_BACKEND_URL (your production backend URL)
   SUPABASE_SERVICE_KEY
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   GOOGLE_REDIRECT_URI (production callback URL)
   FRONTEND_URL (production frontend URL)
   PORT
   ```
4. Click **Save**
5. Redeploy your application

### Step 3: Deploy Backend

**Option A: Deploy to Vercel (Serverless)**
- Create `api/` folder for serverless functions
- Convert Express routes to Vercel serverless functions

**Option B: Deploy to separate backend service**
- Use Railway, Render, or Heroku for Node.js backend
- Update `VITE_BACKEND_URL` to point to deployed backend

### Step 4: Publish OAuth App (Optional)

If you want to allow anyone to use the app (not just test users):

1. Go to Google Cloud Console
2. **APIs & Services** → **OAuth consent screen**
3. Click **PUBLISH APP**
4. Submit for verification (Google will review your app)
5. This process can take several days to weeks

For now, keeping it in "Testing" mode with specific test users is fine.

---

## Troubleshooting

### Issue: "Error 400: redirect_uri_mismatch"

**Cause**: The redirect URI in your OAuth request doesn't match the one configured in Google Cloud Console.

**Solution**:
1. Check `.env` file - `GOOGLE_REDIRECT_URI` should be `http://localhost:3001/oauth/callback`
2. Check Google Cloud Console → Credentials → Your OAuth Client → Authorized redirect URIs
3. Make sure they match exactly (including `http://` vs `https://`)
4. Restart your backend server after changing `.env`

### Issue: "Access blocked: This app's request is invalid"

**Cause**: OAuth consent screen not configured properly.

**Solution**:
1. Go to Google Cloud Console → OAuth consent screen
2. Make sure status is "Testing"
3. Add your email to test users
4. Complete all required fields in App Information

### Issue: "Calendar invite not sent"

**Causes**:
- Google Calendar not connected
- No partner email provided
- Toggle "Send Calendar Invite" is OFF
- Backend not running

**Solution**:
1. Check Settings → Google Calendar shows "Connected"
2. Verify partner email is filled in
3. Verify toggle is ON (blue)
4. Check backend is running: `http://localhost:3001/health`
5. Check browser console for errors

### Issue: "Token expired" error

**Cause**: OAuth access token expired (they last 1 hour).

**Solution**:
- The app should automatically refresh tokens
- If it fails, disconnect and reconnect Google Calendar in Settings

### Issue: Backend crashes on startup

**Cause**: Missing environment variables.

**Solution**:
1. Check `.env` file exists in project root
2. Verify all required variables are filled
3. Restart backend: `npm run dev:server`
4. Check terminal for specific error message

---

## Security Best Practices

1. **Never commit `.env` file** - It contains secret keys
2. **Use different credentials** for development and production
3. **Limit test users** to only your team during development
4. **Rotate secrets** if they're accidentally exposed
5. **Enable 2FA** on your Google account
6. **Review OAuth permissions** regularly
7. **Monitor API usage** in Google Cloud Console

---

## API Limits

Google Calendar API has the following limits:
- **Queries per day**: 1,000,000
- **Queries per 100 seconds per user**: 5,000

For a team of 10 people, this is more than enough. Monitor usage in Google Cloud Console if needed.

---

## Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Check backend terminal for error logs
3. Verify all environment variables are set correctly
4. Test with a simple meeting first
5. Make sure you're using a test user email

---

## Next Steps

Once calendar integration is working:
1. Test with all 10 team members
2. Train team on how to use the feature
3. Consider adding Google Meet link generation
4. Explore two-way sync (import from calendar to app)
5. Add email templates customization

**Congratulations!** Your Google Calendar integration is now set up and ready to use! 🎉
