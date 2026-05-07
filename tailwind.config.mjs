import defaultTheme from "tailwindcss/defaultTheme.js";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fraktion Sans', ...defaultTheme.fontFamily.sans],
        mono: ['Fraktion Mono', ...defaultTheme.fontFamily.mono],
      },
      screens: {
        'xs': '375px',
        '3xl': '1728px',
      },
    },
  },
  plugins: [],
};         