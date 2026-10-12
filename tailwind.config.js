/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Theme-aware surface (white in light, dark panel in dark).
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        // Neutral ramp mapped to CSS variables so the entire UI flips in dark mode.
        slate: {
          50: 'rgb(var(--c-slate-50) / <alpha-value>)',
          100: 'rgb(var(--c-slate-100) / <alpha-value>)',
          200: 'rgb(var(--c-slate-200) / <alpha-value>)',
          300: 'rgb(var(--c-slate-300) / <alpha-value>)',
          400: 'rgb(var(--c-slate-400) / <alpha-value>)',
          500: 'rgb(var(--c-slate-500) / <alpha-value>)',
          600: 'rgb(var(--c-slate-600) / <alpha-value>)',
          700: 'rgb(var(--c-slate-700) / <alpha-value>)',
          800: 'rgb(var(--c-slate-800) / <alpha-value>)',
          900: 'rgb(var(--c-slate-900) / <alpha-value>)',
          950: 'rgb(var(--c-slate-950) / <alpha-value>)',
        },
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bcdfff',
          300: '#8ecbff',
          400: '#59adff',
          500: '#338cff',
          600: '#1c6df3',
          700: '#1756df',
          800: '#1947b4',
          900: '#1a3f8e',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px -12px rgba(16,24,40,.12)',
        card: '0 1px 3px rgba(16,24,40,.06), 0 12px 32px -16px rgba(16,24,40,.18)',
      },
      fontSize: {
        // System micro-label: 11px semibold, used with `uppercase` for eyebrows,
        // table heads, and tiny captions. Weight set at the call site.
        micro: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.06em' }],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in .25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in .18s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
