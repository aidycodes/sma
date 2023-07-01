import { type Config } from "tailwindcss";
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'xs': '370px',
      ...defaultTheme.screens,
    },
    extend: {
      keyFrames: {
        fadein: {
          '0%': {opacity: '0'},
          '100%': {opacity: '0'},
        }
      }
      },
  plugins: [],
  }
} satisfies Config;
