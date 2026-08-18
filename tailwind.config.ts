import type { Config } from "tailwindcss";

/**
 * Tokenlar to'g'ridan-to'g'ri Figma "Noor Global" faylidan olingan
 * (WEB sahifasi → get_variable_defs).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1ece83",
          strong: "#12b872",
          soft: "#e9fbf2",
        },
        success: "#00bc7d",
        ink: {
          DEFAULT: "#0c0a09",
          secondary: "#79716b",
          muted: "#a6a09b",
          icon: "#44403b",
        },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#fafaf9",
          raised: "#f5f5f4",
        },
        line: {
          DEFAULT: "#f3f2f1",
          bold: "#e4e4e4",
        },
        night: {
          base: "#04140d",
          panel: "#0d241a",
          edge: "#1d3b2e",
        },
      },
      borderRadius: {
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        soft: "0 4px 16px 0 #0000000f",
        panel: "0 18px 48px -12px #00000033",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
