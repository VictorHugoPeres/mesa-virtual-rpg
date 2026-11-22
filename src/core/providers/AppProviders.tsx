"use client";

import { ReactNode } from "react";
import { DialogProvider } from "../ui";
import { DiceProvider } from "../dice/DiceContext";
import { DiceModal } from "../dice/DiceModal";
import { RollHistoryDrawer } from "../dice/RollHistoryDrawer";
import { CompendiumProvider, useCompendium } from "../compendium/CompendiumContext";
import { QuickCompendiumDrawer } from "../compendium/QuickCompendiumDrawer";

function GlobalDrawers() {
  const { isCompendiumOpen, closeCompendium } = useCompendium();

  return (
    <>
      <DiceModal />
      <RollHistoryDrawer />
      <QuickCompendiumDrawer
        isOpen={isCompendiumOpen}
        onClose={closeCompendium}
      />
    </>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DialogProvider>
      <DiceProvider>
        <CompendiumProvider>
          {children}
          <GlobalDrawers />
        </CompendiumProvider>
      </DiceProvider>
    </DialogProvider>
  );
}
