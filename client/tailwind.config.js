/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        xp: {
          gold:   '#f59e0b',
          purple: '#8b5cf6',
          cyan:   '#06b6d4',
          green:  '#10b981',
          pink:   '#ec4899',
          dark:   '#0a0a1a',
        },
      },
      boxShadow: {
        'gold':   '0 0 20px rgba(245,158,11,0.5)',
        'purple': '0 0 20px rgba(139,92,246,0.5)',
        'cyan':   '0 0 20px rgba(6,182,212,0.5)',
      },
      animation: {
        'xp-fill':    'xp-fill 1.2s cubic-bezier(.4,0,.2,1) forwards',
        'float-up':   'float-up 1.5s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'badge-shine':'badge-shine 2s linear infinite',
        'rank-rotate':'rank-rotate 8s linear infinite',
      },
    },
  },
  plugins: [],
};
