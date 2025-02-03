/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      backgroundImage: {
        "MobileCreateEditDeleteBgImg": "url('/images/MobileCreateEditDeleteBgImg.png')", // Replace with your mobile image path
        "DesktopCreateEditDeleteBgImg": "url('/images/DesktopCreateEditDeleteBgImg.png')", // Replace with your desktop image path
      },
    },
  },
  plugins: [],
};
