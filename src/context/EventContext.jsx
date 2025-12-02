import { createContext, useContext, useState, useEffect } from 'react';

const EventContext = createContext();

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [eventConfig, setEventConfig] = useState(() => {
    const saved = localStorage.getItem('meeting-tracker-event-config');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default configuration
    return {
      eventName: 'Sigma',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days default
    };
  });

  useEffect(() => {
    localStorage.setItem('meeting-tracker-event-config', JSON.stringify(eventConfig));
  }, [eventConfig]);

  const updateEventConfig = (newConfig) => {
    setEventConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const getEventDuration = () => {
    const start = new Date(eventConfig.startDate);
    const end = new Date(eventConfig.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return diffDays;
  };

  const isDateInEventRange = (dateString) => {
    const date = new Date(dateString);
    const start = new Date(eventConfig.startDate);
    const end = new Date(eventConfig.endDate);
    
    // Reset time parts for accurate date comparison
    date.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    return date >= start && date <= end;
  };

  const getEventDateRange = () => {
    const start = new Date(eventConfig.startDate);
    const end = new Date(eventConfig.endDate);
    
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return `${startStr} - ${endStr}`;
  };

  return (
    <EventContext.Provider value={{
      eventConfig,
      updateEventConfig,
      getEventDuration,
      isDateInEventRange,
      getEventDateRange
    }}>
      {children}
    </EventContext.Provider>
  );
};
