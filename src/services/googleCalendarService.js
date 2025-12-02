const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

class GoogleCalendarService {
  constructor() {
    this.userId = this.getUserId();
  }

  // Get or create user ID (for demo purposes, use localStorage)
  getUserId() {
    let userId = localStorage.getItem('meeting-tracker-user-id');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('meeting-tracker-user-id', userId);
    }
    return userId;
  }

  // Check if user has connected Google Calendar
  async isConnected() {
    try {
      const response = await fetch(`${API_URL}/auth/status/${this.userId}`);
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
      const response = await fetch(`${API_URL}/auth/google?userId=${this.userId}`);
      const data = await response.json();
      return data.authUrl;
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

      // Poll for popup close
      return new Promise((resolve, reject) => {
        const pollTimer = setInterval(() => {
          if (popup.closed) {
            clearInterval(pollTimer);
            
            // Check if connection was successful
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('calendar_connected') === 'true') {
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
              resolve(true);
            } else if (urlParams.get('error')) {
              reject(new Error(urlParams.get('error')));
            } else {
              resolve(false);
            }
          }
        }, 500);
      });
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken() {
    try {
      const response = await fetch(`${API_URL}/auth/refresh/${this.userId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Revoke calendar access
  async disconnect() {
    try {
      const response = await fetch(`${API_URL}/auth/revoke/${this.userId}`, {
        method: 'POST',
      });
      
      return await response.json();
    } catch (error) {
      console.error('Disconnect error:', error);
      throw error;
    }
  }

  // Create calendar event
  async createEvent(meeting) {
    try {
      const response = await fetch(`${API_URL}/calendar/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          meeting,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.needsRefresh) {
          // Try to refresh token and retry
          await this.refreshToken();
          return this.createEvent(meeting);
        }
        throw new Error(data.error || 'Failed to create calendar event');
      }

      return data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }

  // Update calendar event
  async updateEvent(eventId, meeting) {
    try {
      const response = await fetch(`${API_URL}/calendar/event/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          meeting,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update calendar event');
      }

      return data;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  }

  // Delete calendar event
  async deleteEvent(eventId) {
    try {
      const response = await fetch(
        `${API_URL}/calendar/event/${eventId}?userId=${this.userId}`,
        {
          method: 'DELETE',
        }
      );

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
