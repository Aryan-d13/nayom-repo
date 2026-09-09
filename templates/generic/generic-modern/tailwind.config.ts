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
        primary: 'var(--primary-color, #2563eb)',
        secondary: 'var(--secondary-color, #16a34a)',
        background: 'var(--bg-color, #ffffff)',
        text: 'var(--text-color, #0f172a)',
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius, 8px)',
      },
    },
  },
  plugins: [],
};
export default config;
