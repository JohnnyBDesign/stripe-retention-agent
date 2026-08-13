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
        canvas: '#000000',
        surface: '#0a0a0c',
        panel: '#101012',
        ink: '#fcfdff',
        'ink-dim': '#a1a1aa',
        'ink-subdued': '#71717a',
        line: 'rgba(255, 255, 255, 0.06)',
        'line-hover': 'rgba(255, 255, 255, 0.12)',
        'status-orange': '#fb923c',
        'status-blue': '#3b82f6',
        'status-green': '#10b981',
        'status-red': '#ef4444',
        white: '#ffffff',
        black: '#000000',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
        '3xl': '24px',
        '4xl': '32px',
      },
      maxWidth: {
        content: '1120px',
      },
      fontSize: {
        hero: ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'hero-lg': ['72px', { lineHeight: '1.1', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};
