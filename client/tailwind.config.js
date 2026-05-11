/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan:   '#00f5ff',
          purple: '#bf00ff',
          pink:   '#ff0080',
          green:  '#00ff88',
          gold:   '#ffd700',
        },
        cyber: {
          dark:  '#030308',
          card:  '#0a0a18',
          panel: '#0d0d22',
        },
      },
      boxShadow: {
        'neon-cyan':   '0 0 20px rgba(0,245,255,0.5), 0 0 60px rgba(0,245,255,0.2)',
        'neon-purple': '0 0 20px rgba(191,0,255,0.5), 0 0 60px rgba(191,0,255,0.2)',
        'neon-pink':   '0 0 20px rgba(255,0,128,0.5), 0 0 60px rgba(255,0,128,0.2)',
        'neon-green':  '0 0 20px rgba(0,255,136,0.5), 0 0 60px rgba(0,255,136,0.2)',
        'neon-gold':   '0 0 20px rgba(255,215,0,0.5),  0 0 60px rgba(255,215,0,0.2)',
        'card':        '0 8px 40px rgba(0,0,0,0.6)',
        'card-hover':  '0 20px 60px rgba(0,245,255,0.15)',
        'gold':        '0 0 20px rgba(255,215,0,0.4)',
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)",
        'gradient-cyber': 'linear-gradient(135deg, #00f5ff, #bf00ff, #ff0080)',
        'gradient-aurora': 'linear-gradient(135deg, #00ff88, #00f5ff, #bf00ff)',
      },
      animation: {
        'float':        'float 4s ease-in-out infinite',
        'rank-rotate':  'rank-rotate 10s linear infinite',
        'badge-shine':  'badge-shine 2.5s linear infinite',
        'border-spin':  'border-spin 4s ease infinite',
        'scan':         'scan 8s linear infinite',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
