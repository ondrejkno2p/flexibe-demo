/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff2e2",
          100: "#ffeed9",
          200: "#ffeacf",
          300: "#ffddb3",
          400: "#ffc479",
          500: "#FFAB40",
          600: "#e69a3a",
          700: "#bf8030",
          800: "#996726",
          900: "#7d541f",
        },
      },
    },
  },
  plugins: [],
};
