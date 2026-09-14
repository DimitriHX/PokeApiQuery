import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Pokedex } from "@/components/pokedex";
import { getPokemonList, pokemonKeys } from "@/lib/pokemon";
import { createQueryClient } from "@/lib/query-client";

export default async function HomePage() {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery({
    queryKey: pokemonKeys.list(0, 50),
    queryFn: () => getPokemonList(0, 50),
  });

  return (
    <main style={{ margin: "0 auto", maxWidth: "1440px", padding: "clamp(1.25rem, 4vw, 4rem)" }}>
      <header style={{ borderBottom: "3px solid #161616", marginBottom: "2rem", paddingBottom: "1rem" }}>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.07em", lineHeight: 1, margin: 0 }}>Pokedex TypeScript</h1>
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Pokedex />
      </HydrationBoundary>
    </main>
  );
}
