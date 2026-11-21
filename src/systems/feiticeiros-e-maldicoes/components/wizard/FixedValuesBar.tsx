"use client";

import { AttributeKey, Specialization, SPEC_TABLE } from "@/systems/feiticeiros-e-maldicoes";
import { RotateCcw, Wand2 } from "lucide-react";

interface FixedValuesBarProps {
  specialization: Specialization;
  baseAttributes: Record<AttributeKey, number>;
  onAssignValue: (key: AttributeKey, val: number) => void;
  onReset: () => void;
  onApplySuggested: () => void;
}

const FIXED_POOL = [15, 14, 13, 12, 10, 8];

export function FixedValuesBar({
  specialization,
  baseAttributes,
  onReset,
  onApplySuggested,
}: FixedValuesBarProps) {
  // Encontra quais valores já foram usados e em qual atributo
  const usedMap = new Map<number, AttributeKey>();
  (Object.entries(baseAttributes) as [AttributeKey, number][]).forEach(([attr, val]) => {
    if (val > 0) {
      usedMap.set(val, attr);
    }
  });

  const remainingCount = FIXED_POOL.filter((v) => !usedMap.has(v)).length;

  return (
    <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/50 space-y-2 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-200">Valores Fixos do Livro:</span>
          <span className="text-[11px] text-[var(--text-muted)]">
            {remainingCount === 0
              ? "✓ Todos os 6 valores distribuídos!"
              : `${remainingCount} valor(es) restante(s) para alocar`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onApplySuggested}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] cursor-pointer"
          >
            <Wand2 className="w-3 h-3" /> Sugestão ({specialization})
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] text-[11px] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Limpar
          </button>
        </div>
      </div>

      {/* Pílulas de valores */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {FIXED_POOL.map((val) => {
          const usedAttr = usedMap.get(val);
          const isUsed = !!usedAttr;

          return (
            <div
              key={val}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isUsed
                  ? "bg-[var(--bg-secondary)]/80 border-[var(--border-default)] text-[var(--text-muted)] opacity-60 line-through"
                  : "bg-blue-600/30 border-blue-500/60 text-blue-200 shadow-xs"
              }`}
            >
              <span>{val}</span>
              {isUsed && (
                <span className="text-[10px] font-normal no-underline text-blue-300">
                  ({usedAttr})
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
