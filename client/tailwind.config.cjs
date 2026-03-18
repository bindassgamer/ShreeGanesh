/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0f172a",
        slateink: "#1e293b",
        sunrise: "#f59e0b",
        mint: "#34d399",
        blush: "#f472b6"
      },
      boxShadow: {
        glow: "0 20px 50px -20px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
};
