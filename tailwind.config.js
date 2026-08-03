/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F6F2EC",
        primary: "#171717",
        accent: "#6F5A43",
        cards: "#ECE5DA",
        borders: "#D9D0C3",
        beige: {
          light: "#FAF7F2",
          DEFAULT: "#ECE5DA",
          text: "#E5DDD0",
          hover: "#E2D8C9"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Bebas Neue"', '"Syne"', 'sans-serif'],
        editorial: ['"Syne"', 'sans-serif'],
      },
      boxShadow: {
        'card-soft': '0 10px 30px -10px rgba(23, 23, 23, 0.05)',
        'card-hover': '0 20px 40px -15px rgba(111, 90, 67, 0.12)',
        'portrait': '0 35px 60px -15px rgba(23, 23, 23, 0.18)',
        'btn': '0 8px 25px -5px rgba(111, 90, 67, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
