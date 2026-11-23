"use client";

import { MapPinOff, Sparkles, Compass } from "lucide-react";

export function MobileEmptyMapState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 min-h-[50vh] text-[var(--text-muted)] animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <MapPinOff className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="max-w-xs space-y-1.5">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          Nenhum mapa projetado pelo Mestre
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Quando o Mestre abrir ou projetar um mapa tático na mesa, ele aparecerá aqui automaticamente para você mover seu token e acompanhar o combate.
        </p>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-400 font-medium">
        <Sparkles className="w-3 h-3" />
        <span>Sincronização em tempo real ativa</span>
      </div>
    </div>
  );
}
