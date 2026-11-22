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
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{spec.name}</h3>
              <p className="text-xs text-[var(--text-muted)]">{spec.tagline}</p>
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
              Estilo de Jogo & Função
            </h4>
            <p className="text-[var(--text-secondary)] leading-relaxed">{spec.description}</p>
          </div>

          {/* Grid de Estatísticas Base */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Pontos de Vida (PV)</span>
                <span className="font-bold text-[var(--text-primary)]">{spec.hpBase} + CON (Dado: {spec.hitDie})</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Pontos de Energia (PE)</span>
                <span className="font-bold text-[var(--text-primary)]">{spec.peDesc}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Testes de Resistência</span>
                <span className="font-bold text-[var(--text-primary)]">{spec.savingThrows}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Atributos-Chave</span>
                <span className="font-bold text-[var(--text-primary)]">{spec.keyAttributes.join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 text-blue-200">
            <span className="font-semibold block mb-0.5">🎯 Treinamentos Concedidos:</span>
            {spec.skillsDesc}
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[11px] mb-2">
              Habilidades de 1º Nível
            </h4>
            <div className="space-y-2">
              {spec.features.map((feat) => (
                <div
                  key={feat.title}
                  className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                >
                  <span className="font-semibold text-[var(--text-primary)] block mb-1">
                    {feat.title}
                  </span>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
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
              onSelect(spec);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            {isSelected ? "Especialização Selecionada" : "Selecionar Esta Especialização"}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
