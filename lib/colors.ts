import type { PokemonColor } from "@/lib/types";

export const pokemonColors: { value: PokemonColor; label: string }[] = [
  { value: "red", label: "Rojo" },
  { value: "blue", label: "Azul" },
  { value: "yellow", label: "Amarillo" },
  { value: "green", label: "Verde" },
  { value: "black", label: "Negro" },
  { value: "brown", label: "Marrón" },
  { value: "purple", label: "Morado" },
  { value: "gray", label: "Gris" },
  { value: "white", label: "Blanco" },
  { value: "pink", label: "Rosa" },
];

export const pokemonColorHex: Record<PokemonColor, string> = {
  red: "#d83a32",
  blue: "#3c66b1",
  yellow: "#f2c52f",
  green: "#4f9a60",
  black: "#1b1b1b",
  brown: "#885c3a",
  purple: "#8057a0",
  gray: "#8e8e8e",
  white: "#f8f7f0",
  pink: "#e779a9",
};
