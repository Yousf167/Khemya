/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: "#13ec37",
        "primary-dark": "#0fb82b",
        "primary-hover": "#10c82f",
        
        // Background colors - these are the ones needed for bg-background-light
        "background-light": "#f6f8f6",
        "background-dark": "#102213",
        
        // Surface colors
        "surface-light": "#ffffff",
        "surface-dark": "#1a2c1e",
        "surface-border": "#28392b",
        "surface-dark-alt": "#1c271d",
        "surface-dark-alt2": "#1a2e1e",
        
        // Text colors
        "text-main": "#111812",
        "text-muted": "#526355",
        "text-muted-dark": "#9db9a1",
        "text-secondary": "#618968",
        
        // Border colors
        "border-light": "#f0f4f1",
        "border-dark": "#28392b",
        "border-gray": "#e5eadd",
        
        // Input colors
        "input-bg": "#28392b",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
