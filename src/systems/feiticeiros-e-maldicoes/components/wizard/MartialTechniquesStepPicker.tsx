"use client";

import { useState } from "react";
import { WizardSpell } from "./wizardTypes";
import {
  READY_MARTIAL_TECHNIQUES,
  MartialTechnique,
} from "../../data/martialTechniques";
import { Swords, Lock, Check, Sparkles } from "lucide-react";

interface MartialTechniquesStepPickerProps {
  selectedSpells: WizardSpell[];
  onChangeSpells: (spells: WizardSpell[]) => void;
}

export function MartialTechniquesStepPicker({
  selectedSpells,
  onChangeSpells,
}: MartialTechniquesStepPickerProps) {
  const [activeTab, setActiveTab] = useState<number>(1);

  const level1Techs = READY_MARTIAL_TECHNIQUES.filter((t) => t.level === 1);
  const otherTechs = READY_MARTIAL_TECHNIQUES.filter((t) => t.level === activeTab);

  function isSelected(techName: string) {
    return selectedSpells.some((s) => s.name === techName);
  }

  function toggleTech(tech: MartialTechnique) {
    if (tech.level !== 1) return; // Na criação nível 1 só pode nível 1

    if (isSelected(tech.name)) {
      onChangeSpells(selectedSpells.filter((s) => s.name !== tech.name));
    } else {
      if (selectedSpells.length >= 2) return;
      const newSpell: WizardSpell = {
        name: tech.name,
        level: tech.level,
        cost: tech.staminaCost,
        action: tech.action,
        range: tech.range,
        description: `${tech.description}${tech.prerequisite ? ` (Pré-requisito: ${tech.prerequisite})` : ""}`,
      };
      onChangeSpells([...selectedSpells, newSpell]);
    }
  }

  return (
    <div className="space-y-3">
      {/* Resumo e Contador */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#14161A] border border-[#23272F]">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-zinc-200">
            Arsenal Marcial Inicial do Restringido
          </span>
        </div>
        <span className="text-xs font-semibold text-zinc-300">
          Selecionadas:{" "}
          <strong className="text-amber-400">{selectedSpells.length}</strong> / 2 técnicas
        </span>
      </div>

      {/* Tabs por Nível */}
      <div className="flex items-center gap-1.5 border-b border-[#23272F] pb-2">
        {[1, 2, 3, 4].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setActiveTab(lvl)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === lvl
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-[#14161A] text-zinc-400 hover:text-zinc-200 border border-[#23272F]"
            }`}
          >
            {lvl > 1 && <Lock className="w-3 h-3 text-zinc-500" />}
            Nível {lvl} {lvl === 1 ? "(Inicial)" : lvl === 2 ? "(Nvl 5+)" : lvl === 3 ? "(Nvl 9+)" : "(Nvl 15+)"}
          </button>
        ))}
      </div>

      {/* Lista de Técnicas */}
      <div className="space-y-2 max-h-80 overflow-y-auto overscroll-contain pr-1">
        {(activeTab === 1 ? level1Techs : otherTechs).map((tech) => {
          const selected = isSelected(tech.name);
          const isLocked = tech.level > 1;

          return (
            <div
              key={tech.id}
              onClick={() => !isLocked && toggleTech(tech)}
              className={`p-3 rounded-xl border transition-all ${
                isLocked
                  ? "bg-[#14161A]/40 border-white/5 opacity-60 cursor-not-allowed"
                  : selected
                  ? "bg-amber-950/25 border-amber-500/50 shadow-xs cursor-pointer"
                  : "bg-[#14161A] border-[#23272F] hover:border-amber-400/40 cursor-pointer"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!isLocked ? (
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleTech(tech)}
                      disabled={isLocked || (!selected && selectedSpells.length >= 2)}
                      className="rounded border-[#23272F] text-amber-500 focus:ring-0 cursor-pointer"
                    />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-100">{tech.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0B0C0E] text-zinc-400 border border-[#23272F]">
                        {tech.action} • {tech.category}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                  {tech.staminaCost} EST
                </span>
              </div>

              <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed pl-6">
                {tech.description}
              </p>

              {isLocked && (
                <div className="mt-2 pl-6 text-[10px] text-amber-400/80 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Desbloqueado ao evoluir o personagem para Nível{" "}
                  {tech.level === 2 ? 5 : tech.level === 3 ? 9 : 15}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
