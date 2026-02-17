/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f3',
          100: '#f6eedd',
          200: '#ecd9b8',
          300: '#e0c08e',
          400: '#d4a76a',
          500: '#c8904f',
          600: '#b87835',
          700: '#956029',
          800: '#764d24',
          900: '#5f4020',
        }
      }
    },
  },
  plugins: [],
}
