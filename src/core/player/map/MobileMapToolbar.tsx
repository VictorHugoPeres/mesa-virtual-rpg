"use client";

import { ZoomIn, ZoomOut, Crosshair, MousePointer, Hand, Layers } from "lucide-react";

interface MobileMapToolbarProps {
  isSplit: boolean;
  selectedMapIndex: 0 | 1;
  onSelectMapIndex: (idx: 0 | 1) => void;
  map1Title: string;
  map2Title?: string;
  tapToMove: boolean;
  onToggleTapToMove: () => void;
  onCenterMyToken: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  lastDistance?: string | null;
}

export function MobileMapToolbar({
  isSplit,
  selectedMapIndex,
  onSelectMapIndex,
  map1Title,
  map2Title,
  tapToMove,
  onToggleTapToMove,
  onCenterMyToken,
  onZoomIn,
  onZoomOut,
  lastDistance,
}: MobileMapToolbarProps) {
  return (
    <div className="absolute top-2 left-2 right-2 z-40 flex flex-col gap-1.5 pointer-events-none select-none">
      {/* Abinhas de Seleção de Mapa no Modo Split */}
      {isSplit && map2Title && (
        <div className="self-center flex items-center p-1 rounded-xl bg-zinc-950/90 border border-zinc-800 backdrop-blur-md shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => onSelectMapIndex(0)}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              selectedMapIndex === 0
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {map1Title || "Mapa 1"}
          </button>
          <button
            type="button"
            onClick={() => onSelectMapIndex(1)}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              selectedMapIndex === 1
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {map2Title || "Mapa 2"}
          </button>
        </div>
      )}

      {/* Barra de Controles Rápidos */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Alternador de Modo: Tocar p/ Mover vs Arrastar */}
          <button
            type="button"
            onClick={onToggleTapToMove}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold backdrop-blur-md shadow-lg transition-all cursor-pointer active:scale-95 ${
              tapToMove
                ? "bg-emerald-600/90 border-emerald-400 text-white ring-2 ring-emerald-500/50"
                : "bg-zinc-900/85 border-zinc-700/80 text-zinc-300 hover:text-white"
            }`}
          >
            {tapToMove ? (
              <>
                <MousePointer className="w-3.5 h-3.5 text-emerald-200" />
                <span>📍 Tocar p/ Mover</span>
              </>
            ) : (
              <>
                <Hand className="w-3.5 h-3.5 text-blue-400" />
                <span>👆 Arrastar Token</span>
              </>
            )}
          </button>

          {/* Badge de Distância do Último Movimento */}
          {lastDistance && (
            <span className="px-2 py-1 rounded-lg bg-black/80 border border-white/10 text-emerald-400 text-[10px] font-mono font-bold backdrop-blur-md animate-in fade-in duration-200">
              {lastDistance}
            </span>
          )}
        </div>

        {/* Controles de Câmera (Focar no Token + Zoom +/-) */}
        <div className="flex items-center gap-1 bg-zinc-900/85 border border-zinc-700/80 backdrop-blur-md p-1 rounded-xl shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={onCenterMyToken}
            title="Centralizar no Meu Token"
            className="p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-3.5 bg-zinc-700 mx-0.5" />
          <button
            type="button"
            onClick={onZoomOut}
            title="Diminuir Zoom"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            title="Aumentar Zoom"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
