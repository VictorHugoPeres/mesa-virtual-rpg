"use client";

import { Check, ShieldAlert } from "lucide-react";
import { ClanInfo } from "./wizardTypes";

interface ClanPickerProps {
  clans: ClanInfo[];
  selectedClan?: string;
  onSelectClan: (clanId: string) => void;
}

export function ClanPicker({ clans, selectedClan, onSelectClan }: ClanPickerProps) {
  return (
    <div className="mt-3 p-3.5 rounded-xl bg-[#0B0C0E] border border-indigo-900/40 space-y-2.5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
            Escolha Obrigatória de Clã (Linhagem Ilustre)
          </span>
          <span className="text-[11px] text-zinc-400">
            Selecione a qual dos 4 Grandes Clãs do Jujutsu seu personagem pertence.
          </span>
        </div>
        {!selectedClan && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Escolha Necessária
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {clans.map((clan) => {
          const isChosen = selectedClan === clan.name || selectedClan === clan.id;
          return (
            <div
              key={clan.id}
              onClick={() => onSelectClan(clan.name)}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                isChosen
                  ? "bg-[#14161A] border-indigo-500 ring-1 ring-indigo-500/50 shadow-sm"
                  : "bg-[#14161A]/60 border-[#23272F] hover:border-indigo-400/50 hover:bg-[#14161A]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-zinc-100">{clan.name}</span>
                {isChosen && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400">
                    <Check className="w-3 h-3" /> Selecionado
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-indigo-300 block mb-1">{clan.trait}</span>
              <p className="text-[11px] text-zinc-400 leading-snug">{clan.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
