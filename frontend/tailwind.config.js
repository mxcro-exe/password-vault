/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-bg': '#030712',
        'cyber-text': '#e5e7eb',
        'cyber-cyan': '#06b6d4',
        'cyber-blue': '#3b82f6',
        'cyber-muted': '#9ca3af',
        'cyber-border': 'rgba(255, 255, 255, 0.08)',
        'cyber-green': '#10b981',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(6, 182, 212, 0.15)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.15)',
      }
    },
  },
  plugins: [],
}
