/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme
        'app-bg': '#F8F9FA',
        'card-bg': '#FFFFFF',
        'confirmed': '#D4EDDA',
        'pending': '#FFF3CD',
        'accent': '#6C94F2',
        'primary-text': '#2C3E50',
        'secondary-text': '#6C757D',
        
        // Dark theme
        'dark-app-bg': '#1A1D23',
        'dark-card-bg': '#25282E',
        'dark-confirmed': '#2D4A3E',
        'dark-pending': '#4A4230',
        'dark-accent': '#5B82E8',
        'dark-primary-text': '#E8EAED',
        'dark-secondary-text': '#9AA0A6',
        
        // Status Badge Colors - Confirmed
        'status-confirmed-bg-light': '#D4EDDA',
        'status-confirmed-text-light': '#155724',
        'status-confirmed-dot-light': '#28A745',
        'status-confirmed-border-light': '#C3E6CB',
        'status-confirmed-bg-dark': '#2D4A3E',
        'status-confirmed-text-dark': '#A8E6CF',
        'status-confirmed-dot-dark': '#4ADE80',
        'status-confirmed-border-dark': '#3D5A4E',
        
        // Status Badge Colors - Pending
        'status-pending-bg-light': '#FFF3CD',
        'status-pending-text-light': '#856404',
        'status-pending-dot-light': '#FFC107',
        'status-pending-border-light': '#FFEAA7',
        'status-pending-bg-dark': '#4A4230',
        'status-pending-text-dark': '#FFE4A3',
        'status-pending-dot-dark': '#FCD34D',
        'status-pending-border-dark': '#5A5240',
        
        // Legacy colors (keeping for backward compatibility)
        'sigma-yellow': '#FFD93D',
        'status-confirmed-bg': '#86EFAC',
        'status-confirmed-border': '#F0FDF4',
        'status-not-confirmed-bg': '#FCA5A5',
        'status-not-confirmed-border': '#FEF2F2',
        'status-in-process-bg': '#FCD34D',
        'status-in-process-border': '#FEF3C7',
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      },
    },
  },
  plugins: [],
}

