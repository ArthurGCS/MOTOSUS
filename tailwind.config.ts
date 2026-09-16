import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sus: {
          blue: {
            DEFAULT: "#005CAB",
            light: "#E6F0FA",
            dark: "#003D73",
          },
          green: {
            DEFAULT: "#00875F",
            light: "#E6F7F0",
            dark: "#005C40",
          },
          yellow: {
            DEFAULT: "#F59E0B",
            light: "#FEF3C7",
          },
          red: {
            DEFAULT: "#DC2626",
            light: "#FEE2E2",
          }
        },
      },
    },
  },
  plugins: [],
};
export default config;
