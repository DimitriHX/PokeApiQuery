import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  exclude: [],
  outdir: "styled-system",
  theme: {
    extend: {
      tokens: {
        fonts: {
          body: { value: "var(--font-oxanium), Arial, sans-serif" },
        },
        colors: {
          pokemon: {
            fire: { value: "#e4572e" },
            water: { value: "#247ba0" },
            grass: { value: "#4f9d69" },
            electric: { value: "#e4b61a" },
            psychic: { value: "#c64b8c" },
            ice: { value: "#70c1d7" },
            dragon: { value: "#6c5ce7" },
            dark: { value: "#4a403a" },
            normal: { value: "#8a8a7a" },
          },
        },
      },
    },
  },
});
