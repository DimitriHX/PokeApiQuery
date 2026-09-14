import { describe, expect, it } from "vitest";
import { pokemonColorHex, pokemonColors } from "@/lib/colors";
import { findPokemonIdentifier, localizedName, resourceId } from "@/lib/localization";

describe("Localization and Color Utilities", () => {
  it("debe extraer el ID numérico de una URL de recurso de PokéAPI", () => {
    expect(resourceId("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
    expect(resourceId("https://pokeapi.co/api/v2/pokemon-species/1/")).toBe(1);
    expect(resourceId("")).toBeUndefined();
  });

  it("debe mapear correctamente los colores y sus valores hexadecimales", () => {
    expect(pokemonColors.length).toBe(10);
    expect(pokemonColorHex.yellow).toBe("#f2c52f");
    expect(pokemonColorHex.blue).toBe("#3c66b1");
  });

  it("debe retornar el valor fallback si el ID no está definido", () => {
    const name = localizedName("species", undefined, "pikachu");
    expect(name).toBe("pikachu");
  });

  it("debe resolver la búsqueda de identificador sin importar mayúsculas o números", () => {
    expect(findPokemonIdentifier("25")).toBe("pikachu");
    expect(findPokemonIdentifier("pikachu")).toBe("pikachu");
    expect(findPokemonIdentifier("PIKACHU")).toBe("pikachu");
  });
});
