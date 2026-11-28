"use client";

import { X, Check, Award, Sparkles, ShieldAlert, Users, Dna } from "lucide-react";
import { Portal } from "@/core/ui";
import { OriginInfo } from "./wizardTypes";

interface OriginDetailModalProps {
  origin: OriginInfo | null;
  onClose: () => void;
  onSelect: (origin: OriginInfo) => void;
  isSelected: boolean;
}

export function OriginDetailModal({
  origin,
  onClose,
  onSelect,
  isSelected,
}: OriginDetailModalProps) {
  if (!origin) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-lg bg-[#14161A] border border-[#23272F] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#23272F] bg-[#0B0C0E]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-100">{origin.name}</h3>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      origin.isOptional
                        ? "bg-purple-950/60 border-purple-800/60 text-purple-300"
                        : "bg-emerald-950/60 border-emerald-800/60 text-emerald-300"
                    }`}
                  >
                    {origin.isOptional ? origin.source || "Suplemento" : "Livro Básico v2.5"}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{origin.tagline}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#1A1D24] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            <div>
              <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] mb-1.5">
                Conceito & Origem
              </h4>
              <p className="text-zinc-300 leading-relaxed">{origin.description}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#0B0C0E] border border-[#23272F]">
              <span className="font-semibold text-rose-400 block mb-0.5">Bônus de Atributos:</span>
              <p className="text-zinc-200">{origin.attributeBonusDesc}</p>
            </div>

            {/* Clãs (se houver) */}
            {origin.clans && origin.clans.length > 0 && (
              <div>
                <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Grandes Clãs Disponíveis
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {origin.clans.map((clan) => (
                    <div key={clan.id} className="p-2.5 rounded-lg bg-[#0B0C0E] border border-[#23272F]">
                      <span className="font-bold text-zinc-100 text-xs block">{clan.name}</span>
                      <span className="text-[10px] text-indigo-300 block mb-1">{clan.trait}</span>
                      <p className="text-[11px] text-zinc-400 leading-tight">{clan.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opções de Anatomia (se houver) */}
            {origin.anatomyOptions && origin.anatomyOptions.length > 0 && (
              <div>
                <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-amber-400" />
                  Características de Anatomia (1º Nível)
                </h4>
                <div className="space-y-1.5">
                  {origin.anatomyOptions.map((opt) => (
                    <div key={opt.id} className="p-2.5 rounded-lg bg-[#0B0C0E] border border-[#23272F]">
                      <span className="font-bold text-zinc-200 text-xs">{opt.name}: </span>
                      <span className="text-[11px] text-zinc-400">{opt.effect}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] mb-2">
                Habilidades de 1º Nível
              </h4>
              <div className="space-y-2">
                {origin.features.map((feat) => (
                  <div key={feat.title} className="p-3 rounded-lg bg-[#0B0C0E] border border-[#23272F]">
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-200 mb-1">
                      <Award className="w-3.5 h-3.5 text-rose-400" />
                      <span>{feat.title}</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-300">
              <span className="font-semibold text-amber-400 block mb-0.5">💡 Para quem é indicada:</span>
              {origin.recommended}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-[#23272F] bg-[#0B0C0E]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#14161A] transition-colors cursor-pointer"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => {
                onSelect(origin);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
            >
              {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
              {isSelected ? "Selecionado" : "Escolher Esta Origem"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
