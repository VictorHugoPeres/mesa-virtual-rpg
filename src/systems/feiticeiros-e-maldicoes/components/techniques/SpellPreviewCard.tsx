"use client";

import { Dices } from "lucide-react";

interface SpellPreviewCardProps {
  name: string;
  level: number;
  costPE: number;
  calculatedFormula: string;
  action: string;
  range: string;
  duration: string;
  currentSpellCount?: number;
  maxSpells?: number;
  characterLevel?: number;
}

export function SpellPreviewCard({
  name,
  level,
  costPE,
  calculatedFormula,
  action,
  range,
  duration,
  currentSpellCount = 0,
  maxSpells = 2,
  characterLevel = 1,
}: SpellPreviewCardProps) {
  return (
    <div className="space-y-3">
      {/* Contador de Slots */}
      <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">
          Slots de Feitiço do Personagem: <strong className="text-blue-400">{currentSpellCount}</strong> de <strong>{maxSpells}</strong>
        </span>
        <span className="text-blue-300 font-semibold">
          Nível do Personagem: {characterLevel}
        </span>
      </div>

      {/* Live Preview Card */}
      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1.5">
        <span className="font-bold text-purple-300 block flex items-center gap-1.5">
          <Dices className="w-3.5 h-3.5" /> Prévia do Feitiço na Ficha:
        </span>
        <div className="flex items-center gap-2 font-bold text-white">
          <span>{name || "Nome do Feitiço"}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900 text-purple-200">
            Nível {level} ({costPE} PE)
          </span>
          <span className="text-amber-400 font-mono text-xs">{calculatedFormula}</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          {action} • {range} • {duration}
        </p>
      </div>
    </div>
  );
}
