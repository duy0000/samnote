/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // fontWeight: {
    //   thin: "100",
    //   hairline: "100",
    //   extralight: "200",
    //   light: "300",
    //   normal: "400",
    //   medium: "500",
    //   semibold: "600",
    //   bold: "700",
    //   extrabold: "800",
    //   "extra-bold": "800",
    //   black: "900",
    // },
    extend: {
      backgroundImage: {
        login: "url('/public/loginBackground.png')",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  important: "#app",
};
