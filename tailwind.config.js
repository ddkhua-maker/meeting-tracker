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

