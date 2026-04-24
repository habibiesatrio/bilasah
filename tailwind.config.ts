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
      },
    },
  },
  plugins: [],
};
export default config;
