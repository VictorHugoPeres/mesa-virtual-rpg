"use client";

import { useEffect, useState } from "react";
import { DiceRollEventData } from "../sync/syncTypes";
import { Dices, Dice5, Sparkles, AlertTriangle } from "lucide-react";

interface TelaoDiceBannerProps {
  roll: DiceRollEventData | null;
  onDismiss: () => void;
}

export function TelaoDiceBanner({ roll, onDismiss }: TelaoDiceBannerProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!roll) return;

    setProgress(100);
    const duration = 7000; // 7 segundos de exibição na TV
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    // Atualiza apenas a barra visual de progresso
    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - step));
    }, intervalTime);

    // Disparo seguro de encerramento fora de qualquer updater do React
    const dismissTimer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(dismissTimer);
    };
  }, [roll, onDismiss]);

  if (!roll) return null;

  return (
    <aside
      aria-label="Notificação de Rolagem no Telão"
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in slide-in-from-top-6 duration-300"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl p-5 text-center transition-all ${
          roll.isCritical
            ? "bg-amber-950/90 border-amber-400 shadow-amber-500/20"
            : roll.isFumble
            ? "bg-rose-950/90 border-rose-500 shadow-rose-500/20"
            : "bg-[#14161A]/95 border-[#23272F] text-white shadow-2xl"
        }`}
      >
        {/* Header do Banner: Nome e Tipo de Dado */}
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-zinc-300 uppercase tracking-widest text-[11px]">
            {roll.roller}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold flex items-center gap-1 ${
              roll.mode === "DIGITAL"
                ? "bg-[#0B0C0E] text-sky-300 border border-[#23272F]"
                : "bg-[#0B0C0E] text-emerald-300 border border-[#23272F]"
            }`}
          >
            {roll.mode === "DIGITAL" ? (
              <Dices className="w-3 h-3" />
            ) : (
              <Dice5 className="w-3 h-3" />
            )}
            {roll.mode === "DIGITAL" ? "Rolagem Digital" : "Dado Físico"}
          </span>
        </div>

        {/* Rótulo da Rolagem (se houver) */}
        {roll.label && (
          <p className="text-sm font-bold text-white/90 mb-1 flex items-center justify-center gap-1.5">
            {roll.label}
          </p>
        )}

        {/* Número Total / Destaque Gigante */}
        <div className="my-2 flex items-baseline justify-center gap-2">
          <span
            className={`text-6xl font-black font-mono tracking-tight drop-shadow-md ${
              roll.isCritical
                ? "text-amber-400 animate-bounce"
                : roll.isFumble
                ? "text-red-500"
                : "text-white"
            }`}
          >
            {roll.total}
          </span>
        </div>

        {/* Indicador de Crítico ou Desastre */}
        {roll.isCritical && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400 text-xs font-bold mb-2 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            SUCESSO CRÍTICO / VANTAGEM!
          </div>
        )}
        {roll.isFumble && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500 text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            FALHA CRÍTICA / DESASTRE!
          </div>
        )}

        {/* Breakdown da Rolagem: Dados brutos + Modificador */}
        <div className="text-xs text-zinc-400 font-mono mt-1 flex items-center justify-center gap-2">
          <span>Fórmula: {roll.formula}</span>
          <span>•</span>
          <span>Dados: {roll.rawRoll}</span>
          {roll.modifier !== 0 && (
            <>
              <span>•</span>
              <span>Mod: {roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier}</span>
            </>
          )}
        </div>

        {/* Feedback de Acerto / Erro vs Defesa do Alvo */}
        {roll.targetName && roll.isHit !== undefined && (
          <div
            className={`mt-2 py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
              roll.isCritical
                ? "bg-amber-950/80 border-amber-400 text-amber-300"
                : roll.isHit
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                : "bg-red-950/80 border-red-500 text-red-300"
            }`}
          >
            {roll.isCritical
              ? `🎯 CRÍTICO! Acertou ${roll.targetName}`
              : roll.isHit
              ? `🎯 ACERTOU! ${roll.targetName}`
              : `❌ ERROU! ${roll.targetName}`}
            {roll.targetDefense !== undefined ? ` (${roll.total} vs Def ${roll.targetDefense})` : ""}
          </div>
        )}

        {/* Feedback de Dano Aplicado no Alvo */}
        {roll.targetName && roll.appliedDamage !== undefined && (
          <div className="mt-2 py-1.5 px-3 rounded-xl bg-rose-950/80 border border-rose-500/80 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 animate-pulse">
            💥 {roll.appliedDamage} de Dano Aplicado em {roll.targetName}!
          </div>
        )}

        {/* Barra de Progresso do Tempo Restante */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className={`h-full transition-all ease-linear ${
              roll.isCritical
                ? "bg-amber-400"
                : roll.isFumble
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
