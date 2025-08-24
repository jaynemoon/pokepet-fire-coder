/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #fb923c, #f97316)',
        'gradient-red': 'linear-gradient(135deg, #f87171, #ef4444)',
        'gradient-orange-yellow': 'linear-gradient(135deg, #fb923c, #fbbf24)',
      }
    },
  },
  plugins: [],
}