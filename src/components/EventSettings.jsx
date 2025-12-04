import { useState, useEffect } from 'react';
import { useEvent } from '../context/EventContext';

const EventSettings = ({ onClose }) => {
  const { eventConfig, updateEventConfig, getEventDuration } = useEvent();
  const [formData, setFormData] = useState({
    eventName: eventConfig.eventName,
    startDate: eventConfig.startDate,
    endDate: eventConfig.endDate,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDaysChange = (e) => {
    const days = parseInt(e.target.value);
    if (days > 0) {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + days - 1); // -1 because we count the start day
      setFormData(prev => ({
        ...prev,
        endDate: end.toISOString().split('T')[0]
      }));
    }
  };

  const calculateDays = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate dates
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end < start) {
      alert('End date must be after or equal to start date');
      return;
    }

    updateEventConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg dark:bg-dark-card-bg rounded-card border border-gray-200 dark:border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto transition-theme duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-card-bg dark:bg-dark-card-bg border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-theme duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary-text dark:text-dark-primary-text">Event Settings</h2>
            <button
              onClick={onClose}
              className="text-secondary-text dark:text-dark-secondary-text hover:text-primary-text dark:hover:text-dark-primary-text transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
              placeholder="e.g., Sigma, TechConf 2025"
              className="w-full px-4 py-2 bg-app-bg dark:bg-dark-app-bg border border-gray-300 dark:border-gray-600 rounded-lg text-primary-text dark:text-dark-primary-text placeholder-secondary-text dark:placeholder-dark-secondary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-app-bg dark:bg-dark-app-bg border border-gray-300 dark:border-gray-600 rounded-lg text-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-app-bg dark:bg-dark-app-bg border border-gray-300 dark:border-gray-600 rounded-lg text-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
          </div>

          {/* Number of Days */}
          <div>
            <label className="block text-sm font-medium text-primary-text dark:text-dark-primary-text mb-2">
              Number of Days
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={calculateDays()}
              onChange={handleDaysChange}
              className="w-full px-4 py-2 bg-app-bg dark:bg-dark-app-bg border border-gray-300 dark:border-gray-600 rounded-lg text-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent transition-theme duration-300"
            />
            <p className="mt-1 text-xs text-secondary-text dark:text-dark-secondary-text">
              Changing this will automatically adjust the end date
            </p>
          </div>

          {/* Preview */}
          <div className="bg-accent/10 dark:bg-dark-accent/10 border border-accent/20 dark:border-dark-accent/20 rounded-lg p-4">
            <p className="text-sm font-medium text-primary-text dark:text-dark-primary-text mb-1">
              Preview:
            </p>
            <p className="text-base text-accent dark:text-dark-accent font-semibold">
              {formData.eventName}
            </p>
            <p className="text-sm text-secondary-text dark:text-dark-secondary-text">
              {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-sm text-secondary-text dark:text-dark-secondary-text">
              Duration: {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-primary-text dark:text-dark-primary-text rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventSettings;
