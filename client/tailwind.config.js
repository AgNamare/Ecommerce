/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      screens: {
        xs: "480px", // Custom breakpoint for extra small screens
        sm: "640px", // Default small screens breakpoint
        md: "768px", // Default medium screens breakpoint
        lg: "1024px", // Default large screens breakpoint
        xl: "1280px", // Default extra large screens breakpoint
        "2xl": "1536px", // Default 2x extra large screens breakpoint
        // Custom breakpoints
        "3xl": "1600px", // Custom breakpoint for larger screens
        "4xl": "1920px", // Custom breakpoint for very large screens
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        primary: "#A8CE3A",
        secondary: "#000000",
        background: "#d8d9d8",
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
