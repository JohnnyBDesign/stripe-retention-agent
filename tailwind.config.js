/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        display: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        body: ['var(--font-instrument-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      maxWidth: {
        content: '1200px',
      },
      fontSize: {
        'display-xl': ['96px', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['64px', { lineHeight: '1.0', letterSpacing: '-0.025em' }],
        'display-md': ['48px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        heading: ['32px', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        subheading: ['20px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        body: ['16px', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['14px', { lineHeight: '1.5', letterSpacing: '0' }],
        caption: ['13px', { lineHeight: '1.4', letterSpacing: '0' }],
        label: ['11px', { lineHeight: '1.2', letterSpacing: '0.05em' }],
      },
    },
  },
  plugins: [],
};
