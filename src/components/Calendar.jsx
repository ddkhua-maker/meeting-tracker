import { useState } from 'react';
import { eventDates, formatDateDisplay, generateTimeSlots } from '../utils/mockData';

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

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-status-confirmed-bg border-status-confirmed-border';
      case 'not_confirmed':
        return 'bg-status-not-confirmed-bg border-status-not-confirmed-border';
      case 'in_process':
        return 'bg-status-in-process-bg border-status-in-process-border';
      default:
        return 'bg-white border-gray-300';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          SiGMA Central Europe 2025
        </h1>
        <p className="text-sm text-gray-600">
          Rome, Italy • CET (UTC+1)
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by company, person, or partner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
          <p className="text-xs text-gray-500 mt-2">
            Searching for "{searchQuery}" - {timeSlots.filter(shouldShowSlot).length} result(s)
          </p>
        )}
      </div>

      {/* Date Buttons */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-4 gap-2">
          {eventDates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                selectedDate === date
                  ? 'bg-sigma-yellow text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                className="mx-auto h-12 w-12 text-gray-400 mb-3"
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
              <p className="text-gray-600 font-medium mb-1">No meetings found</p>
              <p className="text-gray-500 text-sm">
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
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    meeting
                      ? getStatusStyle(meeting.status)
                      : 'bg-white border-dashed border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {meeting ? (
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        {timeSlot} - {meeting.company_name}
                      </div>
                      <div className="text-sm text-gray-700">
                        {meeting.twg_person}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="font-medium text-gray-500 mb-1">
                        {timeSlot}
                      </div>
                      <div className="text-sm text-blue-500">
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
