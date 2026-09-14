import { PokemonGridSkeleton } from "@/components/pokemon-skeleton";
import { css } from "@/styled-system/css";

export default function Loading() {
  return (
    <main style={{ margin: "0 auto", maxWidth: "1440px", padding: "clamp(1.25rem, 4vw, 4rem)" }}>
      <header style={{ borderBottom: "3px solid #161616", marginBottom: "2rem", paddingBottom: "1rem" }}>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.07em", lineHeight: 1, margin: 0 }}>
          Pokedex TypeScript
        </h1>
      </header>
      <div
        className={css({
          background: "#f7f7f2",
          borderWidth: "2px",
          borderColor: "#161616",
          padding: "4",
          marginBottom: "6",
          height: "80px",
        })}
      />
      <PokemonGridSkeleton count={12} />
    </main>
  );
}
