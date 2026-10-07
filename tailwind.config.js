/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e1a',
        card: '#141a2a',
        'card-hi': '#1a2238',
        border: '#1e2842',
        'border-hi': '#2a3a5a',
        primary: '#3b82f6',
        accent: '#22d3ee',
        success: '#22c55e',
        warn: '#f59e0b',
        danger: '#ef4444',
        muted: '#64748b',
        'muted-2': '#94a3b8',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 24px rgba(59,130,246,0.2)',
      },
    },
  },
  plugins: [],
};
