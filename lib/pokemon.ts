import type {
  EvolutionNode,
  PokemonApiResponse,
  PokemonDetail,
  PokemonList,
  PokemonListResponse,
} from "@/lib/types";
import { localizedSpeciesName, pokemonByColor, pokemonColor } from "@/lib/localization";
import type { PokemonColor } from "@/lib/types";

const API_URL = "https://pokeapi.co/api/v2";
const REVALIDATE_SECONDS = 24 * 60 * 60;

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`PokéAPI respondió ${response.status} para ${path}`);
  }

  return response.json() as Promise<T>;
}

function getId(url: string) {
  const id = url.split("/").filter(Boolean).at(-1);
  if (!id) throw new Error(`No se pudo obtener el id de ${url}`);
  return Number(id);
}

export async function getPokemonList(offset = 0, limit = 50, color?: PokemonColor): Promise<PokemonList> {
  if (color) {
    const matchingPokemon = pokemonByColor(color);
    return {
      count: matchingPokemon.length,
      next: offset + limit < matchingPokemon.length ? "more" : null,
      pokemon: matchingPokemon.slice(offset, offset + limit),
    };
  }

  const data = await apiFetch<PokemonListResponse>(`/pokemon?offset=${offset}&limit=${limit}`);

  return {
    count: data.count,
    next: data.next,
    pokemon: data.results.map((pokemon) => {
      const id = getId(pokemon.url);
      return {
        ...pokemon,
        id,
        displayName: localizedSpeciesName(id, pokemon.name),
        color: pokemonColor(id),
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    }),
  };
}

export async function getPokemonDetail(name: string): Promise<PokemonDetail> {
  const pokemon = await apiFetch<PokemonApiResponse>(`/pokemon/${encodeURIComponent(name.toLowerCase())}`);
  const species = await apiFetch<{ evolution_chain: { url: string } }>(
    `/pokemon-species/${pokemon.id}`,
  );
  const evolutionUrl = new URL(species.evolution_chain.url);
  const evolutionChain = await apiFetch<{ chain: EvolutionNode }>(
    evolutionUrl.pathname.replace("/api/v2", ""),
  );

  return { ...pokemon, evolutionChain: evolutionChain.chain };
}

export const pokemonKeys = {
  list: (offset: number, limit: number, color?: PokemonColor) => ["pokemon", "list", offset, limit, color ?? "all"] as const,
  detail: (name: string) => ["pokemon", "detail", name.toLowerCase()] as const,
};
