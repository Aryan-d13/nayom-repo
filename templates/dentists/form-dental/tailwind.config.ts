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
        bone: {
          DEFAULT: "#EEEAE1",
          light: "#F7F5F0",
          dark: "#E3DDD2",
        },
        ink: {
          DEFAULT: "#1E211F",
          muted: "#5C615E",
          pale: "#8E9490",
          faint: "#B5B9B6",
        },
        clay: {
          DEFAULT: "#B66E58",
          hover: "#A45E49",
          dark: "#8F4E3C",
          light: "#C98570",
        },
        mist: {
          DEFAULT: "#D7D8D2",
          light: "#EAEBE7",
          dark: "#C5C7BF",
        },
        white: {
          DEFAULT: "#FBFAF7",
          pure: "#FFFFFF",
        },
        stone: {
          DEFAULT: "#B8B5AC",
          light: "#CBC8BF",
          dark: "#9E9A90",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
        widest: "0.18em",
        ultra: "0.24em",
      },
    },
  },
  plugins: [],
} satisfies Config;

