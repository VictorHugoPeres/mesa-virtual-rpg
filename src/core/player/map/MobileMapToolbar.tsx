"use client";

import { ZoomIn, ZoomOut, Crosshair, MousePointer, Hand } from "lucide-react";

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
    <div className="absolute top-2 left-2 right-2 z-40 flex flex-col gap-1.5 pointer-events-none">
      {/* Abinhas de Seleção de Mapa no Modo Split */}
      {isSplit && map2Title && (
        <div className="self-center flex items-center p-1 rounded-xl bg-[#14161A] border border-[#23272F] shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => onSelectMapIndex(0)}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
              selectedMapIndex === 0
                ? "bg-rose-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {map1Title || "Mapa 1"}
          </button>
          <button
            type="button"
            onClick={() => onSelectMapIndex(1)}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
              selectedMapIndex === 1
                ? "bg-rose-600 text-white shadow-sm"
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold shadow-lg transition-colors cursor-pointer ${
              tapToMove
                ? "bg-emerald-600 border-emerald-400 text-white ring-1 ring-emerald-500"
                : "bg-[#14161A] border-[#23272F] text-zinc-300 hover:text-white"
            }`}
          >
            {tapToMove ? (
              <>
                <MousePointer className="w-3.5 h-3.5 text-emerald-200" />
                <span>📍 Tocar p/ Mover</span>
              </>
            ) : (
              <>
                <Hand className="w-3.5 h-3.5 text-sky-400" />
                <span>👆 Arrastar Token</span>
              </>
            )}
          </button>

          {/* Badge de Distância do Último Movimento */}
          {lastDistance && (
            <span className="px-2 py-1 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-emerald-400 text-[10px] font-mono font-bold">
              {lastDistance}
            </span>
          )}
        </div>

        {/* Controles de Câmera (Focar no Token + Zoom +/-) */}
        <div className="flex items-center gap-1 bg-[#14161A] border border-[#23272F] p-1 rounded-xl shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={onCenterMyToken}
            title="Centralizar no Meu Token"
            className="p-1.5 rounded-lg text-sky-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-3.5 bg-[#23272F] mx-0.5" />
          <button
            type="button"
            onClick={onZoomOut}
            title="Diminuir Zoom"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            title="Aumentar Zoom"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
