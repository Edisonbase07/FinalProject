// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d0d0d",        // Dark futuristic base
        foreground: "#f5f5f5",        // Light text
        border: "#3f3f46",            // Soft border
        card: "#1a1a1a",              // Card background
        "card-foreground": "#f5f5f5",
        primary: "#dc2626",           // Red highlights
        "primary-foreground": "#fff",
        secondary: "#3f3f46",
        "secondary-foreground": "#fff",
        muted: "#262626",
        "muted-foreground": "#a1a1aa",
      },
      borderRadius: {
        lg: "1rem",
      },
    },
  },
  plugins: [],
};
