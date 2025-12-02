import { useState, useEffect } from 'react';
import { googleCalendarService } from '../services/googleCalendarService';

const GoogleCalendarConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await googleCalendarService.isConnected();
      setIsConnected(connected);
    } catch (error) {
      console.error('Failed to check connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await googleCalendarService.connect();
      if (success) {
        setIsConnected(true);
        alert('✅ Google Calendar connected successfully!');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      alert('❌ Failed to connect Google Calendar. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar? Meeting invitations will no longer be sent.')) {
      return;
    }

    try {
      await googleCalendarService.disconnect();
      setIsConnected(false);
      alert('Google Calendar disconnected');
    } catch (error) {
      console.error('Disconnect failed:', error);
      alert('Failed to disconnect. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-secondary-text dark:text-dark-secondary-text">
        <div className="w-4 h-4 border-2 border-accent dark:border-dark-accent border-t-transparent rounded-full animate-spin"></div>
        <span>Checking calendar connection...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-text dark:text-dark-primary-text" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
          </svg>
          <span className="font-medium text-primary-text dark:text-dark-primary-text">
            Google Calendar
          </span>
        </div>
        
        {isConnected ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></span>
            Connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            Not connected
          </span>
        )}
      </div>

      <p className="text-sm text-secondary-text dark:text-dark-secondary-text">
        {isConnected 
          ? 'Calendar invitations will be sent automatically when you save meetings.'
          : 'Connect your Google Calendar to automatically send meeting invitations to partners.'}
      </p>

      {isConnected ? (
        <button
          onClick={handleDisconnect}
          className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
        >
          Disconnect Calendar
        </button>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full px-4 py-2 bg-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              Connect Google Calendar
            </>
          )}
        </button>
      )}

      {isConnected && (
        <div className="text-xs text-secondary-text dark:text-dark-secondary-text">
          💡 Tip: Toggle "Send Calendar Invite" on individual meetings to control who receives invitations.
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarConnect;
