"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { css } from "@/styled-system/css";
import { localizedName, localizedSpeciesName, pokemonColor, pokemonColorHex, resourceId } from "@/lib/localization";
import { PokemonDetailSkeleton } from "@/components/pokemon-skeleton";
import { getPokemonDetail, pokemonKeys } from "@/lib/pokemon";
import type { EvolutionNode } from "@/lib/types";

function evolutionNames(node: EvolutionNode): string[] {
  return [
    localizedName("species", resourceId(node.species.url), node.species.name),
    ...node.evolves_to.flatMap(evolutionNames),
  ];
}

export function PokemonDetail({ name }: { name: string }) {
  const { data, error } = useQuery({
    queryKey: pokemonKeys.detail(name),
    queryFn: () => getPokemonDetail(name),
  });

  if (error) return <p role="alert">No se pudo cargar este Pokémon.</p>;
  if (!data) return <PokemonDetailSkeleton />;

  const image = data.sprites.other["official-artwork"].front_default ?? data.sprites.front_default;
  const evolutions = evolutionNames(data.evolutionChain);
  const displayName = localizedSpeciesName(data.id, data.name);
  const color = pokemonColor(data.id);

  return (
    <main className={css({ maxWidth: "1100px", marginX: "auto", padding: { base: "5", md: "10" } })}>
      <Link className={css({ color: "#161616", fontWeight: "bold", textDecoration: "none", _hover: { textDecoration: "underline" } })} href="/">← Volver a la Pokédex</Link>
      <article className={css({ background: "#f7f7f2", borderWidth: "2px", borderColor: "#161616", borderRadius: "0", display: { base: "block", md: "grid" }, gridTemplateColumns: "300px 1fr", gap: "10", marginTop: "6", overflow: "hidden", padding: { base: "5", md: "8" } })} style={{ borderTopColor: pokemonColorHex[color], borderTopWidth: "10px" }}>
        <div className={css({ background: "#e7e5df", borderWidth: "1px", borderColor: "#161616", borderRadius: "0", display: "grid", placeItems: "center", padding: "6" })}>
          {image ? <Image alt={`Ilustración de ${displayName}`} height={260} priority src={image} width={260} /> : null}
        </div>
        <div>
          <p className={css({ color: "#4a4a4a", fontWeight: "bold", letterSpacing: "wider", margin: "0" })}>#{String(data.id).padStart(3, "0")}</p>
          <h1 className={css({ color: "#161616", fontSize: { base: "4xl", md: "5xl" }, marginTop: "1", marginBottom: "4" })}>{displayName}</h1>
          <div className={css({ display: "flex", flexWrap: "wrap", gap: "2", marginBottom: "6" })}>
            {data.types.map(({ type }) => <span className={tag} key={type.name}>{localizedName("types", resourceId(type.url), type.name)}</span>)}
          </div>
          <dl className={css({ color: "#4a4a4a", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "3", marginBottom: "6" })}>
            <div><dt>Peso</dt><dd className={value}>{data.weight / 10} kg</dd></div>
            <div><dt>Altura</dt><dd className={value}>{data.height / 10} m</dd></div>
          </dl>
          <section className={section}><h2>Habilidades</h2><p>{data.abilities.map(({ ability }) => localizedName("abilities", resourceId(ability.url), ability.name)).join(", ")}</p></section>
          <section className={section}>
            <h2>Evoluciones</h2>
            <p className={css({ textTransform: "capitalize" })}>{evolutions.join(" → ")}</p>
          </section>
        </div>
      </article>
      <section className={css({ background: "#f7f7f2", borderWidth: "2px", borderColor: "#161616", borderRadius: "0", marginTop: "6", padding: { base: "5", md: "7" } })}>
        <h2 className={css({ color: "#161616", fontSize: "2xl", marginTop: "0" })}>Estadísticas base</h2>
        <div className={css({ display: "grid", gap: "3" })}>
          {data.stats.map(({ base_stat, stat }) => (
            <div className={css({ display: "grid", gridTemplateColumns: "120px 1fr 40px", alignItems: "center", gap: "3" })} key={stat.name}>
              <span className={css({ color: "#4a4a4a" })}>{localizedName("stats", resourceId(stat.url), stat.name.replace("-", " "))}</span>
              <div className={css({ background: "#d5d3cc", borderRadius: "0", height: "2" })}>
                <div className={css({ borderRadius: "0", height: "full" })} style={{ background: pokemonColorHex[color], width: `${Math.min(base_stat / 255 * 100, 100)}%` }} />
              </div>
              <strong>{base_stat}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const tag = css({ background: "#e7e5df", borderWidth: "1px", borderColor: "#161616", borderRadius: "0", color: "#161616", fontSize: "sm", fontWeight: "bold", paddingX: "3", paddingY: "1", textTransform: "capitalize" });
const value = css({ color: "#161616", fontSize: "lg", fontWeight: "bold", margin: "0" });
const section = css({ borderTopWidth: "1px", borderColor: "#161616", color: "#4a4a4a", paddingTop: "4", "& h2": { color: "#161616", fontSize: "lg" } });
