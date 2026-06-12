import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vodafone: {
          red: "#E60000",
          dark: "#07070A",
          graphite: "#101116",
          ash: "#1B1D24",
          silver: "#A7ABB8",
        },
      },
      boxShadow: {
        glow: "0 0 32px rgba(230,0,0,0.22)",
      },
    },
  },
  plugins: [],
};
export default config;
