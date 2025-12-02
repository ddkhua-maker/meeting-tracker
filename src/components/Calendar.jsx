import { useState } from 'react';
import { eventDates, formatDateDisplay, generateTimeSlots } from '../utils/mockData';
import ThemeToggle from './ThemeToggle';

const Calendar = ({ meetings, onSlotClick, selectedDate, setSelectedDate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const timeSlots = generateTimeSlots();

  // Filter meetings for selected date
  const dateMeetings = meetings.filter(m => m.date === selectedDate);

  // Get meeting for a specific time slot
  const getMeetingForSlot = (timeSlot) => {
    return dateMeetings.find(m => m.time_slot === timeSlot);
  };

  // Filter meetings based on search query
  const shouldShowSlot = (timeSlot) => {
    // If no search query, show all slots
    if (!searchQuery || searchQuery.trim() === '') {
      return true;
    }

    const meeting = getMeetingForSlot(timeSlot);

    // If no meeting in this slot, hide empty slots during search
    if (!meeting) {
      return false;
    }

    // Search across company name, TWG person, and partner (case-insensitive)
    const searchLower = searchQuery.toLowerCase().trim();
    const companyMatch = meeting.company_name?.toLowerCase().includes(searchLower);
    const personMatch = meeting.twg_person?.toLowerCase().includes(searchLower);
    const partnerMatch = meeting.partner?.toLowerCase().includes(searchLower);

    return companyMatch || personMatch || partnerMatch;
  };

  // Get status styling with new design
  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-confirmed dark:bg-dark-confirmed border-green-300 dark:border-green-700';
      case 'not_confirmed':
        return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';
      case 'in_process':
        return 'bg-pending dark:bg-dark-pending border-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-card-bg dark:bg-dark-card-bg border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="h-screen bg-app-bg dark:bg-dark-app-bg flex flex-col transition-theme duration-300">
      {/* Header */}
      <div className="bg-card-bg dark:bg-dark-card-bg border-b border-gray-200 dark:border-gray-700 p-6 transition-theme duration-300">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-primary-text dark:text-dark-primary-text mb-1">
              SiGMA Central Europe 2025
            </h1>
            <p className="text-sm text-secondary-text dark:text-dark-secondary-text">
              Rome, Italy • CET (UTC+1)
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card-bg dark:bg-dark-card-bg border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-theme duration-300">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by company, person, or partner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 bg-app-bg dark:bg-dark-app-bg border border-gray-300 dark:border-gray-600 rounded-lg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text dark:text-dark-secondary-text hover:text-primary-text dark:hover:text-dark-primary-text transition-colors"
              title="Clear search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-secondary-text dark:text-dark-secondary-text mt-2">
            Searching for "{searchQuery}" - {timeSlots.filter(shouldShowSlot).length} result(s)
          </p>
        )}
      </div>

      {/* Date Buttons */}
      <div className="bg-card-bg dark:bg-dark-card-bg border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-theme duration-300">
        <div className="grid grid-cols-4 gap-2">
          {eventDates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-3 rounded-card font-medium text-sm transition-all duration-300 ${
                selectedDate === date
                  ? 'bg-accent dark:bg-dark-accent text-white shadow-card'
                  : 'bg-app-bg dark:bg-dark-app-bg text-primary-text dark:text-dark-primary-text hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {formatDateDisplay(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {timeSlots.filter(shouldShowSlot).length === 0 && searchQuery.trim() !== '' ? (
            // No results message when searching
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-secondary-text dark:text-dark-secondary-text mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-primary-text dark:text-dark-primary-text font-medium mb-1">No meetings found</p>
              <p className="text-secondary-text dark:text-dark-secondary-text text-sm">
                Try searching for a different company, person, or partner
              </p>
            </div>
          ) : (
            timeSlots.map(timeSlot => {
              const meeting = getMeetingForSlot(timeSlot);
              if (!shouldShowSlot(timeSlot)) return null;

              return (
                <button
                  key={timeSlot}
                  onClick={() => onSlotClick(timeSlot, meeting)}
                  className={`w-full text-left p-4 rounded-card border-2 transition-all duration-300 hover:shadow-card ${
                    meeting
                      ? getStatusStyle(meeting.status)
                      : 'bg-card-bg dark:bg-dark-card-bg border-dashed border-gray-300 dark:border-gray-600 hover:border-accent dark:hover:border-dark-accent'
                  }`}
                >
                  {meeting ? (
                    <div>
                      <div className="font-semibold text-primary-text dark:text-dark-primary-text mb-1">
                        {timeSlot} - {meeting.company_name}
                      </div>
                      <div className="text-sm text-secondary-text dark:text-dark-secondary-text">
                        {meeting.twg_person}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="font-medium text-secondary-text dark:text-dark-secondary-text mb-1">
                        {timeSlot}
                      </div>
                      <div className="text-sm text-accent dark:text-dark-accent">
                        + Add meeting
                      </div>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
