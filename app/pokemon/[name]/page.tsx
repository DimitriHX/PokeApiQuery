import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { PokemonDetail } from "@/components/pokemon-detail";
import { getPokemonDetail, pokemonKeys } from "@/lib/pokemon";
import { createQueryClient } from "@/lib/query-client";

export default async function PokemonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const queryClient = createQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: pokemonKeys.detail(name),
      queryFn: () => getPokemonDetail(name),
    });
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PokemonDetail name={name} />
    </HydrationBoundary>
  );
}
