"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { startTransition, useState, type FormEvent } from "react";
import { css } from "@/styled-system/css";
import { pokemonColorHex, pokemonColors } from "@/lib/colors";
import { findPokemonIdentifier, randomPokemonIdentifier } from "@/lib/localization";
import { getPokemonList, pokemonKeys } from "@/lib/pokemon";
import type { PokemonColor } from "@/lib/types";
import { PokemonCard } from "@/components/pokemon-card";
import { PokemonGridSkeleton } from "@/components/pokemon-skeleton";

const pageSize = 50;

export function Pokedex() {
  const [offset, setOffset] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const [search, setSearch] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [color, setColor] = useState<PokemonColor | undefined>();
  const router = useRouter();
  const { data, error, isFetching } = useQuery({
    queryKey: pokemonKeys.list(offset, pageSize, color),
    queryFn: () => getPokemonList(offset, pageSize, color),
    placeholderData: keepPreviousData,
  });

  if (error) {
    return <p role="alert">No se pudo cargar la Pokédex. Inténtalo nuevamente.</p>;
  }

  if (!data) return <PokemonGridSkeleton count={12} />;

  const page = offset / pageSize + 1;
  const totalPages = Math.ceil(data.count / pageSize);
  const canGoForward = Boolean(data.next);

  function goToPage(nextPage: number) {
    const validPage = Math.max(1, Math.min(totalPages, nextPage));
    setPageInput(String(validPage));
    startTransition(() => setOffset((validPage - 1) * pageSize));
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const identifier = findPokemonIdentifier(search);
    if (!identifier) {
      setSearchMessage("No encontramos un Pokémon con ese nombre o número.");
      return;
    }
    setSearchMessage("");
    router.push(`/pokemon/${identifier}`);
  }

  function submitPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToPage(Number(pageInput));
  }

  function showRandomPokemon() {
    router.push(`/pokemon/${randomPokemonIdentifier()}`);
  }

  function selectColor(nextColor?: PokemonColor) {
    setColor(nextColor);
    setPageInput("1");
    startTransition(() => setOffset(0));
  }

  return (
    <section className={css({ paddingBottom: "10" })}>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", lg: "minmax(0, 1fr) auto" },
          alignItems: "center",
          background: "#f7f7f2",
          borderWidth: "2px",
          borderColor: "#161616",
          borderRadius: "0",
          marginBottom: "6",
          padding: { base: "4", md: "5" },
          gap: "4",
        })}
      >
        <form className={css({ display: "grid", gap: "2" })} onSubmit={submitSearch}>
          <label className={label} htmlFor="pokemon-search">Buscar en la base de datos</label>
          <div className={css({ display: "flex", maxWidth: "xl" })}>
            <span className={searchIcon} aria-hidden="true"><SearchIcon /></span>
            <input
              className={searchInput}
              id="pokemon-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre o número, por ejemplo: Pikachu o 25"
              type="search"
              value={search}
            />
            <button className={primaryButton} type="submit">Buscar</button>
            <button className={randomButton} onClick={showRandomPokemon} type="button">Sorpréndeme</button>
          </div>
          {searchMessage ? <p className={css({ color: "#ffb4b6", fontSize: "sm", margin: "0" })} role="alert">{searchMessage}</p> : null}
        </form>
        <div className={css({ display: "flex", alignItems: { base: "flex-start", sm: "center" }, flexDirection: { base: "column", sm: "row" }, gap: "3" })}>
          <form className={css({ display: "flex", alignItems: "center", gap: "2" })} onSubmit={submitPage}>
            <label className={label} htmlFor="page-number">Página</label>
            <input className={pageInputStyle} id="page-number" max={totalPages} min="1" onChange={(event) => setPageInput(event.target.value)} type="number" value={pageInput} />
            <span className={css({ color: "#8fa9c5", fontSize: "sm" })}>de {totalPages}</span>
            <button className={button} type="submit">Ir</button>
          </form>
          <div className={css({ display: "flex", gap: "2" })}>
          <button
            className={button}
            disabled={offset === 0 || isFetching}
            onClick={() => goToPage(page - 1)}
            type="button"
          >
            Anterior
          </button>
          <button
            className={button}
            disabled={!canGoForward || isFetching}
            onClick={() => goToPage(page + 1)}
            type="button"
          >
            Siguiente
          </button>
          </div>
        </div>
      </div>
      <div className={css({ alignItems: "center", borderBottomWidth: "1px", borderColor: "#161616", display: "flex", flexWrap: "wrap", gap: "2", marginBottom: "4", paddingBottom: "4" })}>
        <button className={filterButton} data-selected={!color || undefined} onClick={() => selectColor()} type="button">Todos</button>
        {pokemonColors.map((entry) => (
          <button className={filterButton} data-selected={color === entry.value || undefined} key={entry.value} onClick={() => selectColor(entry.value)} type="button">
            <span aria-hidden="true" className={colorSwatch} style={{ backgroundColor: pokemonColorHex[entry.value] }} />
            {entry.label}
          </button>
        ))}
      </div>
      <p className={css({ color: "#4a4a4a", fontSize: "sm", fontWeight: "bold", letterSpacing: "wide", marginBottom: "4", textTransform: "uppercase" })} aria-live="polite">
        {color ? `Color: ${pokemonColors.find((entry) => entry.value === color)?.label} · ` : ""}Registros {offset + 1} a {Math.min(offset + pageSize, data.count)} · Página {page}{isFetching ? " · Actualizando" : ""}
      </p>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", xl: "repeat(2, minmax(0, 1fr))" },
          gap: "1",
          transition: "opacity 150ms ease",
        })}
        style={{ opacity: isFetching ? 0.65 : 1 }}
      >
        {data.pokemon.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />)}
      </div>
    </section>
  );
}

const button = css({
  borderWidth: "1px",
  borderColor: "#161616",
  borderRadius: "0",
  background: "#f7f7f2",
  color: "#161616",
  cursor: "pointer",
  fontWeight: "bold",
  paddingX: { base: "3", md: "4" },
  paddingY: "2",
  transition: "background 150ms ease, transform 150ms ease",
  _hover: { background: "#161616", color: "#f7f7f2" },
  _disabled: { cursor: "not-allowed", opacity: 0.4, transform: "none" },
});

const label = css({ color: "#161616", fontSize: "xs", fontWeight: "bold", letterSpacing: "wider", textTransform: "uppercase" });
const searchInput = css({ background: "white", borderWidth: "1px", borderColor: "#161616", borderLeftWidth: "0", color: "#161616", flex: "1", minWidth: "0", outline: "none", paddingX: "3", paddingY: "2.5", _focus: { background: "#fff8c9" } });
const searchIcon = css({ alignItems: "center", background: "#161616", borderWidth: "1px", borderColor: "#161616", borderRightWidth: "0", color: "white", display: "flex", paddingLeft: "3" });
const primaryButton = css({ background: "#161616", border: "0", color: "white", cursor: "pointer", fontWeight: "bold", paddingX: "4", _hover: { background: "#4a4a4a" } });
const randomButton = css({ background: "#f2c52f", borderWidth: "1px", borderColor: "#161616", borderLeftWidth: "0", color: "#161616", cursor: "pointer", fontWeight: "bold", paddingX: "4", _hover: { background: "#ffd94a" } });
const pageInputStyle = css({ background: "white", borderWidth: "1px", borderColor: "#161616", borderRadius: "0", color: "#161616", outline: "none", paddingX: "2", paddingY: "1.5", textAlign: "center", width: "14" });
const filterButton = css({ alignItems: "center", background: "transparent", border: "0", color: "#161616", cursor: "pointer", display: "flex", fontFamily: "body", fontSize: "xs", fontWeight: "bold", gap: "1.5", paddingX: "2", paddingY: "1.5", _hover: { background: "#d5d3cc" }, "&[data-selected]": { background: "#161616", color: "white" } });
const colorSwatch = css({ borderWidth: "1px", borderColor: "#161616", display: "inline-block", height: "3", width: "3" });

function SearchIcon() {
  return <svg fill="none" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>;
}
