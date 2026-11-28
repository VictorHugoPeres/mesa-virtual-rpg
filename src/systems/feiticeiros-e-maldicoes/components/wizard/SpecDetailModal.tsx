"use client";

import { X, Check, Shield, Flame, Heart, Activity } from "lucide-react";
import { Portal } from "@/core/ui";
import { SpecDetailInfo } from "./wizardTypes";

interface SpecDetailModalProps {
  spec: SpecDetailInfo | null;
  onClose: () => void;
  onSelect: (spec: SpecDetailInfo) => void;
  isSelected: boolean;
}

export function SpecDetailModal({
  spec,
  onClose,
  onSelect,
  isSelected,
}: SpecDetailModalProps) {
  if (!spec) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-lg bg-[#14161A] border border-[#23272F] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#23272F] bg-[#0B0C0E]">
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-rose-500" />
              <div>
                <h3 className="text-base font-bold text-zinc-100">{spec.name}</h3>
                <p className="text-xs text-zinc-400">{spec.tagline}</p>
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
                Estilo de Jogo & Função
              </h4>
              <p className="text-zinc-300 leading-relaxed">{spec.description}</p>
            </div>

            {/* Grid de Estatísticas Base */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg bg-[#0B0C0E] border border-[#23272F] flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Pontos de Vida (PV)</span>
                  <span className="font-bold text-zinc-100">{spec.hpBase} + CON ({spec.hitDie})</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0B0C0E] border border-[#23272F] flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Pontos de Energia (PE)</span>
                  <span className="font-bold text-zinc-100">{spec.peDesc}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0B0C0E] border border-[#23272F] flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Testes de Resistência</span>
                  <span className="font-bold text-zinc-100">{spec.savingThrows}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0B0C0E] border border-[#23272F] flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase block">Atributos-Chave</span>
                  <span className="font-bold text-zinc-100">{spec.keyAttributes.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-300">
              <span className="font-semibold text-rose-400 block mb-0.5">🎯 Treinamentos Concedidos:</span>
              {spec.skillsDesc}
            </div>

            <div>
              <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] mb-2">
                Habilidades de 1º Nível
              </h4>
              <div className="space-y-2">
                {spec.features.map((feat) => (
                  <div key={feat.title} className="p-3 rounded-lg bg-[#0B0C0E] border border-[#23272F]">
                    <span className="font-semibold text-zinc-100 block mb-1">
                      {feat.title}
                    </span>
                    <p className="text-zinc-400 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
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
                onSelect(spec);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isSelected ? "Selecionada" : "Escolher Esta Especialização"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
