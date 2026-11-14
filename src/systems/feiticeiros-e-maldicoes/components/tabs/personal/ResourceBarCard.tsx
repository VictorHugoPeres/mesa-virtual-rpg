"use client";

import { Plus, Minus } from "lucide-react";

interface ResourceBarCardProps {
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  barColor: string;
  hoverBg: string;
  current: number;
  max: number;
  temp: number;
  headerAction?: React.ReactNode;
  onUpdateCurrent: (delta: number) => void;
  onChangeCurrent: (val: number) => void;
  onChangeMax: (val: number) => void;
  onChangeTemp: (val: number) => void;
  tempLabel?: string;
}

export function ResourceBarCard({
  label,
  icon,
  colorClass,
  barColor,
  hoverBg,
  current,
  max,
  temp,
  headerAction,
  onUpdateCurrent,
  onChangeCurrent,
  onChangeMax,
  onChangeTemp,
  tempLabel = "Temporários:",
}: ResourceBarCardProps) {
  const percentage = Math.min(100, Math.max(0, (current / (max || 1)) * 100));

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex items-center justify-between mb-2">
        <span className={`flex items-center gap-1.5 text-sm font-semibold ${colorClass}`}>
          {icon} {label}
        </span>
        {headerAction}
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={() => onUpdateCurrent(-1)}
          className={`p-1.5 rounded bg-[var(--bg-secondary)] ${hoverBg} border border-[var(--border-default)] ${colorClass} cursor-pointer`}
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex items-baseline gap-1 text-center">
          <input
            type="number"
            value={current}
            onChange={(e) => onChangeCurrent(parseInt(e.target.value) || 0)}
            className="w-16 text-center text-2xl font-bold rounded bg-transparent text-[var(--text-primary)]"
          />
          <span className="text-[var(--text-muted)] text-base font-semibold">/</span>
          <input
            type="number"
            value={max}
            onChange={(e) => onChangeMax(parseInt(e.target.value) || 0)}
            className="w-14 text-center text-sm font-semibold rounded bg-transparent text-[var(--text-secondary)]"
          />
        </div>

        <button
          type="button"
          onClick={() => onUpdateCurrent(1)}
          className={`p-1.5 rounded bg-[var(--bg-secondary)] ${hoverBg} border border-[var(--border-default)] ${colorClass} cursor-pointer`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden mb-2">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>{tempLabel}</span>
        <input
          type="number"
          value={temp}
          onChange={(e) => onChangeTemp(parseInt(e.target.value) || 0)}
          className="w-12 text-right px-1 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        />
      </div>
    </div>
  );
}
