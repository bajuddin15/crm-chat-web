/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      container: {
        center: true, // Ensures the container is centered horizontally
        padding: {
          DEFAULT: "1rem", // Default padding on small screens
          sm: "2rem",
          lg: "3rem", // Larger padding for large screens
          xl: "4rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("flowbite/plugin"),
  ],
};
