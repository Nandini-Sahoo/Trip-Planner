/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f28b8b',
          500: '#e5484d',
          600: '#cd3c40',
          700: '#a52a2a',
          800: '#800000',
          900: '#5c0000',
        },
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
    },
  },
  plugins: [],
}