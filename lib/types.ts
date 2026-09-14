export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}

export interface PokemonSummary extends NamedApiResource {
  id: number;
  image: string;
  displayName: string;
  color: PokemonColor;
}

export type PokemonColor = "red" | "blue" | "yellow" | "green" | "black" | "brown" | "purple" | "gray" | "white" | "pink";

export interface PokemonList {
  count: number;
  next: string | null;
  pokemon: PokemonSummary[];
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: { ability: NamedApiResource; is_hidden: boolean }[];
  stats: { base_stat: number; stat: NamedApiResource }[];
  types: { slot: number; type: NamedApiResource }[];
  sprites: {
    front_default: string | null;
    other: { "official-artwork": { front_default: string | null } };
  };
  species: NamedApiResource;
}

export interface EvolutionNode {
  species: NamedApiResource;
  evolves_to: EvolutionNode[];
}

export interface PokemonDetail extends PokemonApiResponse {
  evolutionChain: EvolutionNode;
}
