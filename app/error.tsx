"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ padding: "2.5rem" }}>
      <h1>No se pudo cargar esta página</h1>
      <button onClick={reset} type="button">Reintentar</button>
    </main>
  );
}
