/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'verified': '#10b981',
        'mismatch': '#f59e0b',
        'not-found': '#ef4444',
      }
    },
  },
  plugins: [],
}