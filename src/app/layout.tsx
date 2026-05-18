import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FIFA World Cup Trading Cards | Marketplace & Auctions",
  description: "Buy, sell, and auction FIFA World Cup soccer trading cards. Find rare collectible cards from your favorite World Cup players and teams.",
  keywords: "FIFA World Cup trading cards, FIFA World Cup soccer cards, trading card marketplace, collectible cards, football cards",
  openGraph: {
    title: "FIFA World Cup Trading Cards Marketplace",
    description: "The premier marketplace for FIFA World Cup soccer trading cards",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
