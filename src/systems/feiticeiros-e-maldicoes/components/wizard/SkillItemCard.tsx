"use client";

import { Check, Star, Lock } from "lucide-react";

interface SkillItemCardProps {
  name: string;
  attribute: string;
  isTrained: boolean;
  isExpert: boolean;
  isLocked?: boolean;
  lockReason?: string;
  isFixed?: boolean;
  canPromoteToExpert?: boolean;
  canToggle?: boolean;
  onToggle: () => void;
  onToggleExpert?: () => void;
}

export function SkillItemCard({
  name,
  attribute,
  isTrained,
  isExpert,
  isLocked,
  lockReason,
  isFixed,
  canPromoteToExpert,
  canToggle = true,
  onToggle,
  onToggleExpert,
}: SkillItemCardProps) {
  return (
    <div
      className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between text-xs min-w-0 ${
        isLocked
          ? "bg-[#0B0C0E]/40 border-[#23272F]/50 opacity-40 cursor-not-allowed"
          : isExpert
          ? "bg-amber-950/40 border-amber-500 text-amber-200 ring-1 ring-amber-500/50"
          : isTrained
          ? "bg-[#14161A] border-rose-600 text-zinc-100 ring-1 ring-rose-600/40 shadow-xs"
          : "bg-[#14161A]/60 border-[#23272F] text-zinc-400 hover:border-zinc-500 hover:bg-[#14161A]"
      }`}
    >
      <div
        className="truncate mr-1 cursor-pointer flex-1"
        onClick={() => {
          if (!isLocked && canToggle) onToggle();
        }}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-semibold truncate">{name}</span>
          {isFixed && (
            <span className="text-[9px] font-bold px-1 rounded bg-zinc-800 text-zinc-400">Fixa</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
          <span>{attribute}</span>
          {isExpert ? (
            <span className="text-amber-400 font-bold">• Mestre (+1.5x BT)</span>
          ) : isTrained ? (
            <span className="text-rose-400 font-bold">• Treinado (+BT)</span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Botão de Mestria (Redundância / Promoção a Mestre) */}
        {isTrained && onToggleExpert && (
          <button
            type="button"
            disabled={!isExpert && !canPromoteToExpert}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpert();
            }}
            title={isExpert ? "Clique para reverter para Treinado" : "Promover a Mestre"}
            className={`p-1 rounded cursor-pointer transition-colors ${
              isExpert
                ? "bg-amber-500 text-black hover:bg-amber-400"
                : canPromoteToExpert
                ? "bg-[#0B0C0E] border border-[#23272F] text-zinc-400 hover:text-amber-400 hover:border-amber-500/50"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
          </button>
        )}

        {/* Indicador de Check / Bloqueio */}
        {isLocked ? (
          <div className="p-1 text-zinc-600" title={lockReason}>
            <Lock className="w-3.5 h-3.5" />
          </div>
        ) : isTrained ? (
          <div
            onClick={() => {
              if (!isFixed && canToggle) onToggle();
            }}
            className="w-4 h-4 rounded bg-rose-600 text-white flex items-center justify-center cursor-pointer"
          >
            <Check className="w-3 h-3" />
          </div>
        ) : (
          <div
            onClick={() => {
              if (canToggle) onToggle();
            }}
            className="w-4 h-4 rounded border border-[#23272F] hover:border-zinc-400 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
