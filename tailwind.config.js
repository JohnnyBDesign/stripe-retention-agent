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
        void: '#09090B',
        panel: '#18181B',
        chalk: '#FAFAFA',
        mute: '#A1A1AA',
        lime: '#A3E635',
        cyan: '#22D3EE',
        violet: '#8B5CF6',
        green: '#22C55E',
        danger: '#F43F5E',
        line: '#27272A',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      borderRadius: {
        chrome: '16px',
        pill: '999px',
      },
      maxWidth: {
        content: '1120px',
        hero: '640px',
      },
    },
  },
  plugins: [],
};
