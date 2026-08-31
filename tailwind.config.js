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
        },
      },
      fontFamily: {
        'helvetica-neue': ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        oswald: ['Oswald', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        'roboto-slab': ['"Roboto Slab"', 'serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
