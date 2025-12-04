const API_URL = import.meta.env.VITE_BACKEND_URL || '';

class GoogleCalendarService {
  // Check if user has connected Google Calendar
  async isConnected() {
    try {
      const response = await fetch(`${API_URL}/api/oauth/status`);
      const data = await response.json();
      return data.connected && !data.expired;
    } catch (error) {
      console.error('Error checking connection status:', error);
      return false;
    }
  }

  // Get Google OAuth URL
  async getAuthUrl() {
    try {
      const response = await fetch(`${API_URL}/api/oauth/authorize`);
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      throw error;
    }
  }

  // Open OAuth popup
  async connect() {
    try {
      const authUrl = await this.getAuthUrl();
      
      // Open OAuth in popup window
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        authUrl,
        'Google Calendar Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Poll for popup close and check URL params
      return new Promise((resolve, reject) => {
        const pollTimer = setInterval(() => {
          if (popup.closed) {
            clearInterval(pollTimer);
            
            // Check if connection was successful
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('auth') === 'success') {
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
              resolve(true);
            } else if (urlParams.get('auth') === 'error') {
              window.history.replaceState({}, document.title, window.location.pathname);
              reject(new Error('Authentication failed'));
            } else {
              // Check connection status
              this.isConnected().then(resolve).catch(reject);
            }
          }
        }, 500);
        
        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(pollTimer);
          if (!popup.closed) {
            popup.close();
          }
          reject(new Error('Authentication timeout'));
        }, 5 * 60 * 1000);
      });
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  // Create calendar event
  async createEvent(meeting) {
    try {
      const response = await fetch(`${API_URL}/api/calendar/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meeting }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create calendar event');
      }

      return data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }

  // Delete calendar event
  async deleteEvent(eventId) {
    try {
      const response = await fetch(`${API_URL}/api/calendar/delete?eventId=${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete calendar event');
      }

      return data;
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService();
