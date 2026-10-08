import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm monochrome only. Charcoal kept for dark surfaces.
        // Spot color comes exclusively from muted pastel utilities
        // in globals.css (.tag-*). No bright brand primaries.
        charcoal: {
          950: "#121417",
          900: "#1A1D21",
          800: "#24282E",
          700: "#33383F",
        },
      },
      fontFamily: {
        // UI: Outfit (geometric, characterful). Loaded via next/font, system
        // fallback keeps slow connections fast.
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        sans: ["var(--font-display)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        // Editorial serif: hero headings + quotes only. Tight tracking applied
        // at usage. Newsreader via next/font.
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        // Near-zero shadows. Base none; hover-only ultra-diffuse lift.
        card: "0 0 0 rgba(0, 0, 0, 0)",
        lift: "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      container: { center: true, padding: "1rem" },
      maxWidth: {
        shell: "80rem", // 1280px container cap
      },
    },
  },
  plugins: [],
};

export default config;
