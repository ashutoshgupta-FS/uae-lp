/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#282828',
          accent: '#ffc107',
          light: '#f5f3ef',
          cream: '#fffbea',
          stone: '#efe8da',
        },
      },
      fontFamily: {
        'helvetica-neue': ['Inter', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
