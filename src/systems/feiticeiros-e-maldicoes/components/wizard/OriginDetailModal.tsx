"use client";

import { X, Check, Award, Sparkles } from "lucide-react";
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
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{origin.name}</h3>
              <p className="text-xs text-[var(--text-muted)]">{origin.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[11px] mb-1.5">
              Conceito & Origem
            </h4>
            <p className="text-[var(--text-secondary)] leading-relaxed">{origin.description}</p>
          </div>

          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/50">
            <span className="font-semibold text-blue-300 block mb-0.5">Bônus de Atributos:</span>
            <p className="text-blue-100/90">{origin.attributeBonusDesc}</p>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[11px] mb-2">
              Habilidades de 1º Nível
            </h4>
            <div className="space-y-2">
              {origin.features.map((feat) => (
                <div
                  key={feat.title}
                  className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)] mb-1">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{feat.title}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/40 text-amber-200">
            <span className="font-semibold block mb-0.5">💡 Para quem é indicada:</span>
            {origin.recommended}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-[var(--border-default)] bg-[var(--bg-secondary)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(origin);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            {isSelected ? "Origem Já Selecionada" : "Selecionar Esta Origem"}
          </button>
        </div>
      </div>
    </div>
  );
}
