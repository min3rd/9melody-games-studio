module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', dark: '#1E40AF' },
        surface: { DEFAULT: '#FFFFFF', dark: '#111827' }
      }
    }
  },
  plugins: []
};
