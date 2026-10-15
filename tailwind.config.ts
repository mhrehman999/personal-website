import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./content/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        xs: "360px",
      },
      colors: {
        bg: "var(--bg)",
        line: "var(--line)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        fg: "var(--fg)",
        "fg-2": "var(--fg-2)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "serif"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        input: "var(--radius-input)",
      },
    },
  },
  plugins: [],
};

export default config;
