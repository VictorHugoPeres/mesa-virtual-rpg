import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/core/providers/AppProviders";

export const metadata: Metadata = {
  title: "Mesa Virtual RPG — Feiticeiros e Maldições",
  description:
    "Plataforma modular de RPG local-first para mesas presenciais híbridas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
