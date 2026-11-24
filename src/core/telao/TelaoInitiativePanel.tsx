"use client";

import { Swords, User, Skull, ChevronRight, Activity } from "lucide-react";
import { InitiativeDisplayData, HealthStatus } from "../sync/syncTypes";

interface TelaoInitiativePanelProps {
  initiative: InitiativeDisplayData | null;
}

export function TelaoInitiativePanel({ initiative }: TelaoInitiativePanelProps) {
  if (
    !initiative ||
    !initiative.isActive ||
    !initiative.showOnTv ||
    initiative.participants.length === 0
  ) {
    return null;
  }

  function getStatusStyle(status: HealthStatus) {
    switch (status) {
      case "Saudável":
        return {
          bg: "bg-emerald-950/80",
          text: "text-emerald-400",
          border: "border-emerald-600/70",
          barColor: "bg-emerald-500",
        };
      case "Ferido":
        return {
          bg: "bg-amber-950/80",
          text: "text-amber-300",
          border: "border-amber-600/70",
          barColor: "bg-amber-500",
        };
      case "Crítico":
        return {
          bg: "bg-orange-950/80",
          text: "text-orange-400",
          border: "border-orange-600/70",
          barColor: "bg-orange-500",
        };
      case "Gravemente Ferido":
        return {
          bg: "bg-red-950/90",
          text: "text-red-400",
          border: "border-red-600/80",
          barColor: "bg-red-600",
        };
      case "Derrotado":
        return {
          bg: "bg-zinc-900/90",
          text: "text-zinc-500",
          border: "border-zinc-700/60",
          barColor: "bg-zinc-600",
        };
      default:
        return {
          bg: "bg-zinc-900/80",
          text: "text-zinc-300",
          border: "border-zinc-700/60",
          barColor: "bg-zinc-500",
        };
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0B0C0E]/95 backdrop-blur-md border-t border-[#23272F] shadow-2xl transition-all duration-300">
      {/* Barra de Título / Rodada */}
      <div className="px-6 py-2 bg-[#14161A] border-b border-[#23272F] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30">
            <Swords className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase text-white/90">
            Ordem de Combate — Rodada {initiative.round}
          </span>
        </div>

        <div className="text-[11px] font-semibold text-white/60">
          {initiative.participants.length}{" "}
          {initiative.participants.length === 1 ? "Combatente" : "Combatentes"}
        </div>
      </div>

      {/* Trilho de Combatentes */}
      <div className="p-4 flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth">
        {initiative.participants.map((p) => {
          const style = getStatusStyle(p.healthStatus);
          const isPC = p.type === "PC";
          const isActing = p.isCurrentTurn;

          return (
            <div
              key={p.id}
              className={`min-w-[190px] max-w-[230px] p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 shrink-0 ${
                isActing
                  ? "bg-[#1A1D24] border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/50 scale-[1.02]"
                  : p.healthStatus === "Derrotado"
                  ? "bg-[#0B0C0E]/60 border-[#23272F] opacity-40"
                  : "bg-[#14161A] border-[#23272F] hover:border-white/20"
              }`}
            >
              {/* Topo do Card */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                      isPC
                        ? "bg-blue-950/40 text-blue-300 border-blue-700/40"
                        : "bg-rose-950/40 text-rose-300 border-rose-700/40"
                    }`}
                  >
                    {isPC ? (
                      <span className="flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> Jogador
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Skull className="w-2.5 h-2.5" /> Ameaça
                      </span>
                    )}
                  </span>

                  <span className="text-[11px] font-mono font-bold text-white/50">
                    INI {p.initiative}
                  </span>
                </div>

                {/* Nome */}
                <h4
                  className={`text-sm font-bold truncate ${
                    isActing ? "text-emerald-300 font-black" : "text-white"
                  } ${p.healthStatus === "Derrotado" ? "line-through text-zinc-500" : ""}`}
                >
                  {p.name}
                </h4>

                {/* Badge de Turno Ativo */}
                {isActing && (
                  <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase shadow-xs animate-pulse">
                    <ChevronRight className="w-3 h-3" /> Turno Atual
                  </div>
                )}
              </div>

              {/* Status de Saúde & Condições */}
              <div className="mt-3 space-y-1.5">
                {/* Status Visual (Sem spoiler para Ameaças) */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
                  >
                    {p.healthStatus}
                  </span>

                  {/* Barra de HP somente para PCs se disponível */}
                  {isPC && p.hpPercent !== undefined && (
                    <span className="text-[10px] font-mono text-white/60">
                      {p.hpPercent}%
                    </span>
                  )}
                </div>

                {/* Barra gráfica de HP para PC */}
                {isPC && p.hpPercent !== undefined && (
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${style.barColor}`}
                      style={{ width: `${Math.min(100, Math.max(0, p.hpPercent))}%` }}
                    />
                  </div>
                )}

                {/* Condições Ativas */}
                {p.conditions && p.conditions.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.conditions.map((c) => (
                      <span
                        key={c}
                        className="text-[9px] px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
