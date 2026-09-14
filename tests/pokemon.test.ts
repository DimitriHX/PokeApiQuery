import { describe, expect, it } from "vitest";
import { getPokemonList, pokemonKeys } from "@/lib/pokemon";

describe("Pokemon Query Keys and Data Layer", () => {
  it("debe generar query keys consistentes para la lista", () => {
    const defaultKey = pokemonKeys.list(0, 50);
    expect(defaultKey).toEqual(["pokemon", "list", 0, 50, "all"]);

    const coloredKey = pokemonKeys.list(50, 50, "yellow");
    expect(coloredKey).toEqual(["pokemon", "list", 50, 50, "yellow"]);
  });

  it("debe generar query keys consistentes para el detalle", () => {
    const detailKey = pokemonKeys.detail("Charizard");
    expect(detailKey).toEqual(["pokemon", "detail", "charizard"]);
  });

  it("debe paginar correctamente la lista filtrada por color en memoria", async () => {
    const page1 = await getPokemonList(0, 10, "yellow");
    expect(page1.pokemon.length).toBeLessThanOrEqual(10);
    expect(page1.pokemon.every((p) => p.color === "yellow")).toBe(true);
    expect(page1.pokemon[0]).toHaveProperty("displayName");
    expect(page1.pokemon[0]).toHaveProperty("image");
  });
});
