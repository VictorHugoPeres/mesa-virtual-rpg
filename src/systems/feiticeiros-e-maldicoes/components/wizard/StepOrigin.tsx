"use client";

import { useState } from "react";
import { Check, Info, Sparkles } from "lucide-react";
import { Origin } from "@/systems/feiticeiros-e-maldicoes";
import { OriginInfo } from "./wizardTypes";
import { WIZARD_ORIGINS } from "./wizardData";
import { OriginDetailModal } from "./OriginDetailModal";

interface StepOriginProps {
  selectedOrigin: Origin;
  onSelectOrigin: (origin: Origin) => void;
}

export function StepOrigin({ selectedOrigin, onSelectOrigin }: StepOriginProps) {
  const [modalOrigin, setModalOrigin] = useState<OriginInfo | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">Passo 1: Escolha sua Origem</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          A Origem define de onde vem o seu poder jujutsu e concede bônus de atributos e habilidades de 1º nível. Clique em um card para ver todos os detalhes ou selecionar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {WIZARD_ORIGINS.map((orig) => {
          const isSelected = selectedOrigin === orig.id;

          return (
            <div
              key={orig.id}
              onClick={() => onSelectOrigin(orig.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? "bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                  : "bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-blue-400/60 hover:bg-[var(--bg-card)]"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-[var(--text-muted)] group-hover:text-blue-400"}`} />
                    <span className="font-bold text-sm text-[var(--text-primary)]">{orig.name}</span>
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-900/50 px-2 py-0.5 rounded-full border border-blue-700/60">
                      <Check className="w-3 h-3" /> Selecionado
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2 leading-relaxed">
                  {orig.tagline}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-default)]/60 text-xs mt-2">
                <span className="text-[11px] text-[var(--text-muted)] font-medium">
                  {orig.attributeBonusDesc}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOrigin(orig);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-950/40 transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  Ver Detalhes
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <OriginDetailModal
        origin={modalOrigin}
        onClose={() => setModalOrigin(null)}
        onSelect={(orig) => onSelectOrigin(orig.id)}
        isSelected={modalOrigin?.id === selectedOrigin}
      />
    </div>
  );
}
