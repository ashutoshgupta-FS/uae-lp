/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#141414',
        paper: '#FAF9F5',
        panel: '#F6F4EE',
        line: '#E5E2D8',
        muted: '#6E6C62',
        faint: '#9B9890',
        gold: {
          DEFAULT: '#C6A15B',
          dark: '#9C7C3D',
          soft: '#F6EEDD',
        },
        rust: '#A6472E',
        avatar: '#2A2A28',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
