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
          'bg-elevated': '#141b24',
          accent: '#00d9ff',
          'accent-dark': '#00a8cc',
          // Premium amber/gold — the conversion color
          gold: '#FFC107',
          'gold-light': '#FFD54F',
          'gold-dark': '#E0A800',
          text: '#ffffff',
          'text-secondary': '#9aa6b2',
          'text-muted': '#6b7785',
          gray: '#1a2332',
          'gray-light': '#2a3a4a',
          border: '#243140',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 217, 255, 0.45)',
        'glow-intense': '0 0 40px rgba(0, 217, 255, 0.7)',
        // Gold conversion glows
        'gold-glow': '0 0 24px rgba(255, 193, 7, 0.35)',
        'gold-glow-intense': '0 10px 35px -5px rgba(255, 193, 7, 0.5)',
        // Layered depth for cards
        'card': '0 4px 24px -2px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 18px 45px -8px rgba(0, 0, 0, 0.6)',
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
        'fade-up': {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-up': 'fade-up 0.7s ease-out both',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
})
