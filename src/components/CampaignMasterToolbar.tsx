"use client";

import { useDice } from "@/core/dice/DiceContext";
import { useCompendium } from "@/core/compendium/CompendiumContext";
import { Dices, History, BookOpen } from "lucide-react";

interface CampaignMasterToolbarProps {
  campaignId: string;
}

export function CampaignMasterToolbar({ campaignId }: CampaignMasterToolbarProps) {
  const { openRoller, openHistory } = useDice();
  const { openCompendium } = useCompendium();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() =>
          openRoller({
            label: "Rolagem do Mestre",
            modifier: 0,
            defaultDice: "1d20",
            roller: "Mestre",
            campaignId,
          })
        }
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30
                   transition-all cursor-pointer shadow-xs"
        title="Abrir rolador livre de dados (Digital / Físico)"
      >
        <Dices className="w-3.5 h-3.5 text-blue-400" />
        Rolar Dado
      </button>

      <button
        type="button"
        onClick={openHistory}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30
                   transition-all cursor-pointer shadow-xs"
        title="Abrir histórico de rolagens"
      >
        <History className="w-3.5 h-3.5 text-purple-400" />
        Histórico
      </button>

      <button
        type="button"
        onClick={openCompendium}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30
                   transition-all cursor-pointer shadow-xs"
        title="Abrir compêndio de regras de Feiticeiros e Maldições"
      >
        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
        Compêndio
      </button>
    </div>
  );
}
