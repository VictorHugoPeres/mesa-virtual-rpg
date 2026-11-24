"use client";

import { Edit3, Columns, Monitor } from "lucide-react";

interface SplitEditingToolbarProps {
  map1Title: string;
  map2Title: string;
  activeEditSlot: 1 | 2;
  onSelectSlot: (slot: 1 | 2) => void;
  gmSplitView: boolean;
  onToggleGmSplitView: () => void;
}

export function SplitEditingToolbar({
  map1Title,
  map2Title,
  activeEditSlot,
  onSelectSlot,
  gmSplitView,
  onToggleGmSplitView,
}: SplitEditingToolbarProps) {
  return (
    <div className="h-10 px-4 bg-[#14161A]/95 border-b border-[#23272F] flex items-center justify-between gap-3 text-xs z-20 shrink-0 backdrop-blur-md animate-in fade-in duration-150">
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Editando no PC:</span>
        </span>

        {/* Botão Slot 1 */}
        <button
          type="button"
          onClick={() => onSelectSlot(1)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeEditSlot === 1
              ? "bg-emerald-600/90 text-white shadow-md shadow-emerald-900/30 border border-emerald-400/50"
              : "bg-[#0B0C0E] text-zinc-300 hover:text-white hover:bg-[#1A1D24] border border-[#23272F]"
          }`}
        >
          <span className="text-[10px] uppercase font-mono px-1 rounded bg-black/40">Slot 1</span>
          <span className="truncate max-w-[140px] sm:max-w-[200px]">{map1Title || "Mapa 1"}</span>
        </button>

        {/* Botão Slot 2 */}
        <button
          type="button"
          onClick={() => onSelectSlot(2)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeEditSlot === 2
              ? "bg-emerald-600/90 text-white shadow-md shadow-emerald-900/30 border border-emerald-400/50"
              : "bg-[#0B0C0E] text-zinc-300 hover:text-white hover:bg-[#1A1D24] border border-[#23272F]"
          }`}
        >
          <span className="text-[10px] uppercase font-mono px-1 rounded bg-black/40">Slot 2</span>
          <span className="truncate max-w-[140px] sm:max-w-[200px]">{map2Title || "Mapa 2"}</span>
        </button>
      </div>

      {/* Botão opcional de Visualização Lado a Lado no Mestre */}
      <button
        type="button"
        onClick={onToggleGmSplitView}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
          gmSplitView
            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
            : "bg-[#0B0C0E] text-zinc-400 hover:text-zinc-200 border border-[#23272F] hover:bg-[#1A1D24]"
        }`}
        title={
          gmSplitView
            ? "Alternar para visualização de mapa único no PC"
            : "Visualizar os dois mapas lado a lado também no PC do Mestre"
        }
      >
        <Columns className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {gmSplitView ? "Lado a Lado (Ativo)" : "Ver Lado a Lado no PC"}
        </span>
      </button>
    </div>
  );
}
