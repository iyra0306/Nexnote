/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rpg: {
          void:     '#020408',
          deep:     '#060d14',
          panel:    '#0a1520',
          card:     '#0d1e2e',
          teal:     '#00d4aa',
          'teal-dim':'#00a882',
          gold:     '#f0b429',
          'gold-dim':'#c8941a',
          emerald:  '#00e676',
          crimson:  '#ff4757',
          sapphire: '#2979ff',
          amethyst: '#aa00ff',
        },
      },
      boxShadow: {
        'teal':    '0 0 20px rgba(0,212,170,0.35), 0 0 60px rgba(0,212,170,0.1)',
        'gold':    '0 0 20px rgba(240,180,41,0.35), 0 0 60px rgba(240,180,41,0.1)',
        'crimson': '0 0 20px rgba(255,71,87,0.35)',
        'card':    '0 8px 32px rgba(0,0,0,0.6)',
        'hud':     '0 4px 24px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,212,170,0.1)',
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #00d4aa, #00a882)',
        'gold-gradient': 'linear-gradient(135deg, #f0b429, #ff8c00)',
        'epic-gradient': 'linear-gradient(135deg, #00d4aa, #f0b429, #ff4757)',
        'grid-lines':    'linear-gradient(rgba(0,212,170,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.04) 1px, transparent 1px)',
      },
      animation: {
        'teal-pulse': 'teal-pulse 2.5s ease-in-out infinite',
        'gold-shimmer':'gold-shimmer 2.5s linear infinite',
        'rank-rotate': 'rank-rotate 12s linear infinite',
        'float':       'float 5s ease-in-out infinite',
        'badge-shine': 'badge-shine 2.5s linear infinite',
      },
      fontFamily: {
        display: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
