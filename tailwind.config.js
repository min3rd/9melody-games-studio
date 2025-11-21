/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {DEFAULT: '#2563EB', dark: '#1E40AF'},
        surface: {DEFAULT: '#FFFFFF', dark: '#111827'}
      }
    }
  },
  plugins: []
}
