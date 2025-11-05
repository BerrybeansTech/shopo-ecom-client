/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // === WHITE SCALE ===
        "white-50": "#FFFFFF",     // Pure white
        "white-100": "#FCFCFC",    // Ultra white
        "white-200": "#FAFAFA",    // Paper white
        "white-300": "#F7F7F7",    // Snow white
        "white-400": "#F4F4F4",    // Mist white
        "white-500": "#F0F0F0",    // Light white-gray
        "white-600": "#EBEBEB",    // Subtle warm white
        "white-700": "#E5E5E5",    // Slightly gray white
        "white-800": "#DDDDDD",    // Dull white
        "white-900": "#D5D5D5",    // Very light gray-white

        // === BLACK SCALE ===
        "black-50": "#1A1A1A",     // Deep gray-black
        "black-100": "#141414",    // Soft matte black
        "black-200": "#101010",    // Carbon black
        "black-300": "#0C0C0C",    // Ink black
        "black-400": "#080808",    // Dark graphite black
        "black-500": "#050505",    // Near-true black
        "black-600": "#030303",    // Almost full black
        "black-700": "#020202",    // Absolute black
        "black-800": "#010101",    // Super black (OLED black)
        "black-900": "#000000",    // Pure black
      },

      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },

      scale: {
        60: "0.6",
      },

      spacing: {
        '18': '4.5rem',
      },
    },
  },

  variants: {
    extend: {
      textColor: ["focus-within"],
      borderStyle: ["last"],
      opacity: ["disabled"],
      backgroundColor: ["disabled"],
      cursor: ["disabled"],
    },
  },

  plugins: [],
};