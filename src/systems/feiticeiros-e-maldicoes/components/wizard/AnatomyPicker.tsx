"use client";

import { Check, ShieldAlert, Dna } from "lucide-react";
import { AnatomyInfo } from "./wizardTypes";

interface AnatomyPickerProps {
  options: AnatomyInfo[];
  selectedTrait?: string;
  onSelectTrait: (traitName: string) => void;
}

export function AnatomyPicker({ options, selectedTrait, onSelectTrait }: AnatomyPickerProps) {
  return (
    <div className="mt-3 p-3.5 rounded-xl bg-[#0B0C0E] border border-amber-900/40 space-y-2.5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Dna className="w-3.5 h-3.5 text-amber-400" />
            Característica de Anatomia (1º Nível)
          </span>
          <span className="text-[11px] text-zinc-400">
            Escolha uma mutação física herdada de sua essência amaldiçoada.
          </span>
        </div>
        {!selectedTrait && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Escolha Necessária
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((opt) => {
          const isChosen = selectedTrait === opt.name || selectedTrait === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onSelectTrait(opt.name)}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                isChosen
                  ? "bg-[#14161A] border-amber-500 ring-1 ring-amber-500/50 shadow-sm"
                  : "bg-[#14161A]/60 border-[#23272F] hover:border-amber-400/50 hover:bg-[#14161A]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-zinc-100">{opt.name}</span>
                {isChosen && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">{opt.effect}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
