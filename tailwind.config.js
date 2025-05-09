/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0F0F0F',
        'dark-surface': '#121212',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
        'accent-red': '#E63946',
        'accent-red-light': '#F67280',
        'gray-50': '#F5F5F5',
        'gray-100': '#E5E5E5',
        'gray-200': '#CCCCCC',
        'gray-300': '#B3B3B3',
        'gray-400': '#999999',
        'gray-500': '#808080',
        'gray-600': '#666666',
        'gray-700': '#4D4D4D',
        'gray-800': '#333333',
        'gray-900': '#1A1A1A',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'inner-white': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};