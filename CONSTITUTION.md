# Meeting Tracker - Application Constitution

**Version:** 1.0  
**Last Updated:** December 2, 2025  
**Application Type:** Conference Meeting Management System  
**Target Users:** Event organizers, conference coordinators, business development teams

---

## 1. Application Overview

Meeting Tracker is a modern, real-time web application designed for managing conference meetings during multi-day events. It provides a comprehensive system for scheduling, tracking, and documenting business meetings with an intuitive interface that supports both light and dark themes.

### Core Purpose
- Centralized meeting management for conference events
- Real-time collaboration across team members
- Efficient scheduling with visual time slot management
- Comprehensive meeting documentation and follow-up tracking

---

## 2. Technical Architecture

### 2.1 Technology Stack

**Frontend Framework:**
- React 19.1.1 (functional components with hooks)
- Vite 7.1.14 (Rolldown-based build tool)
- JavaScript/JSX

**Styling:**
- Tailwind CSS 3.4.1
- Custom design system with theme support
- Responsive utility-first approach

**Backend & Database:**
- Supabase 2.76.1 (PostgreSQL with real-time subscriptions)
- RESTful API communication
- WebSocket for live updates

**State Management:**
- React Context API (ThemeContext, EventContext)
- localStorage for client-side persistence
- Real-time state synchronization via Supabase

**Build & Development:**
- Vite with Hot Module Replacement (HMR)
- PostCSS for CSS processing
- ESLint for code quality

### 2.2 Project Structure

```
meeting-tracker/
├── src/
│   ├── components/          # React components
│   │   ├── Calendar.jsx           # Left panel with time slots
│   │   ├── MeetingDetails.jsx     # Right panel with meeting info
│   │   ├── ThemeToggle.jsx        # Light/dark mode switcher
│   │   ├── EventSettings.jsx      # Admin panel for event config
│   │   └── ErrorBoundary.jsx      # Error recovery component
│   ├── context/             # Global state management
│   │   ├── ThemeContext.jsx       # Theme persistence
│   │   └── EventContext.jsx       # Event configuration
│   ├── services/            # API layer
│   │   └── meetingService.js      # Supabase CRUD operations
│   ├── lib/                 # External integrations
│   │   └── supabase.js            # Supabase client config
│   ├── utils/               # Helper functions
│   │   └── mockData.js            # Mock data for development
│   ├── App.jsx              # Main application container
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles & Tailwind imports
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind theme customization
├── postcss.config.js       # PostCSS plugins
├── eslint.config.js        # ESLint rules
└── package.json            # Dependencies & scripts
```

### 2.3 Database Schema (Supabase)

**Table: `meetings`**
```sql
id              UUID PRIMARY KEY
event_id        TEXT (e.g., 'sigma-rome-2025')
date            DATE
time_slot       TEXT (e.g., '10:00', '11:30')
status          TEXT ('confirmed', 'not_confirmed', 'in_process')
twg_person      TEXT
company_name    TEXT
partner         TEXT
phone           TEXT
location        TEXT
agenda          TEXT
meeting_summary TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

**Real-time Features:**
- INSERT/UPDATE/DELETE event subscriptions
- Automatic state synchronization across clients
- Optimistic UI updates with rollback on errors

---

## 3. Feature Specification

### 3.1 Core Features

#### Calendar & Scheduling
- **Dynamic Date Management:** Event dates automatically generated based on configuration
- **Time Slot Grid:** 30-minute intervals from 10:00 to 15:30
- **Visual Status Indicators:** Color-coded badges for meeting status
- **Date Navigation:** Quick access to all event dates
- **Real-time Updates:** Instant synchronization across all users

#### Meeting Management
- **Create Meetings:** Click empty time slot to add new meeting
- **Edit Meetings:** Click existing meeting to modify details
- **Delete Meetings:** Clear meeting data with confirmation
- **Status Tracking:** Confirmed, Not Confirmed, In Process
- **Comprehensive Fields:**
  - TWG Person (team member)
  - Company Name
  - Partner contact
  - Phone number (with copy-to-clipboard)
  - Location
  - Meeting Agenda
  - Meeting Summary (for post-meeting notes)

#### Search & Filtering
- **Real-time Search:** Filter by company name, TWG person, or partner
- **Dynamic Results:** Instant filtering with result count
- **Clear Search:** One-click to reset filters
- **Smart Filtering:** Only shows time slots with matches during search

#### Event Configuration (Admin Panel)
- **Event Name:** Customizable event title (default: "Sigma")
- **Date Range:** Start and end date configuration
- **Duration Control:** Set number of days (2-365)
- **Date Validation:** Ensures end date is after start date
- **Live Preview:** Real-time preview of event configuration
- **Persistence:** Settings saved to localStorage

### 3.2 User Interface

#### Design System

**Light Theme Colors:**
- Background: `#F8F9FA`
- Card Background: `#FFFFFF`
- Accent: `#6C94F2`
- Primary Text: `#2C3E50`
- Secondary Text: `#6C757D`

**Dark Theme Colors:**
- Background: `#1A1D23`
- Card Background: `#25282E`
- Accent: `#5B82E8`
- Primary Text: `#E8EAED`
- Secondary Text: `#9AA0A6`

**Status Badge Colors:**

*Confirmed Status:*
- Light: Background `#D4EDDA`, Text `#155724`, Dot `#28A745`, Border `#C3E6CB`
- Dark: Background `#2D4A3E`, Text `#A8E6CF`, Dot `#4ADE80`, Border `#3D5A4E`

*Pending/In Process Status:*
- Light: Background `#FFF3CD`, Text `#856404`, Dot `#FFC107`, Border `#FFEAA7`
- Dark: Background `#4A4230`, Text `#FFE4A3`, Dot `#FCD34D`, Border `#5A5240`

**Accessibility:**
- WCAG 4.5:1 contrast ratio compliance
- Keyboard navigation support
- Screen reader compatible
- Focus indicators on interactive elements

#### Responsive Layout

**Desktop (≥1024px):**
- Two-column layout (Calendar | Meeting Details)
- Left panel: 40% width
- Right panel: 60% width
- Both panels visible simultaneously

**Tablet & Mobile (<1024px):**
- Single column layout
- Full-screen modal for meeting details
- Optimized touch targets
- Swipe-friendly interactions

### 3.3 Performance Optimizations

- **useCallback hooks** for memoized functions
- **useMemo** for expensive computations
- **Optimistic UI updates** for instant feedback
- **Error boundaries** for graceful crash recovery
- **Lazy loading** of components
- **Debounced search** to reduce re-renders
- **Real-time subscriptions** with cleanup
- **Memory leak prevention** (setTimeout cleanup)

### 3.4 Error Handling

- **Network Errors:** Graceful fallback to mock data
- **Validation Errors:** User-friendly error messages
- **CRUD Failures:** Rollback with state restoration
- **Real-time Connection Loss:** Automatic reconnection
- **Development Mode Logging:** Console debugging with emojis (🔵, 🗑️, ✅, ❌)
- **Production Mode:** Silent error handling with user notifications

---

## 4. User Workflows

### 4.1 Creating a New Meeting

1. Select event date from date navigation
2. Click on empty time slot (displays "+ Add meeting")
3. Meeting details panel opens in edit mode
4. Fill in required fields:
   - Status (default: Confirmed)
   - TWG Person
   - Company Name
   - Partner
   - Phone
   - Location
   - Agenda
5. Click "Save Meeting"
6. Time slot updates with company name
7. Toast notification confirms save
8. Real-time sync to all connected clients

### 4.2 Editing an Existing Meeting

1. Click on filled time slot
2. Meeting details panel opens in view mode
3. Click "Edit" button
4. Modify fields as needed
5. Click "Save Changes"
6. Optimistic UI update
7. Real-time sync to database
8. Rollback on error with notification

### 4.3 Deleting a Meeting

1. Click on filled time slot
2. Click "Clear Meeting Data" button
3. Confirmation prompt appears
4. Confirm deletion
5. Meeting removed from time slot
6. State updated optimistically
7. Database deletion confirmed

### 4.4 Configuring Event Settings

1. Click gear icon in Calendar header
2. Event Settings modal opens
3. Enter event name (e.g., "TechConf 2025")
4. Select start date
5. Select end date OR enter number of days
6. Preview shows event configuration
7. Click "Save Settings"
8. Calendar updates with new event name and dates
9. Date buttons regenerated for new range
10. Settings persist to localStorage

### 4.5 Searching for Meetings

1. Type in search bar (top of Calendar)
2. Real-time filtering as you type
3. Shows only time slots matching:
   - Company name
   - TWG person
   - Partner name
4. Result count displayed
5. Click "X" to clear search
6. All time slots reappear

---

## 5. Data Management

### 5.1 Data Flow

**Create Meeting:**
```
User Input → Validation → Optimistic State Update → Supabase Insert → 
Real-time Broadcast → All Clients Update
```

**Update Meeting:**
```
User Edit → Validation → Optimistic State Update → Supabase Update → 
Real-time Broadcast → All Clients Sync
```

**Delete Meeting:**
```
User Confirm → Optimistic State Removal → Supabase Delete → 
Real-time Broadcast → All Clients Remove
```

**Real-time Subscription:**
```
Component Mount → Subscribe to 'meetings' table → 
Listen for INSERT/UPDATE/DELETE → Update Local State → 
Component Unmount → Unsubscribe
```

### 5.2 State Management Strategy

**Local State (useState):**
- Meetings array
- Selected date
- Selected time slot
- Selected meeting
- UI flags (isDetailsOpen, isSettingsOpen)
- Search query

**Context State:**
- Theme (light/dark)
- Event configuration (name, dates)

**Persistent State (localStorage):**
- Theme preference (key: `meeting-tracker-theme`)
- Event configuration (key: `meeting-tracker-event-config`)

**Server State (Supabase):**
- All meeting records
- Real-time subscriptions

### 5.3 Data Validation Rules

**Meeting Fields:**
- Date: ISO 8601 format (YYYY-MM-DD)
- Time Slot: HH:MM format (10:00-15:30, 30-min intervals)
- Status: Must be 'confirmed', 'not_confirmed', or 'in_process'
- Phone: Free text (optional)
- All text fields: Max 500 characters

**Event Configuration:**
- Event Name: Required, 1-100 characters
- Start Date: Required, valid date
- End Date: Required, must be ≥ start date
- Duration: 1-365 days

---

## 6. Security & Privacy

### 6.1 Authentication
- Currently: Open access (no authentication)
- Future: Supabase Auth with row-level security (RLS)

### 6.2 Data Protection
- Client-side validation before database writes
- Server-side validation via Supabase RLS policies
- HTTPS/TLS encryption in transit
- No sensitive data stored in localStorage

### 6.3 Rate Limiting
- Supabase connection pooling
- Debounced search queries
- Throttled real-time updates

---

## 7. Deployment & Operations

### 7.1 Production Environment

**Hosting:** Vercel
- Automatic deployments from GitHub main branch
- Server-side rendering (SSR) support
- CDN edge caching
- Automatic HTTPS

**Database:** Supabase
- Hosted PostgreSQL
- Real-time WebSocket server
- RESTful API endpoints
- Project URL: `ezschiacgkrwysbfgyvc.supabase.co`

### 7.2 Environment Configuration

**Development:**
```
NODE_ENV=development
VITE_SUPABASE_URL=https://ezschiacgkrwysbfgyvc.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

**Production:**
- Same environment variables
- Build optimizations enabled
- Source maps disabled
- Console logs suppressed (via `import.meta.env.DEV` guards)

### 7.3 Monitoring

**Development Mode:**
- Detailed console logging with emojis
- Error stack traces
- Performance warnings
- Real-time event logs

**Production Mode:**
- Silent error handling
- User-facing error messages
- Analytics ready (not yet implemented)

---

## 8. Browser Compatibility

### 8.1 Supported Browsers

**Desktop:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Mobile:**
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

### 8.2 Required Features
- ES6+ JavaScript support
- CSS Grid & Flexbox
- localStorage API
- Fetch API
- WebSocket support
- CSS custom properties (variables)

---

## 9. Future Enhancements

### 9.1 Planned Features
- User authentication & authorization
- Role-based access control (Admin, User, Viewer)
- Export meetings to CSV/PDF
- Email notifications for new/updated meetings
- Calendar import/export (iCal format)
- Meeting reminders
- Recurring meetings
- File attachments
- Meeting notes with rich text editor
- Analytics dashboard
- Multi-language support
- Mobile native apps (React Native)

### 9.2 Technical Improvements
- Progressive Web App (PWA) support
- Offline mode with sync
- Advanced search with filters
- Bulk operations
- Undo/redo functionality
- Meeting templates
- Drag-and-drop rescheduling
- Time zone support
- Meeting conflict detection

---

## 10. Development Guidelines

### 10.1 Code Standards

**JavaScript/React:**
- Functional components only (no class components except ErrorBoundary)
- Hooks for state management
- PropTypes or TypeScript for type checking (future)
- ESLint rules enforced
- Consistent naming conventions (camelCase for variables, PascalCase for components)

**CSS/Styling:**
- Tailwind utility classes
- Custom theme colors in tailwind.config.js
- Avoid inline styles (use Tailwind)
- Consistent spacing (4px/8px/12px/16px grid)
- Dark mode via class-based approach

**File Organization:**
- One component per file
- Component name matches filename
- Group related files in folders
- Barrel exports for cleaner imports

### 10.2 Git Workflow

**Branch Strategy:**
- `main` - Production branch
- Feature branches for new work
- Commit messages: Descriptive with context

**Commit Message Format:**
```
<type>: <subject>

<body>

<footer>
```

Example:
```
feat: Add event configuration admin panel with dynamic date management

- EventContext for global event configuration
- EventSettings modal with date pickers
- Dynamic date generation based on event period
```

### 10.3 Testing Strategy (Future)

**Unit Tests:**
- React Testing Library
- Jest for test runner
- Mock Supabase client

**Integration Tests:**
- Cypress for E2E testing
- Test critical user workflows

**Performance Tests:**
- Lighthouse CI
- Core Web Vitals monitoring

---

## 11. Maintenance & Support

### 11.1 Update Cadence
- React & dependencies: Quarterly updates
- Security patches: Immediate
- Feature releases: Bi-weekly sprints

### 11.2 Known Limitations
- No offline support (requires internet connection)
- Single event management (no multi-event support yet)
- Limited search capabilities (no advanced filters)
- No user authentication (open access)

### 11.3 Troubleshooting

**Common Issues:**

*Supabase Connection Errors:*
- Check environment variables
- Verify Supabase project is active
- Check network connectivity
- Review browser console for details

*Theme Not Persisting:*
- Check localStorage is enabled
- Clear browser cache
- Verify `meeting-tracker-theme` key exists

*Real-time Updates Not Working:*
- Check WebSocket connection
- Verify Supabase realtime is enabled
- Check subscription cleanup in useEffect

---

## 12. Contact & Resources

### 12.1 Repository
- GitHub: `ddkhua-maker/meeting-tracker`
- Branch: `main`

### 12.2 Documentation
- README.md - Getting started guide
- IMPLEMENTATION_SUMMARY.md - Development history
- SUPABASE_SETUP.md - Database configuration
- CONSTITUTION.md (this file) - Complete application specification

### 12.3 Dependencies
- React Documentation: https://react.dev
- Vite Documentation: https://vite.dev
- Tailwind CSS: https://tailwindcss.com
- Supabase Documentation: https://supabase.com/docs

---

**Document End**

*This constitution serves as the source of truth for the Meeting Tracker application. All development, design, and operational decisions should align with the principles and specifications outlined in this document.*
