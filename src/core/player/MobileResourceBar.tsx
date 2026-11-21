"use client";

import { ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

interface MobileResourceBarProps {
  label: string;
  current: number;
  max: number;
  temp?: number;
  colorClass: string; // ex: "text-rose-400 bg-rose-950/40 border-rose-800/50"
  barColor: string; // ex: "bg-rose-500"
  icon: ReactNode;
  onChange: (newCurrent: number) => void;
}

export function MobileResourceBar({
  label,
  current,
  max,
  temp = 0,
  colorClass,
  barColor,
  icon,
  onChange,
}: MobileResourceBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, Math.round((current / max) * 100))) : 0;

  return (
    <div className={`p-3 rounded-2xl border ${colorClass} space-y-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xs">
          {icon}
          <span>{label}</span>
          {temp > 0 && (
            <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-1.5 rounded border border-amber-800">
              +{temp} temp
            </span>
          )}
        </div>

        {/* Controles de ajuste rápido */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, current - 5))}
            className="w-7 h-7 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[10px] font-bold text-[var(--text-secondary)] active:scale-95 cursor-pointer touch-manipulation select-none"
            title="-5"
          >
            -5
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.max(0, current - 1))}
            className="w-7 h-7 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs font-bold text-[var(--text-secondary)] active:scale-95 cursor-pointer flex items-center justify-center touch-manipulation select-none"
            title="-1"
          >
            <Minus className="w-3 h-3" />
          </button>

          <span className="font-mono font-black text-sm px-2 min-w-14 text-center select-none">
            {current} <span className="text-[11px] font-normal opacity-70">/ {max}</span>
          </span>

          <button
            type="button"
            onClick={() => onChange(current + 1)}
            className="w-7 h-7 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs font-bold text-[var(--text-secondary)] active:scale-95 cursor-pointer flex items-center justify-center touch-manipulation select-none"
            title="+1"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onChange(current + 5)}
            className="w-7 h-7 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[10px] font-bold text-[var(--text-secondary)] active:scale-95 cursor-pointer touch-manipulation select-none"
            title="+5"
          >
            +5
          </button>
        </div>
      </div>

      {/* Barra de Progresso visual */}
      <div className="w-full h-1.5 bg-[var(--bg-primary)]/60 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300 rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
