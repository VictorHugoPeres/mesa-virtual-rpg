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

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
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
            ? "bg-red-950/90 border-red-500 shadow-red-500/20"
            : "bg-[#0f1017]/95 border-blue-500/40 shadow-blue-500/10"
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
                ? "bg-blue-900/60 text-blue-300 border border-blue-700/60"
                : "bg-emerald-900/60 text-emerald-300 border border-emerald-700/60"
            }`}
          >
            {roll.mode === "DIGITAL" ? (
              <>
                <Dices className="w-3 h-3" /> Dado Digital
              </>
            ) : (
              <>
                <Dice5 className="w-3 h-3" /> Dado Físico Real
              </>
            )}
          </span>
        </div>

        {/* Nome da Ação / Perícia */}
        <p className="text-sm md:text-base font-bold text-white/90 mb-1">
          {roll.label || "Rolagem de Dado"}
        </p>

        {/* Alerta de Crítico / Falha */}
        {roll.isCritical && (
          <div className="text-amber-300 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 my-1 animate-pulse">
            <Sparkles className="w-4 h-4" /> Sucesso Crítico! (20 Natural)
          </div>
        )}

        {roll.isFumble && (
          <div className="text-red-400 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 my-1 animate-pulse">
            <AlertTriangle className="w-4 h-4" /> Falha Crítica! (1 Natural)
          </div>
        )}

        {/* Grande Resultado Numérico */}
        <div className="text-6xl md:text-7xl font-black tracking-tight text-white my-2 drop-shadow-md">
          {roll.total}
        </div>

        {/* Detalhes da Fórmula */}
        <p className="text-xs text-zinc-400 font-mono">
          {roll.formula} &rarr; {roll.rawRoll}{" "}
          {roll.modifier !== 0 && (
            <span>
              {roll.modifier >= 0 ? `+ ${roll.modifier}` : `- ${Math.abs(roll.modifier)}`}
            </span>
          )}
        </p>

        {/* Barra de Progresso no Rodapé */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className={`h-full transition-all duration-75 ${
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
