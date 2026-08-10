/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        stone: {
          50: "#faf9f6",
          100: "#f3f0ea",
          200: "#e7e1d7",
          300: "#d5ccbf",
          400: "#a99e91",
          500: "#7f7469",
          600: "#62584f",
          700: "#49413a",
          800: "#312c28",
          900: "#211e1b",
          950: "#151310",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        display: [
          '"Iowan Old Style"',
          '"Palatino Linotype"',
          "Palatino",
          "Georgia",
          "serif",
        ],
      },
      boxShadow: {
        soft: "0 18px 50px -28px rgb(33 30 27 / 0.28)",
        float: "0 24px 60px -30px rgb(21 19 16 / 0.36)",
      },
    },
  },
  plugins: [],
};
