/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sigma-yellow': '#FFD93D',
        'status-confirmed-bg': '#86EFAC',
        'status-confirmed-border': '#F0FDF4',
        'status-not-confirmed-bg': '#FCA5A5',
        'status-not-confirmed-border': '#FEF2F2',
        'status-in-process-bg': '#FCD34D',
        'status-in-process-border': '#FEF3C7',
      }
    },
  },
  plugins: [],
}
