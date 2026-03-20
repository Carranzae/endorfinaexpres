/**
 * Tailwind CSS Configuration
 * Optimized for performance with critical CSS extraction
 */

import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ["var(--font-oswald)", ...defaultTheme.fontFamily.sans],
        poppins: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#7c3aed",
        secondary: "#f27f0d",
        dark: "#1c1c1c",
      },
      animation: {
        spin: "spin 0.8s linear infinite",
      },
      keyframes: {
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
  // Note: line-clamp is built-in to Tailwind CSS by default
};

export default config;
