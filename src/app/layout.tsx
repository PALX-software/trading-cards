import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL = "https://worldcuptrading.zeqhora.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "World Cup Trading Cards — Mercado y Subastas de Estampas FIFA 2026",
    template: "%s | World Cup Trading Cards",
  },
  description:
    "Compra, vende e intercambia estampas del Mundial FIFA 2026. Álbum Panini digital, subastas en vivo, intercambios entre coleccionistas. La plataforma #1 en México.",
  keywords: [
    "estampas mundial 2026",
    "album panini mundial FIFA 2026",
    "intercambio estampas mundial",
    "subastas tarjetas fútbol",
    "coleccionistas estampas FIFA",
    "mercado estampas world cup",
    "FIFA World Cup 2026 trading cards",
    "FIFA World Cup stickers Mexico",
    "trading card marketplace",
    "football sticker exchange",
    "album figuritas mundial",
    "estampas repetidas mundial",
  ],
  authors: [{ name: "World Cup Trading Cards" }],
  creator: "World Cup Trading Cards",
  publisher: "World Cup Trading Cards",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "World Cup Trading Cards",
    title: "World Cup Trading Cards — Estampas FIFA 2026",
    description:
      "Álbum digital del Mundial FIFA 2026. Intercambia estampas repetidas, entra a subastas en vivo y completa tu colección.",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Cup Trading Cards — Estampas FIFA 2026",
    description:
      "Álbum digital del Mundial FIFA 2026. Intercambia repetidas, sube a subastas y completa tu colección.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "World Cup Trading Cards",
  url: BASE_URL,
  description:
    "Plataforma de compra, venta e intercambio de estampas del Mundial FIFA 2026 en México.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/marketplace?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "World Cup Trading Cards",
    url: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://jwfdqrmjglumnvrkfgag.supabase.co" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
