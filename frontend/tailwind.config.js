/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ucv-red': '#E30512',
        'ucv-blue': '#243659',
        'ucv-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}