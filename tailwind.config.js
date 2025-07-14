/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },
      colors: {
        // Dark mode - Japanese pink aesthetic
        dark: {
          primary: '#FF85A1', // Sakura pink
          secondary: '#FFC4DD', // Light pink
          accent: '#FF4989', // Bright pink
          background: '#0F0F12',
          card: '#1A1A1F',
          border: '#2E2E3A',
          text: '#F0F0F5',
          muted: '#9C9CAF',
        },
        // Light mode - Japanese green aesthetic
        light: {
          primary: '#678D58', // Matcha green
          secondary: '#A3C9A8', // Light green
          accent: '#557153', // Forest green
          background: '#F3F5F0',
          card: '#FFFFFF',
          border: '#D7E4C0',
          text: '#2E3A23',
          muted: '#6E7D61',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
