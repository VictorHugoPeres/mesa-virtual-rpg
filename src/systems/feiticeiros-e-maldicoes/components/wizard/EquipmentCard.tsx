"use client";

import { Check, AlertTriangle, AlertCircle, Sparkles } from "lucide-react";

interface EquipmentCardProps {
  id: string;
  name: string;
  categoryBadge?: string;
  cost: number;
  isFree?: boolean;
  highlightStat?: string;
  slots: number;
  properties?: string[];
  description: string;
  isSelected: boolean;
  canSelect: boolean;
  hasProficiency?: boolean;
  warning?: string;
  onToggle: () => void;
}

export function EquipmentCard({
  name,
  categoryBadge,
  cost,
  isFree,
  highlightStat,
  slots,
  properties = [],
  description,
  isSelected,
  canSelect,
  hasProficiency = true,
  warning,
  onToggle,
}: EquipmentCardProps) {
  return (
    <button
      type="button"
      disabled={!canSelect && !isSelected}
      onClick={onToggle}
      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        isSelected
          ? "bg-blue-950/50 border-blue-500 ring-1 ring-blue-500/50 shadow-sm"
          : "bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-blue-400/60"
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="font-bold text-xs text-[var(--text-primary)] block leading-snug">
              {name}
            </span>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {categoryBadge && (
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-800/40">
                  {categoryBadge}
                </span>
              )}
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                  isFree
                    ? "text-emerald-400 bg-emerald-950/60 border-emerald-800/40"
                    : "text-amber-400 bg-amber-950/60 border-amber-800/40"
                }`}
              >
                {isFree ? "Grátis" : `Custo ${cost}`}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                {slots === 0 ? "0 esp" : `${slots} ${slots === 1 ? "espaço" : "espaços"}`}
              </span>
            </div>
          </div>

          {isSelected ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded shrink-0 border border-blue-600/50">
              <Check className="w-3 h-3" /> Selecionado
            </span>
          ) : (
            <div className="w-4 h-4 rounded border border-[var(--border-default)] shrink-0 mt-0.5" />
          )}
        </div>

        <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
          {description}
        </p>

        {warning && (
          <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/30 p-1 rounded border border-amber-800/40">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span className="leading-tight">{warning}</span>
          </div>
        )}

        {!hasProficiency && (
          <div className="flex items-center gap-1 text-[10px] text-rose-400 bg-rose-950/30 p-1 rounded border border-rose-800/40">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span className="leading-tight">Sem proficiência (não soma bônus de treino)</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1 pt-2 mt-2 border-t border-[var(--border-default)] text-[10px] text-[var(--text-muted)] font-medium">
        {highlightStat && (
          <span className="text-[var(--text-primary)] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> {highlightStat}
          </span>
        )}
        {properties.length > 0 && (
          <span className="truncate max-w-full">
            {properties.join(" • ")}
          </span>
        )}
      </div>
    </button>
  );
}
