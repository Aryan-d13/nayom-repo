import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: "#0f172a",
        surfaceHover: "#1e293b",
        border: "#1e293b",
        primary: "#38bdf8",
        accent: "#34d399",
      },
    },
  },
  plugins: [],
};
export default config;
