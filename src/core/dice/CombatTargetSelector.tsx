"use client";

import { Crosshair, Shield } from "lucide-react";
import { CombatTarget } from "./useCombatTargets";

interface CombatTargetSelectorProps {
  targets: CombatTarget[];
  selectedTargetId: string | null;
  onSelectTargetId: (id: string | null) => void;
}

export function CombatTargetSelector({
  targets,
  selectedTargetId,
  onSelectTargetId,
}: CombatTargetSelectorProps) {
  if (targets.length === 0) return null;

  return (
    <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[var(--text-secondary)] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <Crosshair className="w-3.5 h-3.5 text-rose-400" />
          Alvo do Ataque / Dano (Opcional)
        </span>
        {selectedTargetId && (
          <button
            type="button"
            onClick={() => onSelectTargetId(null)}
            className="text-[10px] text-[var(--text-muted)] hover:text-white underline cursor-pointer"
          >
            Limpar Alvo
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={selectedTargetId || ""}
          onChange={(e) => onSelectTargetId(e.target.value || null)}
          className="flex-1 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="">Nenhum Alvo (Rolagem Livre)</option>
          {targets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} (Def: {t.defense} | PV: {t.currentHp}/{t.maxHp})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
