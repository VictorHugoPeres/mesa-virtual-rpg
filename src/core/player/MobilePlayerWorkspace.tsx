"use client";

import { useState } from "react";
import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { MobilePlayerHeader } from "./MobilePlayerHeader";
import { MobileBottomNav, MobileTab } from "./MobileBottomNav";
import { MobileTabFicha } from "./MobileTabFicha";
import { MobileTabDados } from "./MobileTabDados";
import { MobileTabCombate } from "./MobileTabCombate";
import { MobileTabGuia } from "./MobileTabGuia";

interface MobilePlayerWorkspaceProps {
  campaignId: string;
  characterId: string;
  characterName: string;
  initialSheet: FMCharacterData;
}

export function MobilePlayerWorkspace({
  campaignId,
  characterId,
  characterName,
  initialSheet,
}: MobilePlayerWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>("ficha");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col max-w-lg mx-auto relative select-none">
      <MobilePlayerHeader
        campaignId={campaignId}
        characterName={characterName}
        sheet={initialSheet}
      />

      <main className="flex-1 p-4 pb-24">
        {activeTab === "ficha" && (
          <MobileTabFicha
            campaignId={campaignId}
            characterId={characterId}
            characterName={characterName}
            initialSheet={initialSheet}
          />
        )}

        {activeTab === "dados" && (
          <MobileTabDados
            campaignId={campaignId}
            characterId={characterId}
            characterName={characterName}
          />
        )}

        {activeTab === "combate" && (
          <MobileTabCombate
            campaignId={campaignId}
            characterId={characterId}
            characterName={characterName}
          />
        )}

        {activeTab === "guia" && <MobileTabGuia />}
      </main>

      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
