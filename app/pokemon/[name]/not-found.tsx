import Link from "next/link";

export default function NotFound() {
  return <main style={{ padding: "2.5rem" }}><h1>Pokémon no encontrado</h1><Link href="/">Volver a la Pokédex</Link></main>;
}
