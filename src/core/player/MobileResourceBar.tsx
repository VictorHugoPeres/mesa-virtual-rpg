"use client";

import { ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

interface MobileResourceBarProps {
  label: string;
  current: number;
  max: number;
  temp?: number;
  colorClass: string;
  barColor: string;
  icon: ReactNode;
  badge?: ReactNode;
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
  badge,
  onChange,
}: MobileResourceBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, Math.round((current / max) * 100))) : 0;

  return (
    <div className={`p-3 rounded-2xl border ${colorClass} space-y-2`}>
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 font-bold text-xs flex-wrap">
          {icon}
          <span>{label}</span>
          {temp > 0 && (
            <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-1.5 rounded border border-amber-800">
              +{temp} temp
            </span>
          )}
          {badge}
        </div>

        {/* Controles de ajuste rápido */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, current - 5))}
            className="w-7 h-7 rounded-md bg-[#14161A] border border-[#23272F] text-[10px] font-bold text-zinc-300 hover:bg-[#1A1D24] active:scale-95 cursor-pointer"
            title="-5"
          >
            -5
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.max(0, current - 1))}
            className="w-7 h-7 rounded-md bg-[#14161A] border border-[#23272F] text-xs font-bold text-zinc-300 hover:bg-[#1A1D24] active:scale-95 cursor-pointer flex items-center justify-center"
            title="-1"
          >
            <Minus className="w-3 h-3" />
          </button>

          <span className="font-mono font-black text-sm px-1.5 min-w-12 text-center text-zinc-100">
            {current} <span className="text-[11px] font-normal opacity-70 text-zinc-400">/ {max}</span>
          </span>

          <button
            type="button"
            onClick={() => onChange(current + 1)}
            className="w-7 h-7 rounded-md bg-[#14161A] border border-[#23272F] text-xs font-bold text-zinc-300 hover:bg-[#1A1D24] active:scale-95 cursor-pointer flex items-center justify-center"
            title="+1"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onChange(current + 5)}
            className="w-7 h-7 rounded-md bg-[#14161A] border border-[#23272F] text-[10px] font-bold text-zinc-300 hover:bg-[#1A1D24] active:scale-95 cursor-pointer"
            title="+5"
          >
            +5
          </button>
        </div>
      </div>

      {/* Barra de Progresso visual */}
      <div className="w-full h-1.5 bg-[#0B0C0E]/60 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300 rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
