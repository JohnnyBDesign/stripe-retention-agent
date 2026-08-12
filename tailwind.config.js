/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        afterwhy: {
          ink: '#0B0F14',
          elevated: '#141A22',
          paper: '#F6F1E8',
          muted: '#C9C2B6',
          amber: '#F5A524',
          'amber-hover': '#FFB84D',
          signal: '#2DD4A8',
          danger: '#E85D4C',
          line: '#243041',
          mono: '#8B95A5',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '10px',
        pill: '999px',
        input: '6px',
      },
      maxWidth: {
        content: '1120px',
        hero: '640px',
      },
    },
  },
  plugins: [],
};
