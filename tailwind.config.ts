import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design palette colors
        palette: {
          ivory: "#E5D4B8",           // Ivory / Champagne
          "dusty-blue": "#5F7FA8",    // Dusty Blue
          "butter-yellow": "#D4AF37", // Butter Yellow
          "sage-green": "#7BA876",    // Sage Green
          "walnut-wood": "#5D4E37",   // Walnut Wood
          "gold-accent": "#C89B7B",   // Gold Accent
          "warm-white": "#F5F1E8",    // Warm White
        },
        sage: {
          "50": "#f4f7f4",
          "100": "#e5ede5",
          "200": "#ceddce",
          "300": "#aac2aa",
          "400": "#80a180",
          "500": "#648464",
          "600": "#4d694d",
          "700": "#3f543f",
          "800": "#354435",
          "900": "#2d3a2d",
          "950": "#181f18",
        },
        merah: {
          "50": "#fef2f2",
          "100": "#fee2e2",
          "200": "#fecaca",
          "300": "#fca5a5",
          "400": "#f87171",
          "500": "#ef4444",
          "600": "#dc2626",
          "700": "#b91c1c",
          "800": "#991b1b",
          "900": "#7f1d1d",
          "950": "#450a0a",
        },
        biru: {
          "50": "#eff6ff",
          "100": "#dbeafe",
          "200": "#bfdbfe",
          "300": "#93c5fd",
          "400": "#60a5fa",
          "500": "#3b82f6",
          "600": "#2563eb",
          "700": "#1d4ed8",
          "800": "#1e40af",
          "900": "#1e3a8a",
          "950": "#172554",
        },
        hijau: {
          "50": "#ecfdf5",
          "100": "#d1fae5",
          "200": "#a7f3d0",
          "300": "#6ee7b7",
          "400": "#34d399",
          "500": "#10b981",
          "600": "#059669",
          "700": "#047857",
          "800": "#065f46",
          "900": "#064e3b",
          "950": "#022c22",
        },
      },
    },
  },
  plugins: [],
};
export default config;
