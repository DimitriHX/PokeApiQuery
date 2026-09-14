"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { css } from "@/styled-system/css";
import { pokemonColorHex } from "@/lib/colors";
import { getPokemonDetail, pokemonKeys } from "@/lib/pokemon";
import type { PokemonSummary } from "@/lib/types";

const card = css({
  display: "grid",
  alignItems: "center",
  gridTemplateColumns: { base: "46px 68px minmax(0, 1fr) 20px", sm: "54px 82px minmax(0, 1fr) 28px" },
  minHeight: "104px",
  overflow: "hidden",
  padding: { base: "2", md: "3" },
  position: "relative",
  background: "#f7f7f2",
  borderWidth: "1px",
  borderColor: "#161616",
  borderLeftWidth: "4px",
  borderRadius: "0",
  color: "#161616",
  textDecoration: "none",
  transition: "background 150ms ease",
  _hover: { background: "white" },
  _focusVisible: { outline: "3px solid", outlineColor: "#161616", outlineOffset: "3px" },
});

export function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
  const queryClient = useQueryClient();

  function prefetchDetail() {
    void queryClient.prefetchQuery({
      queryKey: pokemonKeys.detail(pokemon.name),
      queryFn: () => getPokemonDetail(pokemon.name),
    });
  }

  return (
    <Link
      className={card}
      href={`/pokemon/${pokemon.name}`}
      onFocus={prefetchDetail}
      onMouseEnter={prefetchDetail}
      style={{ borderLeftColor: pokemonColorHex[pokemon.color] }}
    >
      <span className={css({ color: "#4a4a4a", fontFamily: "body", fontSize: { base: "sm", sm: "md" }, fontWeight: "bold", letterSpacing: "tight" })}>
        {String(pokemon.id).padStart(3, "0")}
      </span>
      <Image
        alt={`Ilustración de ${pokemon.displayName}`}
        className={css({ height: { base: "62px", sm: "74px" }, objectFit: "contain", width: { base: "62px", sm: "74px" } })}
        height={74}
        priority={pokemon.id <= 8}
        src={pokemon.image}
        width={74}
      />
      <span className={css({ display: "grid", gap: "1", minWidth: "0" })}>
        <strong className={css({ fontSize: { base: "md", md: "lg" }, letterSpacing: "tight", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{pokemon.displayName}</strong>
        <small className={css({ color: "#4a4a4a", fontSize: "xs", letterSpacing: "wide", textTransform: "uppercase" })}>Registro disponible</small>
      </span>
      <span className={css({ color: "#161616", fontSize: "xl", fontWeight: "bold" })} aria-hidden="true">→</span>
    </Link>
  );
}
