/** @type {import('tailwindcss').Config} */
//eslint-disable-next-line
const plugin = require("tailwindcss/plugin");
//eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
  ],
  darkMode: "class",
  plugins: [
    require("@tailwindcss/forms"),
    plugin(({ addVariant }) => {
      addVariant("stuck", "&[stuck]");
    }),
  ],
  theme: {
    extend: {
      maxWidth: {
        "1/2": "calc(50% - .5rem)",
        "1/3": "calc(33% - .5rem)",
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(125px, 1fr))",
        "auto-small": "repeat(auto-fill, minmax(100px, 1fr))",
      },
      colors: {
        rarity: {
          "UR-dark": "#381e00",
          UR: "#dcc261",
          "SSR-dark": "#28090a",
          SSR: "#ff4242",
          "SR-dark": "#230c28",
          SR: "#4B1C86",
          "R-dark": "#0b1622",
          R: "#1927D0",
          "N-dark": "#0f2416",
          N: "#65CF24",
        },
        custom: {
          pitching: "#F57C3A",
          batting: "#0ABA9B",
        },
      },
      boxShadow: {
        maxSkill: "0px 0px 15px 7px rgba(209,183,52,1)",
      },
      animation: {
        "pulse-full": "pulse-full 4s linear infinite alternate",
        "pulse-full-reverse": "pulse-full 4s linear infinite alternate-reverse",
      },
      keyframes: {
        "pulse-full": {
          "0%, 45%": { opacity: 1 },
          "55%, 100%": { opacity: 0 },
        },
      },
    },
  },
};
