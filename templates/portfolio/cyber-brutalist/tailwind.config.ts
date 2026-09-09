import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          yellow: '#FFE600',
          yellowDark: '#E6CF00',
          black: '#050505',
          void: '#000000',
          carbon: '#0E1015',
          steel: '#171A21',
          border: 'rgba(255, 255, 255, 0.15)',
          borderYellow: 'rgba(255, 230, 0, 0.35)',
          teal: '#061A1E',
          tealAccent: '#00F0FF',
          mint: '#022417',
          mintAccent: '#00FF88',
          textMuted: '#8E929B',
          textDim: '#555A64',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Barlow Condensed', 'Anton', 'Impact', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Space Mono', 'Courier New', 'monospace'],
        sans: ['var(--font-sans)', 'Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        ui: '0px',
        media: '2rem',
        pill: '9999px',
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
        'marquee-fast': 'marquee 16s linear infinite',
        'marquee-reverse': 'marqueeReverse 28s linear infinite',
        'radar': 'radarSweep 4s linear infinite',
        'blink': 'blink 1s step-start infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translate3d(-50%, 0, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
      backgroundImage: {
        'hazard-pattern': 'repeating-linear-gradient(-45deg, #FFE600, #FFE600 20px, #050505 20px, #050505 40px)',
        'hazard-subtle': 'repeating-linear-gradient(-45deg, rgba(255,230,0,0.15), rgba(255,230,0,0.15) 12px, transparent 12px, transparent 24px)',
        'checker-pattern': 'linear-gradient(45deg, #FFE600 25%, transparent 25%), linear-gradient(-45deg, #FFE600 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #FFE600 75%), linear-gradient(-45deg, transparent 75%, #FFE600 75%)',
        'dotted-grid': 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
        'dotted-yellow': 'radial-gradient(rgba(255, 230, 0, 0.25) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
