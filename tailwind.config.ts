import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2.5rem', '2xl': '4rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#050505',
          soft: '#0A0B0F',
          raised: '#101219',
        },
        accent: {
          DEFAULT: '#4F8CFF', // electric blue
          cyan: '#4FE3E3',
          violet: '#A46BFF',
        },
        // shadcn-compatible semantic tokens (see globals.css for the values)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glow: '0 0 40px -8px rgba(79, 140, 255, 0.45)',
        'glow-lg': '0 0 90px -20px rgba(79, 140, 255, 0.6)',
        glass: '0 24px 80px -32px rgba(0, 0, 0, 0.9)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.85' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--marquee-duration, 40s) linear infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
