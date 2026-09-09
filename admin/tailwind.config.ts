import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        console: {
          bg: "#09090b",
          subtle: "#0d0e12",
          surface: "#12131a",
          raised: "#171822",
          elevated: "#1e1f2c",
          hover: "#252737",
          border: "#262836",
          borderStrong: "#35384d",
          muted: "#71717a",
          text: "#f4f4f5",
        },
        status: {
          running: "#06b6d4",
          runningBg: "rgba(6, 182, 212, 0.12)",
          runningBorder: "rgba(6, 182, 212, 0.35)",
          success: "#10b981",
          successBg: "rgba(16, 185, 129, 0.12)",
          successBorder: "rgba(16, 185, 129, 0.35)",
          failed: "#f43f5e",
          failedBg: "rgba(244, 63, 94, 0.12)",
          failedBorder: "rgba(244, 63, 94, 0.35)",
          warning: "#f59e0b",
          warningBg: "rgba(245, 158, 11, 0.12)",
          warningBorder: "rgba(245, 158, 11, 0.35)",
          idle: "#71717a",
          idleBg: "rgba(113, 113, 122, 0.12)",
          idleBorder: "rgba(113, 113, 122, 0.35)",
        },
      },
      fontFamily: {
        sans: [
          "Geist",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "SF Mono",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "console-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.6)",
        "console-md": "0 4px 12px 0 rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
