import { useState, useEffect } from 'react';

const MeetingDetails = ({
  meeting,
  timeSlot,
  selectedDate,
  onClose,
  onSave,
  onDelete
}) => {
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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      onDelete(meeting.id);
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

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {meeting ? 'Edit Meeting' : 'New Meeting'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Form */}
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
          {meeting ? (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
