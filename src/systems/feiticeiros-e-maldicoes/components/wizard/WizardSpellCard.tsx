"use client";

import { WizardSpell } from "./wizardTypes";
import { Trash2 } from "lucide-react";

interface WizardSpellCardProps {
  spell: WizardSpell;
  index: number;
  totalSpells: number;
  isRestringido: boolean;
  onUpdate: (index: number, field: keyof WizardSpell, value: string | number) => void;
  onRemove: (index: number) => void;
}

export function WizardSpellCard({
  spell,
  index,
  totalSpells,
  isRestringido,
  onUpdate,
  onRemove,
}: WizardSpellCardProps) {
  return (
    <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-2">
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={spell.name}
          onChange={(e) => onUpdate(index, "name", e.target.value)}
          placeholder="Nome do Feitiço"
          className="font-bold text-xs px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] flex-1"
        />

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--text-muted)] font-medium">Custo:</span>
          <input
            type="number"
            min={0}
            max={20}
            value={spell.cost}
            onChange={(e) => onUpdate(index, "cost", Number(e.target.value))}
            className="w-12 text-center text-xs px-1 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] font-bold"
          />
          <span className="text-[11px] text-[var(--text-muted)]">{isRestringido ? "Vigor" : "PE"}</span>

          {totalSpells > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
              title="Excluir Feitiço"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <input
          type="text"
          value={spell.action}
          onChange={(e) => onUpdate(index, "action", e.target.value)}
          placeholder="Ação (ex: Ação Comum, Reação)"
          className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[11px]"
        />
        <input
          type="text"
          value={spell.range}
          onChange={(e) => onUpdate(index, "range", e.target.value)}
          placeholder="Alcance (ex: 9m, Toque)"
          className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[11px]"
        />
      </div>

      <textarea
        rows={2}
        value={spell.description}
        onChange={(e) => onUpdate(index, "description", e.target.value)}
        placeholder="Efeito e dano do feitiço..."
        className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
      />
    </div>
  );
}
