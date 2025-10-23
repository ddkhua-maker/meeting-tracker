# Meeting Tracker

A web application for managing conference meetings at SiGMA Central Europe 2025.

## Features

- Two-column layout with calendar view and meeting details
- Search meetings by company name, TWG person, or partner
- Date selector with auto-calculated weekdays
- Time slot management (10:00 - 15:30, 30-min intervals)
- Meeting status tracking (Confirmed, Not Confirmed, In Process)
- Color-coded status indicators
- Create, edit, and delete meetings
- Mobile responsive design with full-screen modal

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Mock Data** - In-memory storage (Supabase integration ready)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
meeting-tracker/
├── src/
│   ├── components/
│   │   ├── Calendar.jsx          # Left panel - calendar and time slots
│   │   └── MeetingDetails.jsx    # Right panel - meeting form
│   ├── utils/
│   │   └── mockData.js           # Mock data and helper functions
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles with Tailwind
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
└── vite.config.js                # Vite configuration
```

## Mock Data

Currently using in-memory mock data. The application includes 4 sample meetings across different dates and time slots.

## Supabase Integration

The application is ready for Supabase integration! Follow these steps:

1. **Setup Supabase**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions
2. **Create `.env` file**: Copy `.env.example` and add your credentials
3. **Run the SQL schema**: Execute `supabase-schema.sql` in Supabase SQL Editor
4. **Restart dev server**: The app will automatically connect to Supabase

The app works in two modes:
- **With Supabase**: Full database persistence and real-time updates
- **Without Supabase**: Uses mock data (in-memory, lost on refresh)

## Next Steps

- Add user authentication
- Add export functionality (CSV, PDF)
- Add filters and advanced search
- Add email notifications
- Add calendar view
- Add recurring meetings

## Color Scheme

- **Sigma Yellow**: #FFD93D (Active date button)
- **Confirmed**: Green background (#86EFAC)
- **Not Confirmed**: Red background (#FCA5A5)
- **In Process**: Yellow background (#FCD34D)
- **Add Meeting**: Blue (#4299E1)

