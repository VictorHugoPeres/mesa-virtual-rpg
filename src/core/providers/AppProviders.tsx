"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { DialogProvider } from "../ui";
import { DiceProvider } from "../dice/DiceContext";
import { CompendiumProvider, useCompendium } from "../compendium/CompendiumContext";

const DiceModal = dynamic(
  () => import("../dice/DiceModal").then((mod) => mod.DiceModal),
  { ssr: false }
);

const RollHistoryDrawer = dynamic(
  () => import("../dice/RollHistoryDrawer").then((mod) => mod.RollHistoryDrawer),
  { ssr: false }
);

const QuickCompendiumDrawer = dynamic(
  () => import("../compendium/QuickCompendiumDrawer").then((mod) => mod.QuickCompendiumDrawer),
  { ssr: false }
);

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
