"use client";

import { X, Swords } from "lucide-react";
import { Portal } from "@/core/ui";
import { InitiativePanel } from "../initiative/InitiativePanel";

interface CampaignCharItem {
  id: string;
  name: string;
  type: string;
  data: string;
}

interface CombatQuickDrawerProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  characters: CampaignCharItem[];
}

export function CombatQuickDrawer({
  campaignId,
  isOpen,
  onClose,
  characters,
}: CombatQuickDrawerProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-zinc-950 border-l border-white/20 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-white">
        {/* Cabeçalho da Gaveta de Combate */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-zinc-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-300">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Painel Rápido de Combate & Iniciativa
              </h3>
              <p className="text-[11px] text-zinc-400">
                Gerencie turnos, PV/PE e ataques sem fechar o mapa tático
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar gaveta de combate"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          <InitiativePanel campaignId={campaignId} characters={characters} />
        </div>
      </div>
    </div>
    </Portal>
  );
}
