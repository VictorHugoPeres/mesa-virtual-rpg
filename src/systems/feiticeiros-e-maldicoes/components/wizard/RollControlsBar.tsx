"use client";

import { useState } from "react";
import { Dices, PenLine } from "lucide-react";
import { PhysicalDiceInput } from "./PhysicalDiceInput";

interface RollControlsBarProps {
  rolledPool: number[];
  onRollAll: () => void;
  onApplySuggested: () => void;
  onApplyPool: (pool: number[]) => void;
}

export function RollControlsBar({
  rolledPool,
  onRollAll,
  onApplySuggested,
  onApplyPool,
}: RollControlsBarProps) {
  const [subMode, setSubMode] = useState<"app" | "physical">("app");

  return (
    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/50 space-y-2.5 text-xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Toggle Sub-modo */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg-secondary)] border border-purple-800/30">
          <button
            type="button"
            onClick={() => setSubMode("app")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              subMode === "app" ? "bg-purple-600 text-white shadow-xs" : "text-purple-300 hover:text-white"
            }`}
          >
            <Dices className="w-3.5 h-3.5" /> Rolar no App
          </button>
          <button
            type="button"
            onClick={() => setSubMode("physical")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              subMode === "physical" ? "bg-purple-600 text-white shadow-xs" : "text-purple-300 hover:text-white"
            }`}
          >
            <PenLine className="w-3.5 h-3.5" /> Dados Físicos da Mesa
          </button>
        </div>

        {subMode === "app" && (
          <div className="flex gap-2">
            {rolledPool.length > 0 && (
              <button
                type="button"
                onClick={onApplySuggested}
                className="px-2 py-1 rounded bg-purple-800 hover:bg-purple-700 text-white text-[11px] font-semibold cursor-pointer"
              >
                Auto-Distribuir
              </button>
            )}
            <button
              type="button"
              onClick={onRollAll}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" /> {rolledPool.length > 0 ? "Rolar Novamente" : "Rolar 4d6"}
            </button>
          </div>
        )}
      </div>

      {subMode === "physical" ? (
        <PhysicalDiceInput currentPool={rolledPool} onApplyPool={onApplyPool} />
      ) : rolledPool.length > 0 ? (
        <div className="flex items-center gap-2 pt-1 border-t border-purple-900/40">
          <span className="text-[11px] text-purple-300">Valores obtidos:</span>
          <div className="flex gap-1.5 flex-wrap">
            {rolledPool.map((v, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-700/50 text-white font-mono font-bold text-xs">
                {v}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
