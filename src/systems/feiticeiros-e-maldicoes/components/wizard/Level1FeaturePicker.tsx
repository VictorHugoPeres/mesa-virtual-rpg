"use client";

import { useState } from "react";
import { Origin } from "@/systems/feiticeiros-e-maldicoes";
import { LEVEL_1_TALENTS, LEVEL_1_APTITUDES, Level1Feat, Level1Aptitude } from "../../data/level1Features";
import { Award, Zap, Check } from "lucide-react";

interface Level1FeaturePickerProps {
  origin: Origin;
  selectedFeatId?: string;
  onSelectFeat: (id: string, name: string, type: "talento" | "aptidao", desc: string) => void;
}

export function Level1FeaturePicker({
  origin,
  selectedFeatId,
  onSelectFeat,
}: Level1FeaturePickerProps) {
  const isInato = origin === "Inato";
  const isSemTecnica = origin === "Sem Técnica";
  const isDerivado = origin === "Derivado";
  const isMaldicao = origin === "Maldição";

  const grantsFeature = isInato || isSemTecnica || isDerivado || isMaldicao;
  const [activeTab, setActiveTab] = useState<"talento" | "aptidao">(
    isDerivado || isMaldicao ? "aptidao" : "talento"
  );

  if (!grantsFeature) return null;

  // Filtrar aptidões conforme a origem
  const availableAptitudes = LEVEL_1_APTITUDES.filter((apt) => {
    if (isDerivado) return apt.tree === "Aura";
    if (isMaldicao) return apt.tree !== "Reversa";
    return true;
  });

  return (
    <div className="p-4 rounded-xl bg-[#0B0C0E] border border-rose-950/40 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeTab === "talento" ? (
            <Award className="w-4 h-4 text-rose-500" />
          ) : (
            <Zap className="w-4 h-4 text-sky-400" />
          )}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
              Escolha de 1º Nível da Origem ({origin})
            </h4>
            <span className="text-[11px] text-zinc-400">
              {isInato
                ? "Talento Natural: Escolha 1 talento inicial."
                : isSemTecnica
                ? "Versatilidade Tática: Escolha 1 talento inicial ou 1 aptidão."
                : isDerivado
                ? "Resistência Adaptativa: Escolha 1 aptidão amaldiçoada de Aura."
                : "Natureza Amaldiçoada: Escolha 1 aptidão amaldiçoada."}
            </span>
          </div>
        </div>

        {/* Abas se Sem Técnica */}
        {isSemTecnica && (
          <div className="flex gap-1 p-0.5 rounded-lg bg-[#14161A] border border-[#23272F]">
            <button
              type="button"
              onClick={() => setActiveTab("talento")}
              className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                activeTab === "talento" ? "bg-rose-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Talento
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("aptidao")}
              className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                activeTab === "aptidao" ? "bg-rose-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Aptidão
            </button>
          </div>
        )}
      </div>

      {/* Grid de Talentos */}
      {activeTab === "talento" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LEVEL_1_TALENTS.map((t: Level1Feat) => {
            const isChosen = selectedFeatId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => onSelectFeat(t.id, t.name, "talento", t.benefit)}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  isChosen
                    ? "bg-[#14161A] border-rose-600 ring-1 ring-rose-600/50"
                    : "bg-[#14161A]/60 border-[#23272F] hover:border-zinc-500 hover:bg-[#14161A]"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-xs text-zinc-100">{t.name}</span>
                  {isChosen && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                {t.prerequisite && (
                  <span className="text-[10px] text-amber-400 font-mono block mb-1">
                    Req: {t.prerequisite}
                  </span>
                )}
                <p className="text-[11px] text-zinc-400 leading-snug">{t.benefit}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Grid de Aptidões */}
      {activeTab === "aptidao" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableAptitudes.map((apt: Level1Aptitude) => {
            const isChosen = selectedFeatId === apt.id;
            return (
              <div
                key={apt.id}
                onClick={() => onSelectFeat(apt.id, apt.name, "aptidao", apt.description)}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  isChosen
                    ? "bg-[#14161A] border-sky-500 ring-1 ring-sky-500/50"
                    : "bg-[#14161A]/60 border-[#23272F] hover:border-zinc-500 hover:bg-[#14161A]"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-xs text-zinc-100">{apt.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono text-sky-400 bg-sky-950/60 px-1 rounded">
                      {apt.costPE} PE
                    </span>
                    {isChosen && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono block mb-1">
                  Árvore: {apt.tree}
                </span>
                <p className="text-[11px] text-zinc-400 leading-snug">{apt.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
