/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./themes/**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2C2C2C',
          dark: '#1A1A1A',
          light: '#3A3A3A',
        },
        accent: {
          DEFAULT: '#FF7F27',
          light: '#FF9F4D',
          dark: '#E66F1F',
        },
      },
    },
  },
  plugins: [],
}






