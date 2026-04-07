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
        surface: "#0b1326",
        "surface-container-lowest": "#060e20",
        "surface-container-low": "#131b2e",
        "surface-container": "#171f33",
        "surface-container-high": "#222a3d",
        "surface-container-highest": "#2d3449",
        "surface-bright": "#31394d",
        "surface-dim": "#0b1326",
        "surface-variant": "#2d3449",
        primary: "#adc6ff",
        "primary-container": "#4d8eff",
        "primary-fixed": "#d8e2ff",
        "primary-fixed-dim": "#adc6ff",
        "primary-fixed-variant": "#004395",
        "on-primary": "#002e6a",
        "on-primary-container": "#00285d",
        secondary: "#ddb7ff",
        "secondary-container": "#6f00be",
        "secondary-fixed": "#f0dbff",
        "secondary-fixed-dim": "#ddb7ff",
        "secondary-fixed-variant": "#6900b3",
        "on-secondary": "#490080",
        "on-secondary-container": "#d6a9ff",
        tertiary: "#ffb786",
        "tertiary-container": "#df7412",
        "tertiary-fixed": "#ffdcc6",
        "tertiary-fixed-dim": "#ffb786",
        "tertiary-fixed-variant": "#723600",
        "on-tertiary": "#502400",
        "on-tertiary-container": "#461f00",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "on-surface": "#dae2fd",
        "on-surface-variant": "#c2c6d6",
        "on-background": "#dae2fd",
        outline: "#8c909f",
        "outline-variant": "#424754",
        "inverse-surface": "#dae2fd",
        "inverse-on-surface": "#283044",
        "inverse-primary": "#005ac2",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      borderRadius: {
        DEFAULT: "0.5rem", // ROUND_FOUR
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, #adc6ff 0%, #4d8eff 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
