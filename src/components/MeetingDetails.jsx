import { useState, useEffect, useMemo, useCallback } from 'react';

const MeetingDetails = ({
  meeting,
  timeSlot,
  selectedDate,
  onClose,
  onSave,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(!meeting); // Edit mode for new meetings, view mode for existing
  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    status: 'confirmed',
    twg_person: '',
    company_name: '',
    partner: '',
    phone: '',
    partner_email: '',
    location: '',
    agenda: '',
    meeting_summary: '',
    send_calendar_invite: false
  });

  // Initialize form with meeting data or defaults
  useEffect(() => {
    if (meeting) {
      setFormData({
        status: meeting.status || 'confirmed',
        twg_person: meeting.twg_person || '',
        company_name: meeting.company_name || '',
        partner: meeting.partner || '',
        phone: meeting.phone || '',
        partner_email: meeting.partner_email || '',
        location: meeting.location || '',
        agenda: meeting.agenda || '',
        meeting_summary: meeting.meeting_summary || '',
        send_calendar_invite: meeting.send_calendar_invite || false
      });
      setIsEditing(false); // Start in view mode for existing meetings
    } else {
      setFormData({
        status: 'confirmed',
        twg_person: '',
        company_name: '',
        partner: '',
        phone: '',
        partner_email: '',
        location: '',
        agenda: '',
        meeting_summary: '',
        send_calendar_invite: false
      });
      setIsEditing(true); // Start in edit mode for new meetings
    }
  }, [meeting]);

  // Cleanup toast timeout on unmount
  useEffect(() => {
    let timeoutId;
    if (showToast) {
      timeoutId = setTimeout(() => setShowToast(false), 2000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showToast]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      date: selectedDate,
      time_slot: timeSlot
    };
    if (import.meta.env.DEV) {
      console.log('💾 MeetingDetails handleSubmit - Data to save:', dataToSave);
      console.log('📋 meeting_summary value:', dataToSave.meeting_summary);
    }
    onSave(dataToSave);
  }, [formData, selectedDate, timeSlot, onSave]);

  const handleCopyPhone = useCallback(() => {
    if (formData.phone) {
      navigator.clipboard.writeText(formData.phone);
      setShowToast(true);
    }
  }, [formData.phone]);

  const formatDateTime = useCallback(() => {
    const date = new Date(selectedDate);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${dateStr} at ${timeSlot}`;
  }, [selectedDate, timeSlot]);

  const handleDelete = useCallback(async () => {
    if (!meeting || !onDelete) {
      if (import.meta.env.DEV) console.error('Missing meeting or onDelete handler');
      return;
    }
    
    if (import.meta.env.DEV) console.log('💾 MeetingDetails handleDelete - Meeting ID:', meeting.id);
    
    const { error } = await onDelete(meeting.id);
    
    if (error) {
      const errorMessage = error?.message || error || 'Failed to clear meeting data';
      if (import.meta.env.DEV) console.error('Delete error:', errorMessage);
      alert(`Failed to clear meeting data: ${errorMessage}`);
      setShowDeleteConfirm(false);
      return;
    }
    
    setShowDeleteConfirm(false);
  }, [meeting, onDelete]);

  const getStatusDisplay = (status) => {
    const statusMap = {
      confirmed: { 
        label: 'Confirmed',
        badgeClass: 'bg-status-confirmed-bg-light dark:bg-status-confirmed-bg-dark text-status-confirmed-text-light dark:text-status-confirmed-text-dark border-status-confirmed-border-light dark:border-status-confirmed-border-dark',
        dotClass: 'bg-status-confirmed-dot-light dark:bg-status-confirmed-dot-dark'
      },
      not_confirmed: { 
        label: 'Not Confirmed',
        badgeClass: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
        dotClass: 'bg-red-600 dark:bg-red-400'
      },
      in_process: { 
        label: 'In Process',
        badgeClass: 'bg-status-pending-bg-light dark:bg-status-pending-bg-dark text-status-pending-text-light dark:text-status-pending-text-dark border-status-pending-border-light dark:border-status-pending-border-dark',
        dotClass: 'bg-status-pending-dot-light dark:bg-status-pending-dot-dark'
      }
    };
    return statusMap[status] || statusMap.confirmed;
  };

  // View Mode Component - Memoized to prevent recreation on every render
  const viewModeContent = useMemo(() => {
    const statusDisplay = getStatusDisplay(formData.status);

    return (
      <>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {/* Date & Time */}
          <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
            <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-1">Date & Time</div>
            <div className="text-base text-primary-text dark:text-dark-primary-text font-medium">{formatDateTime()}</div>
          </div>

          {/* Status Badge */}
          <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
            <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-2">Status</div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-theme duration-300 ${statusDisplay.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${statusDisplay.dotClass}`}></span>
              <span className="text-sm font-medium">{statusDisplay.label}</span>
            </div>
          </div>

          {/* TWG Person */}
          {formData.twg_person && (
            <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
              <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-1">TWG Person</div>
              <div className="text-base text-primary-text dark:text-dark-primary-text">{formData.twg_person}</div>
            </div>
          )}

          {/* Company Name */}
          {formData.company_name && (
            <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
              <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-1">Company Name</div>
              <div className="text-base text-primary-text dark:text-dark-primary-text font-medium">{formData.company_name}</div>
            </div>
          )}

          {/* Partner */}
          {formData.partner && (
            <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
              <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-1">Partner</div>
              <div className="text-base text-primary-text dark:text-dark-primary-text">{formData.partner}</div>
            </div>
          )}

          {/* Phone / WhatsApp */}
          {formData.phone && (
            <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
              <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-1">Phone / WhatsApp</div>
              <button
                onClick={handleCopyPhone}
                className="text-base text-accent dark:text-dark-accent hover:opacity-80 font-medium flex items-center gap-2 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {formData.phone}
              </button>
            </div>
          )}

          {/* Partner Email */}
          {formData.partner_email && (
            <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
              <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-1">Partner Email</div>
              <div className="text-base text-accent dark:text-dark-accent font-medium">{formData.partner_email}</div>
              {formData.send_calendar_invite && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                  </svg>
                  Calendar invite sent
                </div>
              )}
            </div>
          )}

          {/* Location */}
          {formData.location && (
            <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
              <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-1">Location</div>
              <div className="text-base text-primary-text dark:text-dark-primary-text">{formData.location}</div>
            </div>
          )}

          {/* Agenda */}
          {formData.agenda && (
            <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
              <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-1">Agenda</div>
              <div className="text-base text-primary-text dark:text-dark-primary-text whitespace-pre-wrap">{formData.agenda}</div>
            </div>
          )}

          {/* Meeting Summary */}
          <div className="bg-app-bg dark:bg-dark-app-bg rounded-card p-4 border border-gray-200 dark:border-gray-700 transition-theme duration-300">
            <div className="text-sm font-medium text-secondary-text dark:text-dark-secondary-text mb-1">Meeting Summary</div>
            <div className="text-base text-primary-text dark:text-dark-primary-text whitespace-pre-wrap">
              {formData.meeting_summary || (
                <span className="text-secondary-text dark:text-dark-secondary-text italic">No summary yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 transition-theme duration-300">
          <div className="space-y-3">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-accent dark:bg-dark-accent text-white px-6 py-2.5 rounded-card font-medium hover:opacity-90 transition-all duration-300 shadow-card"
            >
              Edit Meeting
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 px-6 py-2.5 rounded-card font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
            >
              Clear Meeting Data
            </button>
          </div>
        </div>
      </>
    );
  }, [formData, formatDateTime, handleCopyPhone, setIsEditing]);

  // Edit Mode Component - Memoized to prevent recreation on every render
  const editModeContent = useMemo(() => (
    <>
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-5">
          {/* Date & Time (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Date & Time
            </label>
            <input
              type="text"
              value={formatDateTime()}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-app-bg dark:bg-dark-app-bg text-secondary-text dark:text-dark-secondary-text transition-theme duration-300"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-card-bg dark:bg-dark-card-bg text-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            >
              <option value="confirmed">Confirmed</option>
              <option value="not_confirmed">Not Confirmed</option>
              <option value="in_process">In Process</option>
            </select>
          </div>

          {/* TWG Person */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              TWG Person
            </label>
            <input
              type="text"
              name="twg_person"
              value={formData.twg_person}
              onChange={handleChange}
              placeholder="Enter TWG person name"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-card-bg dark:bg-dark-card-bg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-card-bg dark:bg-dark-card-bg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
          </div>

          {/* Partner */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Partner
            </label>
            <input
              type="text"
              name="partner"
              value={formData.partner}
              onChange={handleChange}
              placeholder="Enter partner name"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-card-bg dark:bg-dark-card-bg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Phone / WhatsApp
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-card-bg dark:bg-dark-card-bg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
          </div>

          {/* Partner Email */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Partner Email
            </label>
            <input
              type="email"
              name="partner_email"
              value={formData.partner_email}
              onChange={handleChange}
              placeholder="partner@company.com"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-card-bg dark:bg-dark-card-bg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
            <p className="mt-1 text-xs text-secondary-text dark:text-dark-secondary-text">
              Required for sending Google Calendar invitations
            </p>
          </div>

          {/* Send Calendar Invite Toggle */}
          <div className="flex items-center justify-between p-4 bg-app-bg dark:bg-dark-app-bg rounded-card border border-gray-200 dark:border-gray-700 transition-theme duration-300">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-accent dark:text-dark-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              <div>
                <label htmlFor="send_calendar_invite" className="text-sm font-medium text-primary-text dark:text-dark-primary-text cursor-pointer">
                  Send Calendar Invite
                </label>
                <p className="text-xs text-secondary-text dark:text-dark-secondary-text">
                  Automatically create Google Calendar event and send invitation
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="send_calendar_invite"
                name="send_calendar_invite"
                checked={formData.send_calendar_invite}
                onChange={(e) => setFormData(prev => ({ ...prev, send_calendar_invite: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 dark:peer-focus:ring-dark-accent/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent dark:peer-checked:bg-dark-accent"></div>
            </label>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter meeting location"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-card-bg dark:bg-dark-card-bg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
          </div>

          {/* Agenda */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Agenda
            </label>
            <textarea
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              placeholder="Enter meeting agenda"
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-card-bg dark:bg-dark-card-bg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent resize-none transition-theme duration-300"
            />
          </div>

          {/* Meeting Summary */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Meeting Summary
            </label>
            <textarea
              name="meeting_summary"
              value={formData.meeting_summary}
              onChange={handleChange}
              placeholder="Add meeting notes and summary..."
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-card bg-card-bg dark:bg-dark-card-bg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent resize-none transition-theme duration-300"
            />
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 transition-theme duration-300">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-accent dark:bg-dark-accent text-white px-6 py-2.5 rounded-card font-medium hover:opacity-90 transition-all duration-300 shadow-card"
          >
            {meeting ? 'Save Changes' : 'Create'}
          </button>
          <button
            type="button"
            onClick={meeting ? () => setIsEditing(false) : onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-card font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  ), [formData, meeting, formatDateTime, handleChange, handleSubmit, setIsEditing, onClose]);

  return (
    <div className="h-screen bg-card-bg dark:bg-dark-card-bg flex flex-col relative transition-theme duration-300">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-card shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Phone copied!
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-card-bg dark:bg-dark-card-bg rounded-card shadow-xl p-6 max-w-sm w-full transition-theme duration-300">
            <div className="mb-4">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary-text dark:text-dark-primary-text text-center mb-2">
                Clear Meeting Data?
              </h3>
              <p className="text-secondary-text dark:text-dark-secondary-text text-center text-sm">
                Are you sure you want to clear this meeting? The time slot will remain available for booking.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 dark:bg-red-700 text-white px-4 py-2.5 rounded-card font-medium hover:opacity-90 transition-all duration-300"
              >
                Clear Data
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-card font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-theme duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-text dark:text-dark-primary-text">
            {meeting
              ? (isEditing ? 'Edit Meeting' : 'Meeting Details')
              : 'New Meeting'
            }
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-text dark:text-dark-secondary-text hover:text-primary-text dark:hover:text-dark-primary-text text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
      </div>


      {/* Content */}
      {meeting && !isEditing ? viewModeContent : editModeContent}
    </div>
  );
};

export default MeetingDetails;
