import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pulse: {
          bg: '#0f1419',
          'bg-dark': '#0a0d12',
          accent: '#00d9ff',
          'accent-dark': '#00a8cc',
          gold: '#d4af37',
          'gold-dark': '#a88f2a',
          text: '#ffffff',
          'text-secondary': '#b0b8c1',
          gray: '#1a2332',
          'gray-light': '#2a3a4a',
        },
        boat: {
          red: '#FF0000',
          black: '#0A0A0A',
          dark: '#1A1A1A',
          gray: '#2A2A2A',
          light: '#F5F5F5',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 217, 255, 0.6)',
        'glow-intense': '0 0 40px rgba(0, 217, 255, 0.8)',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s infinite',
        'slide-up': 'slide-up 0.6s ease-out',
      },
    },
  },
})
