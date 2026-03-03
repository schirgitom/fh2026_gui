/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f9fb',
          100: '#eef2f7',
          200: '#d6e0ee',
          300: '#b6c7df',
          400: '#8ea8c8',
          500: '#678ab0',
          600: '#4e6f93',
          700: '#3b5571',
          800: '#2a3b4f',
          900: '#1b2734'
        },
        sea: {
          50: '#ecfbff',
          100: '#d6f4ff',
          200: '#aeeaff',
          300: '#7ddcff',
          400: '#4ecbff',
          500: '#1fb3ff',
          600: '#0b93db',
          700: '#0b76af',
          800: '#0d5c86',
          900: '#0f4765'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(12, 26, 44, 0.12)',
        card: '0 12px 24px rgba(15, 71, 101, 0.12)'
      }
    }
  },
  plugins: []
};
