"use client";

import { useState } from "react";
import { Check, Info, Sparkles, BookOpen, Layers } from "lucide-react";
import { Origin } from "@/systems/feiticeiros-e-maldicoes";
import { OriginInfo } from "./wizardTypes";
import { WIZARD_ORIGINS } from "./wizardData";
import { OriginDetailModal } from "./OriginDetailModal";
import { ClanPicker } from "./ClanPicker";
import { AnatomyPicker } from "./AnatomyPicker";

interface StepOriginProps {
  selectedOrigin: Origin;
  onSelectOrigin: (origin: Origin) => void;
  selectedClan?: string;
  onSelectClan?: (clan: string) => void;
  selectedAnatomy?: string;
  onSelectAnatomy?: (trait: string) => void;
}

export function StepOrigin({
  selectedOrigin,
  onSelectOrigin,
  selectedClan,
  onSelectClan,
  selectedAnatomy,
  onSelectAnatomy,
}: StepOriginProps) {
  const [modalOrigin, setModalOrigin] = useState<OriginInfo | null>(null);

  const standardOrigins = WIZARD_ORIGINS.filter((o) => !o.isOptional);
  const optionalOrigins = WIZARD_ORIGINS.filter((o) => o.isOptional);

  const currentOriginData = WIZARD_ORIGINS.find((o) => o.id === selectedOrigin);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-zinc-100">Passo 1: Escolha sua Origem</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          A Origem define de onde surge sua força jujutsu e concede bônus de atributos e habilidades de 1º nível.
        </p>
      </div>

      {/* 1. Origens Padrão v2.5 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-rose-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Origens Oficiais do Livro Básico ({standardOrigins.length})
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {standardOrigins.map((orig) => {
            const isSelected = selectedOrigin === orig.id;

            return (
              <div
                key={orig.id}
                onClick={() => onSelectOrigin(orig.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#14161A] border-rose-600 shadow-md ring-1 ring-rose-600/50"
                    : "bg-[#14161A]/80 border-[#23272F] hover:border-zinc-500 hover:bg-[#14161A]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className={`w-4 h-4 ${isSelected ? "text-rose-400" : "text-zinc-500 group-hover:text-rose-400"}`} />
                      <span className="font-bold text-sm text-zinc-100">{orig.name}</span>
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-700/60">
                        <Check className="w-3 h-3" /> Selecionado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-2 leading-relaxed">{orig.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#23272F] text-xs mt-2">
                  <span className="text-[11px] text-zinc-400 font-medium truncate mr-2">{orig.attributeBonusDesc}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOrigin(orig);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                  >
                    <Info className="w-3.5 h-3.5" /> Detalhes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seletor de Clã se Herdado */}
      {selectedOrigin === "Herdado" && currentOriginData?.clans && onSelectClan && (
        <ClanPicker
          clans={currentOriginData.clans}
          selectedClan={selectedClan}
          onSelectClan={onSelectClan}
        />
      )}

      {/* Seletor de Anatomia se Feto Amaldiçoado Híbrido */}
      {selectedOrigin === "Feto Amaldiçoado Híbrido" && currentOriginData?.anatomyOptions && onSelectAnatomy && (
        <AnatomyPicker
          options={currentOriginData.anatomyOptions}
          selectedTrait={selectedAnatomy}
          onSelectTrait={onSelectAnatomy}
        />
      )}

      {/* 2. Origens Opcionais / Suplementos */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-t border-[#23272F] pt-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Origens Opcionais & Suplementos ({optionalOrigins.length})
            </h4>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Consulte o Mestre</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {optionalOrigins.map((orig) => {
            const isSelected = selectedOrigin === orig.id;

            return (
              <div
                key={orig.id}
                onClick={() => onSelectOrigin(orig.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#14161A] border-purple-500 shadow-md ring-1 ring-purple-500/50"
                    : "bg-[#14161A]/60 border-[#23272F] hover:border-purple-400/50 hover:bg-[#14161A]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span className="font-bold text-xs text-zinc-100">{orig.name}</span>
                    {isSelected && (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/60">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-purple-400 font-mono block mb-1">{orig.source}</span>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 leading-relaxed">{orig.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#23272F] text-xs mt-2">
                  <span className="text-[10px] text-zinc-400 truncate mr-1">{orig.attributeBonusDesc}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOrigin(orig);
                    }}
                    className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 p-0.5 cursor-pointer shrink-0"
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
