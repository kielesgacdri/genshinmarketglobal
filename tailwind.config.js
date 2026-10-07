/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
        card: '#1a1a1a',
        border: '#2a2a2a',
        primary: '#3b82f6',
        success: '#22c55e',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};
