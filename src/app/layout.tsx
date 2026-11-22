import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/core/providers/AppProviders";

export const metadata: Metadata = {
  title: "D20 — Mesa Digital de RPG",
  description:
    "Plataforma modular e minimalista de RPG local-first para mesas presenciais híbridas.",
  icons: {
    icon: "/icon.svg",
  },
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
