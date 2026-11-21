"use client";

import { AttributeKey, ATTRIBUTE_LABELS, getModifier } from "@/systems/feiticeiros-e-maldicoes";
import { AttributeMethod } from "./wizardTypes";

interface AttributeCardProps {
  attrKey: AttributeKey;
  tooltip: string;
  baseVal: number;
  finalVal: number;
  method: AttributeMethod;
  currentPool: number[];
  otherAttributes: Record<AttributeKey, number>;
  onSelectFixedOrRolled: (val: number) => void;
  onPointBuyChange: (val: number) => void;
  remainingPoints: number;
}

export function AttributeCard({
  attrKey,
  tooltip,
  baseVal,
  finalVal,
  method,
  currentPool,
  otherAttributes,
  onSelectFixedOrRolled,
  onPointBuyChange,
  remainingPoints,
}: AttributeCardProps) {
  const hasVal = baseVal > 0;
  const mod = hasVal ? getModifier(finalVal) : 0;
  const modStr = hasVal ? (mod >= 0 ? `+${mod}` : `${mod}`) : "-";

  return (
    <div
      className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
        !hasVal && (method === "fixed" || method === "roll")
          ? "bg-[var(--bg-secondary)]/50 border-dashed border-amber-600/50"
          : "bg-[var(--bg-secondary)] border-[var(--border-default)]"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-sm text-[var(--text-primary)]">{ATTRIBUTE_LABELS[attrKey]}</span>
        <span className="text-[11px] font-bold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/50">
          {attrKey}
        </span>
      </div>

      <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 mb-2 leading-tight">
        {tooltip}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-default)]">
        {method === "fixed" || (method === "roll" && currentPool.length > 0) ? (
          <select
            value={baseVal}
            onChange={(e) => onSelectFixedOrRolled(Number(e.target.value))}
            className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-xs font-semibold"
          >
            <option value={0}>Selecione...</option>
            {currentPool.map((v, i) => {
              const usedBy = (Object.keys(otherAttributes) as AttributeKey[]).find(
                (k) => k !== attrKey && otherAttributes[k] === v
              );
              return (
                <option key={`${v}-${i}`} value={v}>
                  {v} {usedBy ? `(em ${usedBy} - trocar)` : ""}
                </option>
              );
            })}
          </select>
        ) : method === "pointBuy" ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={baseVal <= 8}
              onClick={() => onPointBuyChange(baseVal - 1)}
              className="w-6 h-6 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              -
            </button>
            <span className="font-bold text-xs w-6 text-center">{baseVal}</span>
            <button
              type="button"
              disabled={baseVal >= 15 || remainingPoints <= 0}
              onClick={() => onPointBuyChange(baseVal + 1)}
              className="w-6 h-6 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-xs text-[var(--text-muted)] italic">Role 4d6 acima</span>
        )}

        <div className="text-right">
          <span className="text-xs font-bold text-[var(--text-primary)] block">
            {hasVal ? `Total: ${finalVal}` : "Pendente"}
          </span>
          <span className={`text-[11px] font-bold ${hasVal ? "text-emerald-400" : "text-[var(--text-muted)]"}`}>
            Mod: {modStr}
          </span>
        </div>
      </div>
    </div>
  );
}
