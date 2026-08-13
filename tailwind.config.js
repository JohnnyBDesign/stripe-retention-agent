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
        black: '#000000',
        charcoal: '#141414',
        panel: '#1A1A1A',
        white: '#FFFFFF',
        gray: '#A1A1A1',
        'gray-dim': '#6B6B6B',
        line: '#2A2A2A',
        'accent-teal': '#2DD4BF',
        'accent-orange': '#FB923C',
        'accent-violet': '#A78BFA',
        danger: '#F43F5E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
        '3xl': '32px',
        '4xl': '40px',
      },
      maxWidth: {
        content: '1120px',
      },
    },
  },
  plugins: [],
};
