"use client";

import { SpellDef, FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { Sparkles, Dices, Trash2 } from "lucide-react";

interface SpellRowItemProps {
  spell: SpellDef;
  index: number;
  isRestringido?: boolean;
  onCast: (spell: SpellDef) => void;
  onRollDice?: (label: string, diceFormula: string) => void;
  onUpdate: (index: number, updater: (prev: SpellDef) => SpellDef) => void;
  onRemove: (index: number) => void;
}

export function SpellRowItem({
  spell,
  index,
  isRestringido,
  onCast,
  onRollDice,
  onUpdate,
  onRemove,
}: SpellRowItemProps) {
  const diceMatch = spell.effect?.match(/(\d*d\d+(?:\s*[+-]\s*\d+)?)/i);

  return (
    <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
            Nome do Feitiço
          </label>
          <input
            type="text"
            value={spell.name}
            onChange={(e) => onUpdate(index, (s) => ({ ...s, name: e.target.value }))}
            className="w-full px-2.5 py-1 text-sm font-semibold rounded bg-[var(--bg-card)] border border-[var(--border-default)]"
          />
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
            Círculo / Nível
          </label>
          <select
            value={spell.level}
            onChange={(e) => onUpdate(index, (s) => ({ ...s, level: parseInt(e.target.value) || 0 }))}
            className="w-full px-2 py-1 text-xs rounded bg-[var(--bg-card)] border border-[var(--border-default)]"
          >
            {[0, 1, 2, 3, 4, 5].map((lvl) => (
              <option key={lvl} value={lvl}>
                Nível {lvl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
            {isRestringido ? "Custo (EST)" : "Custo (PE)"}
          </label>
          <input
            type="number"
            min={0}
            value={spell.peCost}
            onChange={(e) => onUpdate(index, (s) => ({ ...s, peCost: parseInt(e.target.value) || 0 }))}
            className={`w-full text-center px-2 py-1 text-xs font-bold rounded bg-[var(--bg-card)] border border-[var(--border-default)] ${
              isRestringido ? "text-amber-400" : "text-blue-400"
            }`}
          />
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
            Execução
          </label>
          <input
            type="text"
            placeholder="Ação Comum..."
            value={spell.action}
            onChange={(e) => onUpdate(index, (s) => ({ ...s, action: e.target.value }))}
            className="w-full px-2 py-1 text-xs rounded bg-[var(--bg-card)] border border-[var(--border-default)]"
          />
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex-1">
            <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
              Alcance
            </label>
            <input
              type="text"
              placeholder="9m..."
              value={spell.range}
              onChange={(e) => onUpdate(index, (s) => ({ ...s, range: e.target.value }))}
              className="w-full px-2 py-1 text-xs rounded bg-[var(--bg-card)] border border-[var(--border-default)]"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
            title="Excluir Feitiço"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <textarea
          rows={2}
          placeholder="Descrição do efeito, dano, teste de resistência exigido..."
          value={spell.effect}
          onChange={(e) => onUpdate(index, (s) => ({ ...s, effect: e.target.value }))}
          className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-[var(--text-muted)]">
          {spell.duration || "Instantânea"}
        </span>

        <div className="flex items-center gap-2">
          {diceMatch && onRollDice && (
            <button
              type="button"
              onClick={() => onRollDice(`${spell.name} (Efeito/Dano)`, diceMatch[1])}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30 transition-colors cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" /> Rolar ({diceMatch[1]})
            </button>
          )}

          <button
            type="button"
            onClick={() => onCast(spell)}
            className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded text-white shadow-sm transition-colors cursor-pointer ${
              isRestringido ? "bg-amber-600 hover:bg-amber-500" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Usar (-{spell.peCost} {isRestringido ? "EST" : "PE"})
          </button>
        </div>
      </div>
    </div>
  );
}
