"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CompendiumContextValue {
  isCompendiumOpen: boolean;
  openCompendium: () => void;
  closeCompendium: () => void;
  toggleCompendium: () => void;
}

const CompendiumContext = createContext<CompendiumContextValue | null>(null);

export function CompendiumProvider({ children }: { children: ReactNode }) {
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);

  return (
    <CompendiumContext.Provider
      value={{
        isCompendiumOpen,
        openCompendium: () => setIsCompendiumOpen(true),
        closeCompendium: () => setIsCompendiumOpen(false),
        toggleCompendium: () => setIsCompendiumOpen((prev) => !prev),
      }}
    >
      {children}
    </CompendiumContext.Provider>
  );
}

export function useCompendium() {
  const ctx = useContext(CompendiumContext);
  if (!ctx) {
    throw new Error("useCompendium deve ser usado dentro de um CompendiumProvider");
  }
  return ctx;
}
