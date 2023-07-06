import { defineConfig, defineGlobalStyles } from "@pandacss/dev"

const globalCss = defineGlobalStyles({
  "html, body": {
    padding: 0,
    margin: 0,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  },
  a: {
    color: "inherit",
    textDecoration: "underline",
  },
  "*": {
    boxSizing: "border-box",
  },
})

export default defineConfig({
  globalCss,
  // Whether to use css reset
  preflight: true,
  // Where to look for your css declarations
  include: [
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/app/**/*.{ts,tsx,js,jsx}",
  ],
  // Files to exclude
  exclude: [],
  // Useful for theme customization
  theme: {
    extend: {},
  },
  // The output directory for your css system
  outdir: "styled-system",
})
