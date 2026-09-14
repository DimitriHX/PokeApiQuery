import localizedData from "@/data/pokemon-es.json";
import type { PokemonColor, PokemonSummary } from "@/lib/types";

type LocalizedCategory = "species" | "types" | "abilities" | "stats";

export { pokemonColors, pokemonColorHex } from "@/lib/colors";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function resourceId(url: string) {
  const id = url.split("/").filter(Boolean).at(-1);
  return id ? Number(id) : undefined;
}

export function localizedName(category: LocalizedCategory, id: number | undefined, fallback: string) {
  if (!id) return fallback;
  const translations = localizedData[category] as Record<string, string>;
  return translations[String(id)] ?? fallback;
}

export function localizedSpeciesName(id: number, fallback: string) {
  return localizedName("species", id, fallback);
}

export function pokemonColor(id: number): PokemonColor {
  return ((localizedData.colors as Record<string, PokemonColor>)[String(id)] ?? "gray");
}

export function pokemonByColor(color: PokemonColor): PokemonSummary[] {
  return (localizedData.catalog as { id: number; identifier: string; name: string; color: PokemonColor }[])
    .filter((pokemon) => pokemon.color === color)
    .map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.identifier,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.identifier}/`,
      displayName: pokemon.name,
      color: pokemon.color,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
    }));
}

export function findPokemonIdentifier(query: string) {
  return (localizedData.search as Record<string, string>)[normalize(query)];
}

export function randomPokemonIdentifier() {
  const catalog = localizedData.catalog as { identifier: string }[];
  return catalog[Math.floor(Math.random() * catalog.length)].identifier;
}
