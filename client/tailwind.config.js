/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aurora: {
          indigo:  '#6366f1',
          purple:  '#a855f7',
          pink:    '#ec4899',
          cyan:    '#06b6d4',
          emerald: '#10b981',
          gold:    '#fbbf24',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          strong:  'rgba(255,255,255,0.07)',
          dark:    'rgba(5,5,20,0.8)',
        },
      },
      boxShadow: {
        'aurora':  '0 8px 40px rgba(99,102,241,0.2)',
        'aurora-lg': '0 20px 80px rgba(99,102,241,0.25)',
        'glow-sm': '0 0 15px rgba(99,102,241,0.3)',
        'glow':    '0 0 30px rgba(99,102,241,0.4)',
        'glow-lg': '0 0 60px rgba(99,102,241,0.3)',
        'gold':    '0 0 20px rgba(251,191,36,0.4)',
        'card':    '0 4px 30px rgba(0,0,0,0.5)',
        'card-hover': '0 20px 60px rgba(99,102,241,0.15)',
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
        'aurora-soft':     'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15), rgba(236,72,153,0.15))',
        'dot-grid':        'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      animation: {
        'aurora-move': 'aurora-move 20s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'pulse-glow':  'pulse-glow 2s ease-in-out infinite',
        'shimmer':     'shimmer 3s linear infinite',
        'rank-rotate': 'rank-rotate 12s linear infinite',
        'badge-shine': 'badge-shine 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
