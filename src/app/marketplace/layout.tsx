import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mercado de Estampas FIFA 2026",
  description:
    "Compra y vende estampas del Mundial FIFA 2026 en el mercado más grande de México. Encuentra tarjetas raras, especiales y de todos los equipos clasificados.",
  keywords: [
    "comprar estampas mundial 2026",
    "vender estampas FIFA",
    "mercado estampas fútbol México",
    "tarjetas raras world cup",
    "estampas legendarias FIFA 2026",
  ],
  alternates: {
    canonical: "https://worldcuptrading.zeqhora.com/marketplace",
  },
  openGraph: {
    title: "Mercado de Estampas FIFA World Cup 2026",
    description:
      "El mercado más grande de México para estampas del Mundial. Encuentra tarjetas raras y completa tu colección.",
    url: "https://worldcuptrading.zeqhora.com/marketplace",
    type: "website",
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
