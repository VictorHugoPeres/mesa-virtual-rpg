"use client";

import { useState } from "react";
import { Check, Info, Flame, Heart, Activity, Lock } from "lucide-react";
import { Specialization, Origin, AttributeKey } from "@/systems/feiticeiros-e-maldicoes";
import { SpecDetailInfo } from "./wizardTypes";
import { WIZARD_SPECS } from "./wizardData";
import { SpecDetailModal } from "./SpecDetailModal";
import { SpecChoicesSection } from "./SpecChoicesSection";

interface StepSpecializationProps {
  origin: Origin;
  selectedSpec: Specialization;
  onSelectSpec: (spec: Specialization) => void;
  selectedKeyAttribute?: AttributeKey;
  onSelectKeyAttribute?: (attr: AttributeKey) => void;
  selectedLevel1Choice?: string;
  onSelectLevel1Choice?: (choice: string) => void;
}

export function StepSpecialization({
  origin,
  selectedSpec,
  onSelectSpec,
  selectedKeyAttribute,
  onSelectKeyAttribute,
  selectedLevel1Choice,
  onSelectLevel1Choice,
}: StepSpecializationProps) {
  const [modalSpec, setModalSpec] = useState<SpecDetailInfo | null>(null);

  const isOriginRestringido = origin === "Restringido";
  const isOriginSemTecnica = origin === "Sem Técnica";

  const currentSpecData = WIZARD_SPECS.find((s) => s.id === selectedSpec);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-zinc-100">Passo 2: Escolha sua Especialização</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          A Especialização atua como a classe do personagem, definindo PV, dados de vida, estilo de combate e Atributo Chave.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {WIZARD_SPECS.map((spec) => {
          const isSelected = selectedSpec === spec.id;

          // Travas da v2.5
          let isBlocked = false;
          let blockReason = "";

          if (isOriginRestringido && spec.id !== "Restringido") {
            isBlocked = true;
            blockReason = "Trava Celestial: Obrigatório Restringido";
          } else if (!isOriginRestringido && spec.id === "Restringido") {
            isBlocked = true;
            blockReason = "Requer Origem Restringido";
          } else if (isOriginSemTecnica && spec.id === "Especialista em Técnica") {
            isBlocked = true;
            blockReason = "Bloqueado para Origem Sem Técnica";
          }

          return (
            <div
              key={spec.id}
              onClick={() => {
                if (!isBlocked) onSelectSpec(spec.id);
              }}
              className={`p-4 rounded-xl border text-left transition-all relative group flex flex-col justify-between ${
                isBlocked
                  ? "bg-[#0B0C0E]/60 border-[#23272F]/50 opacity-40 cursor-not-allowed"
                  : isSelected
                  ? "bg-[#14161A] border-rose-600 shadow-md ring-1 ring-rose-600/50 cursor-pointer"
                  : "bg-[#14161A]/80 border-[#23272F] hover:border-zinc-500 hover:bg-[#14161A] cursor-pointer"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Flame className={`w-4 h-4 ${isSelected ? "text-rose-400" : "text-zinc-500 group-hover:text-rose-400"}`} />
                    <span className="font-bold text-sm text-zinc-100">{spec.name}</span>
                  </div>
                  {isBlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      <Lock className="w-2.5 h-2.5" /> {blockReason}
                    </span>
                  ) : isSelected ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-700/60">
                      <Check className="w-3 h-3" /> Selecionado
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 mb-2 leading-relaxed">
                  {spec.tagline}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-2 border-t border-[#23272F]">
                  <span className="flex items-center gap-1 font-semibold text-rose-400">
                    <Heart className="w-3 h-3" /> PV: {spec.hpBase}+CON ({spec.hitDie})
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-sky-400">
                    <Activity className="w-3 h-3" /> PE: {spec.peDesc.split("+")[0].trim()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs mt-1">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Chave: {spec.keyAttributes.join(", ")}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalSpec(spec);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" /> Detalhes
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Escolhas de Atributo Chave e Nível 1 */}
      {currentSpecData && onSelectKeyAttribute && onSelectLevel1Choice && (
        <SpecChoicesSection
          specialization={selectedSpec}
          availableKeyAttributes={currentSpecData.keyAttributes}
          selectedKeyAttribute={selectedKeyAttribute || currentSpecData.keyAttributes[0]}
          onSelectKeyAttribute={onSelectKeyAttribute}
          selectedLevel1Choice={selectedLevel1Choice}
          onSelectLevel1Choice={onSelectLevel1Choice}
        />
      )}

      <SpecDetailModal
        spec={modalSpec}
        onClose={() => setModalSpec(null)}
        onSelect={(sp) => onSelectSpec(sp.id)}
        isSelected={modalSpec?.id === selectedSpec}
      />
    </div>
  );
}
