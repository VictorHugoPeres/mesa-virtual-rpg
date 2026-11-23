"use client";

import { ShieldCheck, Coins, AlertTriangle, Sparkles } from "lucide-react";
import { Specialization } from "@/systems/feiticeiros-e-maldicoes";
import { SPECIALIZATION_PROFICIENCIES, STARTING_QUOTA } from "../../data/equipment";

interface EquipmentQuotaSummaryProps {
  specialization: Specialization;
  spentQuota: number;
}

export function EquipmentQuotaSummary({
  specialization,
  spentQuota,
}: EquipmentQuotaSummaryProps) {
  const specRules = SPECIALIZATION_PROFICIENCIES[specialization] || SPECIALIZATION_PROFICIENCIES["Lutador"];
  const maxQuota = STARTING_QUOTA.maxBudget;
  const isOver = spentQuota > maxQuota;
  const isFull = spentQuota === maxQuota;

  return (
    <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--text-primary)] block">
              Cota Inicial de Equipamento
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Cada feiticeiro recebe 2 pontos de custo (2 itens custo 1 ou 1 item custo 2).
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isOver
                ? "bg-rose-950/70 border-rose-600 text-rose-300"
                : isFull
                ? "bg-emerald-950/70 border-emerald-600 text-emerald-300"
                : "bg-blue-950/70 border-blue-600 text-blue-300"
            }`}
          >
            {spentQuota} / {maxQuota} Pontos Utilizados
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span><strong>Itens Inclusos:</strong> 1 Uniforme Comum (Custo 0) + 1 Kit de Ferramentas gratuito.</span>
        </div>

        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span><strong>Treino ({specialization}):</strong> {specRules.summary}</span>
        </div>
      </div>

      {isOver && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Sua seleção excede o limite inicial de {maxQuota} pontos de custo. Remova itens para prosseguir.</span>
        </div>
      )}
    </div>
  );
}
