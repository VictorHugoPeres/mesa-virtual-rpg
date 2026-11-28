"use client";

import { AttributeKey, ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from "@/systems/feiticeiros-e-maldicoes";

interface FreePointsDistributorProps {
  totalPoints: number;
  maxPerAttribute?: number;
  allowedAttributes?: AttributeKey[];
  bonuses: Partial<Record<AttributeKey, number>>;
  onChangeBonuses: (bonuses: Partial<Record<AttributeKey, number>>) => void;
}

export function FreePointsDistributor({
  totalPoints,
  maxPerAttribute = 3,
  allowedAttributes = ATTRIBUTE_KEYS as unknown as AttributeKey[],
  bonuses,
  onChangeBonuses,
}: FreePointsDistributorProps) {
  const currentSpent = allowedAttributes.reduce((acc, k) => acc + (bonuses[k] || 0), 0);
  const remaining = totalPoints - currentSpent;

  function handleAdjust(key: AttributeKey, delta: number) {
    const curVal = bonuses[key] || 0;
    const newVal = curVal + delta;
    if (newVal < 0 || newVal > maxPerAttribute) return;
    if (delta > 0 && remaining < delta) return;

    onChangeBonuses({
      ...bonuses,
      [key]: newVal,
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">Distribua {totalPoints} pontos (máx +{maxPerAttribute} por atributo):</span>
        <span className={`font-mono font-bold ${remaining === 0 ? "text-emerald-400" : "text-amber-400"}`}>
          {remaining} restante{remaining !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {allowedAttributes.map((key) => {
          const val = bonuses[key] || 0;
          return (
            <div
              key={key}
              className="p-2 rounded-lg bg-[#0B0C0E] border border-[#23272F] flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-xs text-zinc-200 block">{key}</span>
                <span className="text-[10px] text-zinc-500 font-mono">{ATTRIBUTE_LABELS[key]}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={val <= 0}
                  onClick={() => handleAdjust(key, -1)}
                  className="w-5 h-5 rounded bg-[#14161A] border border-[#23272F] text-zinc-300 text-xs font-bold disabled:opacity-30 hover:bg-[#1A1D24] cursor-pointer"
                >
                  -
                </button>
                <span className="w-4 text-center font-bold text-xs text-rose-400">+{val}</span>
                <button
                  type="button"
                  disabled={val >= maxPerAttribute || remaining <= 0}
                  onClick={() => handleAdjust(key, 1)}
                  className="w-5 h-5 rounded bg-[#14161A] border border-[#23272F] text-zinc-300 text-xs font-bold disabled:opacity-30 hover:bg-[#1A1D24] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
