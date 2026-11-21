"use client";

import { useState } from "react";
import { Check, Info, Flame, Heart, Activity } from "lucide-react";
import { Specialization } from "@/systems/feiticeiros-e-maldicoes";
import { SpecDetailInfo } from "./wizardTypes";
import { WIZARD_SPECS } from "./wizardData";
import { SpecDetailModal } from "./SpecDetailModal";

interface StepSpecializationProps {
  selectedSpec: Specialization;
  onSelectSpec: (spec: Specialization) => void;
}

export function StepSpecialization({ selectedSpec, onSelectSpec }: StepSpecializationProps) {
  const [modalSpec, setModalSpec] = useState<SpecDetailInfo | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">Passo 2: Escolha sua Especialização</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          A Especialização funciona como a classe do personagem no RPG, definindo seu estilo em missão, PV, dados de vida e habilidades de combate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {WIZARD_SPECS.map((spec) => {
          const isSelected = selectedSpec === spec.id;

          return (
            <div
              key={spec.id}
              onClick={() => onSelectSpec(spec.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? "bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500/50"
                  : "bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-amber-400/60 hover:bg-[var(--bg-card)]"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Flame className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-[var(--text-muted)] group-hover:text-amber-400"}`} />
                    <span className="font-bold text-sm text-[var(--text-primary)]">{spec.name}</span>
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-900/50 px-2 py-0.5 rounded-full border border-amber-700/60">
                      <Check className="w-3 h-3" /> Selecionado
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2 leading-relaxed">
                  {spec.tagline}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-default)]/60">
                  <span className="flex items-center gap-1 font-semibold text-rose-300">
                    <Heart className="w-3 h-3 text-rose-400" />
                    PV: {spec.hpBase}+CON
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-blue-300">
                    <Activity className="w-3 h-3 text-blue-400" />
                    PE: {spec.peDesc.split("+")[0].trim()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs mt-1">
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Dado de Vida: {spec.hitDie}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalSpec(spec);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 p-1 rounded hover:bg-amber-950/40 transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SpecDetailModal
        spec={modalSpec}
        onClose={() => setModalSpec(null)}
        onSelect={(sp) => onSelectSpec(sp.id)}
        isSelected={modalSpec?.id === selectedSpec}
      />
    </div>
  );
}
