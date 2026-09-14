import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import type { ReactNode } from "react";
import "../styled-system/styles.css";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
});

export const metadata: Metadata = {
  title: "Pokedex TypeScript",
  description: "Pokédex con caché e hidratación de TanStack Query",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body className={oxanium.variable}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
