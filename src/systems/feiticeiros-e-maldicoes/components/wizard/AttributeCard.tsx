"use client";

import { AttributeKey, ATTRIBUTE_LABELS, ATTRIBUTE_KEYS, getModifier } from "@/systems/feiticeiros-e-maldicoes";
import { AttributeMethod } from "./wizardTypes";

interface AttributeCardProps {
  attrKey: AttributeKey;
  tooltip: string;
  baseVal: number;
  finalVal: number;
  method: AttributeMethod;
  currentPool: number[];
  assignedSlot: number | null;
  slotAssignments: Record<AttributeKey, number | null>;
  onSelectSlot: (slotIndex: number) => void;
  onPointBuyChange: (val: number) => void;
  remainingPoints: number;
}

const POINT_COSTS: Record<number, number> = {
  8: -2, 9: -1, 10: 0, 11: 2, 12: 3, 13: 4, 14: 5, 15: 7,
};

export function AttributeCard({
  attrKey,
  tooltip,
  baseVal,
  finalVal,
  method,
  currentPool,
  assignedSlot,
  slotAssignments,
  onSelectSlot,
  onPointBuyChange,
  remainingPoints,
}: AttributeCardProps) {
  const hasVal = baseVal > 0;
  const mod = hasVal ? getModifier(finalVal) : 0;
  const modStr = hasVal ? (mod >= 0 ? `+${mod}` : `${mod}`) : "-";

  const nextCost = (POINT_COSTS[baseVal + 1] ?? 999) - (POINT_COSTS[baseVal] ?? 0);
  const canIncrease = baseVal < 15 && remainingPoints >= nextCost;

  return (
    <div
      className={`p-3 rounded-xl border flex flex-col justify-between transition-all min-w-0 ${
        !hasVal && (method === "fixed" || method === "roll")
          ? "bg-[#14161A]/50 border-dashed border-amber-600/50"
          : "bg-[#14161A] border-[#23272F]"
      }`}
    >
      <div className="flex items-center justify-between mb-1 min-w-0 gap-1">
        <span className="font-bold text-sm text-zinc-100 truncate">
          {ATTRIBUTE_LABELS[attrKey]}
        </span>
        <span className="text-[11px] font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/50 shrink-0">
          {attrKey}
        </span>
      </div>

      <p className="text-[10px] text-zinc-400 line-clamp-2 mb-2 leading-tight">
        {tooltip}
      </p>

      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#23272F] min-w-0">
        {method === "fixed" || (method === "roll" && currentPool.length > 0) ? (
          <select
            value={assignedSlot !== null ? assignedSlot : -1}
            onChange={(e) => onSelectSlot(Number(e.target.value))}
            className="px-2 py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-200 text-xs font-semibold max-w-[145px] sm:max-w-[175px] truncate cursor-pointer"
          >
            <option value={-1}>Selecione...</option>
            {currentPool.map((v, i) => {
              const usedBy = (ATTRIBUTE_KEYS as readonly AttributeKey[]).find(
                (k) => k !== attrKey && slotAssignments[k] === i
              );
              return (
                <option key={i} value={i}>
                  {v} • Dado #{i + 1} {usedBy ? `(em ${usedBy} - trocar)` : ""}
                </option>
              );
            })}
          </select>
        ) : method === "pointBuy" ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              disabled={baseVal <= 8}
              onClick={() => onPointBuyChange(baseVal - 1)}
              className="w-6 h-6 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-200 text-xs font-bold disabled:opacity-30 hover:bg-[#1A1D24] cursor-pointer"
            >
              -
            </button>
            <span className="font-bold text-xs w-6 text-center text-zinc-100">{baseVal}</span>
            <button
              type="button"
              disabled={!canIncrease}
              onClick={() => onPointBuyChange(baseVal + 1)}
              className="w-6 h-6 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-200 text-xs font-bold disabled:opacity-30 hover:bg-[#1A1D24] cursor-pointer"
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-xs text-zinc-500 italic">Role 4d6 acima</span>
        )}

        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-zinc-100">
            {hasVal ? finalVal : "-"}
          </div>
          <div className={`text-[10px] font-mono font-bold ${mod > 0 ? "text-emerald-400" : mod < 0 ? "text-rose-400" : "text-zinc-500"}`}>
            Mod: {modStr}
          </div>
        </div>
      </div>
    </div>
  );
}
