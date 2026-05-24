/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boat: {
          red: '#FF0000',
          black: '#0A0A0A',
          dark: '#1A1A1A',
          gray: '#2A2A2A',
          light: '#F5F5F5',
        }
      }
    },
  },
  plugins: [],
}
