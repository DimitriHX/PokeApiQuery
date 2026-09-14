import { css } from "@/styled-system/css";

const skeletonPulse = css({
  animation: "pulse 1.5s ease-in-out infinite",
  background: "#dcdad3",
});

const cardSkeleton = css({
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
  borderLeftColor: "#d5d3cc",
  borderRadius: "0",
});

export function PokemonCardSkeleton() {
  return (
    <div aria-hidden="true" className={cardSkeleton}>
      <div className={`${skeletonPulse} ${css({ height: "1.25rem", width: "2rem", borderRadius: "0" })}`} />
      <div className={`${skeletonPulse} ${css({ height: { base: "62px", sm: "74px" }, width: { base: "62px", sm: "74px" }, borderRadius: "0" })}`} />
      <div className={css({ display: "grid", gap: "2", minWidth: "0" })}>
        <div className={`${skeletonPulse} ${css({ height: "1.25rem", width: "65%", borderRadius: "0" })}`} />
        <div className={`${skeletonPulse} ${css({ height: "0.75rem", width: "45%", borderRadius: "0" })}`} />
      </div>
      <div className={`${skeletonPulse} ${css({ height: "1rem", width: "1rem", borderRadius: "0" })}`} />
    </div>
  );
}

export function PokemonGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando cuadrícula de Pokémon"
      className={css({
        display: "grid",
        gridTemplateColumns: { base: "1fr", xl: "repeat(2, minmax(0, 1fr))" },
        gap: "1",
      })}
    >
      {Array.from({ length: count }).map((_, index) => (
        <PokemonCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PokemonDetailSkeleton() {
  return (
    <main aria-busy="true" className={css({ maxWidth: "1100px", marginX: "auto", padding: { base: "5", md: "10" } })}>
      <div className={`${skeletonPulse} ${css({ height: "1.5rem", width: "160px", marginBottom: "6" })}`} />
      <article
        className={css({
          background: "#f7f7f2",
          borderWidth: "2px",
          borderColor: "#161616",
          display: { base: "block", md: "grid" },
          gridTemplateColumns: "300px 1fr",
          gap: "10",
          padding: { base: "5", md: "8" },
        })}
      >
        <div className={css({ background: "#e7e5df", height: "300px", display: "grid", placeItems: "center" })}>
          <div className={`${skeletonPulse} ${css({ height: "220px", width: "220px" })}`} />
        </div>
        <div className={css({ display: "grid", gap: "4" })}>
          <div className={`${skeletonPulse} ${css({ height: "1rem", width: "60px" })}`} />
          <div className={`${skeletonPulse} ${css({ height: "3rem", width: "240px" })}`} />
          <div className={css({ display: "flex", gap: "2" })}>
            <div className={`${skeletonPulse} ${css({ height: "2rem", width: "80px" })}`} />
            <div className={`${skeletonPulse} ${css({ height: "2rem", width: "80px" })}`} />
          </div>
          <div className={`${skeletonPulse} ${css({ height: "4rem", width: "100%" })}`} />
        </div>
      </article>
    </main>
  );
}
