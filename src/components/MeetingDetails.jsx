import { useState, useEffect } from 'react';

const MeetingDetails = ({
  meeting,
  timeSlot,
  selectedDate,
  onClose,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(!meeting); // Edit mode for new meetings, view mode for existing
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    status: 'confirmed',
    twg_person: '',
    company_name: '',
    partner: '',
    phone: '',
    location: '',
    agenda: ''
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
        location: meeting.location || '',
        agenda: meeting.agenda || ''
      });
      setIsEditing(false); // Start in view mode for existing meetings
    } else {
      setFormData({
        status: 'confirmed',
        twg_person: '',
        company_name: '',
        partner: '',
        phone: '',
        location: '',
        agenda: ''
      });
      setIsEditing(true); // Start in edit mode for new meetings
    }
  }, [meeting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: selectedDate,
      time_slot: timeSlot
    });
  };

  const handleCopyPhone = () => {
    if (formData.phone) {
      navigator.clipboard.writeText(formData.phone);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const formatDateTime = () => {
    const date = new Date(selectedDate);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${dateStr} at ${timeSlot}`;
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      confirmed: { icon: '🟢', label: 'Confirmed' },
      not_confirmed: { icon: '🔴', label: 'Not Confirmed' },
      in_process: { icon: '🟡', label: 'In Process' }
    };
    return statusMap[status] || statusMap.confirmed;
  };

  // View Mode Component
  const ViewMode = () => {
    const statusDisplay = getStatusDisplay(formData.status);

    return (
      <>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            {/* Date & Time */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-1">Date & Time</div>
              <div className="text-base text-gray-900 font-medium">{formatDateTime()}</div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
              <div className="text-base text-gray-900 font-medium flex items-center gap-2">
                <span>{statusDisplay.icon}</span>
                <span>{statusDisplay.label}</span>
              </div>
            </div>

            {/* TWG Person */}
            {formData.twg_person && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-500 mb-1">TWG Person</div>
                <div className="text-base text-gray-900">{formData.twg_person}</div>
              </div>
            )}

            {/* Company Name */}
            {formData.company_name && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-500 mb-1">Company Name</div>
                <div className="text-base text-gray-900 font-medium">{formData.company_name}</div>
              </div>
            )}

            {/* Partner */}
            {formData.partner && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-500 mb-1">Partner</div>
                <div className="text-base text-gray-900">{formData.partner}</div>
              </div>
            )}

            {/* Phone / WhatsApp */}
            {formData.phone && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-500 mb-1">Phone / WhatsApp</div>
                <button
                  onClick={handleCopyPhone}
                  className="text-base text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {formData.phone}
                </button>
              </div>
            )}

            {/* Location */}
            {formData.location && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-500 mb-1">Location</div>
                <div className="text-base text-gray-900">{formData.location}</div>
              </div>
            )}

            {/* Agenda */}
            {formData.agenda && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-500 mb-1">Agenda</div>
                <div className="text-base text-gray-900 whitespace-pre-wrap">{formData.agenda}</div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Edit Meeting
          </button>
        </div>
      </>
    );
  };

  // Edit Mode Component
  const EditMode = () => (
    <>
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-5">
          {/* Date & Time (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <input
              type="text"
              value={formatDateTime()}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="confirmed">Confirmed</option>
              <option value="not_confirmed">Not Confirmed</option>
              <option value="in_process">In Process</option>
            </select>
          </div>

          {/* TWG Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TWG Person
            </label>
            <input
              type="text"
              name="twg_person"
              value={formData.twg_person}
              onChange={handleChange}
              placeholder="Enter TWG person name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Partner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner
            </label>
            <input
              type="text"
              name="partner"
              value={formData.partner}
              onChange={handleChange}
              placeholder="Enter partner name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone / WhatsApp
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter meeting location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Agenda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agenda
            </label>
            <textarea
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              placeholder="Enter meeting agenda"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {meeting ? 'Save Changes' : 'Create'}
          </button>
          <button
            type="button"
            onClick={meeting ? () => setIsEditing(false) : onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-white flex flex-col relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Phone copied!
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {meeting
              ? (isEditing ? 'Edit Meeting' : 'Meeting Details')
              : 'New Meeting'
            }
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      {meeting && !isEditing ? <ViewMode /> : <EditMode />}
    </div>
  );
};

export default MeetingDetails;
