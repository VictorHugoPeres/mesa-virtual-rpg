"use client";

import { Plus, Trash2 } from "lucide-react";

export interface AttackItem {
  id: string;
  name: string;
  attackBonus: number;
  damage: string;
}

interface ThreatAttacksFormProps {
  attacks: AttackItem[];
  onAddAttack: () => void;
  onRemoveAttack: (id: string) => void;
  onUpdateAttack: (id: string, field: keyof AttackItem, value: string | number) => void;
}

export function ThreatAttacksForm({
  attacks,
  onAddAttack,
  onRemoveAttack,
  onUpdateAttack,
}: ThreatAttacksFormProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase text-[var(--text-secondary)]">
          Ataques e Ações Clicáveis
        </label>
        <button
          type="button"
          onClick={onAddAttack}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar
        </button>
      </div>

      <div className="space-y-2">
        {attacks.map((att) => (
          <div
            key={att.id}
            className="flex items-center gap-2 bg-[var(--bg-secondary)] p-2 rounded border border-[var(--border-default)]"
          >
            <input
              type="text"
              placeholder="Nome do Ataque"
              value={att.name}
              onChange={(e) => onUpdateAttack(att.id, "name", e.target.value)}
              className="flex-1 bg-transparent text-xs text-[var(--text-primary)] focus:outline-none"
            />
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[var(--text-muted)]">Bônus:</span>
              <input
                type="number"
                value={att.attackBonus}
                onChange={(e) => onUpdateAttack(att.id, "attackBonus", Number(e.target.value))}
                className="w-12 text-center bg-[var(--bg-input)] rounded px-1 py-0.5 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[var(--text-muted)]">Dano:</span>
              <input
                type="text"
                value={att.damage}
                onChange={(e) => onUpdateAttack(att.id, "damage", e.target.value)}
                className="w-16 text-center bg-[var(--bg-input)] rounded px-1 py-0.5 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemoveAttack(att.id)}
              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
