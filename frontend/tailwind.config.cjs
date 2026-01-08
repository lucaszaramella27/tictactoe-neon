/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 24px rgba(34,211,238,.35), 0 0 60px rgba(99,102,241,.18)"
      }
    }
  },
  plugins: []
};
