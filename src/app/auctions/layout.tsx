import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subastas en Vivo — Estampas FIFA 2026",
  description:
    "Participa en subastas en vivo de estampas del Mundial FIFA 2026. Puja por tarjetas legendarias, épicas y raras verificadas. Ingresa por $10 MXN y puja sin límite.",
  keywords: [
    "subastas estampas mundial 2026",
    "subasta tarjetas fútbol en vivo",
    "pujas estampas FIFA",
    "subastas cartas coleccionables México",
    "live auction FIFA World Cup cards",
  ],
  alternates: {
    canonical: "https://worldcuptrading.zeqhora.com/auctions",
  },
  openGraph: {
    title: "Subastas en Vivo — Estampas FIFA World Cup 2026",
    description:
      "Subastas en tiempo real de tarjetas verificadas del Mundial. Puja por las estampas más raras y legendarias.",
    url: "https://worldcuptrading.zeqhora.com/auctions",
    type: "website",
  },
};

export default function AuctionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
