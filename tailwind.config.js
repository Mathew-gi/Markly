module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"], // укажи свои пути
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
