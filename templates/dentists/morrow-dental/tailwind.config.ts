import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        porcelain: {
          light: "#FAF9F6",
          DEFAULT: "#F5F3EE",
          dark: "#ECE8DF",
        },
        ink: {
          DEFAULT: "#1C1C1A",
          light: "#2A2926",
          muted: "#57544F",
          faint: "#8C8880",
        },
        blush: {
          light: "#F4EAE6",
          DEFAULT: "#D9B8AE",
          dark: "#C59E93",
        },
        stone: {
          light: "#DDD9D0",
          DEFAULT: "#C9C4BA",
          dark: "#ABA599",
        },
        softblack: "#2A2926",
        white: {
          DEFAULT: "#FFFDF9",
          pure: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
        wide: "0.04em",
        wider: "0.08em",
        widest: "0.16em",
        ultra: "0.24em",
      },
    },
  },
  plugins: [],
} satisfies Config;
