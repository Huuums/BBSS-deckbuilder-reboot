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
    plugin(({ addVariant }) => {
      addVariant("stuck", "&[stuck]");
    }),
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(125px, 1fr))",
      },
      colors: {
        rarity: {
          UR: "#dcc261",
          SSR: "#ff4242",
          SR: "#4B1C86",
          R: "#1927D0",
          N: "#65CF24",
        },
        custom: {
          pitching: "#F57C3A",
          batting: "#0ABA9B",
        },
      },
      background: {
        "gradient-UR": `background: -webkit-linear-gradient(top, rgb(245, 196, 48) 0%, rgb(255, 233, 137) 20%, rgb(248, 233, 159) 40%, rgb(220, 195, 101) 66%, rgb(196, 160, 44) 86%, rgb(175, 136, 14) 100%);
background: -o-linear-gradient(top, rgb(245, 196, 48) 0%, rgb(255, 233, 137) 20%, rgb(248, 233, 159) 40%, rgb(220, 195, 101) 66%, rgb(196, 160, 44) 86%, rgb(175, 136, 14) 100%);
background: -ms-linear-gradient(top, rgb(245, 196, 48) 0%, rgb(255, 233, 137) 20%, rgb(248, 233, 159) 40%, rgb(220, 195, 101) 66%, rgb(196, 160, 44) 86%, rgb(175, 136, 14) 100%);
background: -moz-linear-gradient(top, rgb(245, 196, 48) 0%, rgb(255, 233, 137) 20%, rgb(248, 233, 159) 40%, rgb(220, 195, 101) 66%, rgb(196, 160, 44) 86%, rgb(175, 136, 14) 100%);
background: linear-gradient(to bottom, rgb(245, 196, 48) 0%, rgb(255, 233, 137) 20%, rgb(248, 233, 159) 40%, rgb(220, 195, 101) 66%, rgb(196, 160, 44) 86%, rgb(175, 136, 14) 100%);`,
      },
    },
  },
};
