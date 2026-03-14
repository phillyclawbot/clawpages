import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFDE7",
        yellow: {
          primary: "#FDD835",
          border: "#E0C000",
        },
        dark: "#1A1A1A",
        gray: {
          text: "#666666",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        body: ["system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
