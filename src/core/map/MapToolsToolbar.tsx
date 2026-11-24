"use client";

import {
  MousePointer,
  Eye,
  EyeOff,
  Ruler,
  Sun,
  Cloud,
  Tv,
  Trash2,
  CircleDot,
  Minus,
} from "lucide-react";
import { MapToolMode, RulerShape } from "./mapTypes";

interface MapToolsToolbarProps {
  activeTool: MapToolMode;
  onSelectTool: (tool: MapToolMode) => void;
  // Névoa
  onCoverAll: () => void;
  onRevealAll: () => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  // Régua
  rulerShape: RulerShape;
  onRulerShapeChange: (shape: RulerShape) => void;
  showRulerOnTv: boolean;
  onToggleShowRulerOnTv: () => void;
  onClearRuler: () => void;
}

export function MapToolsToolbar({
  activeTool,
  onSelectTool,
  onCoverAll,
  onRevealAll,
  brushSize,
  onBrushSizeChange,
  rulerShape,
  onRulerShapeChange,
  showRulerOnTv,
  onToggleShowRulerOnTv,
  onClearRuler,
}: MapToolsToolbarProps) {
  const isFog = activeTool === "fog_reveal" || activeTool === "fog_hide";
  const isRuler = activeTool === "ruler";

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-wrap items-center gap-2 px-3 py-2 rounded-2xl bg-[#14161A]/95 backdrop-blur-xl border border-[#23272F] shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-xs text-white select-none pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Modos Principais */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onSelectTool("select")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTool === "select"
              ? "bg-white/10 text-white border border-white/20 shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
          title="Selecionar e mover tokens e objetos (padrão)"
        >
          <MousePointer className="w-3.5 h-3.5 text-zinc-300" />
          <span>Mover</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool("fog_reveal")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTool === "fog_reveal"
              ? "bg-amber-600/90 text-white shadow-md shadow-amber-950/30 border border-amber-400/60"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
          title="Revelar Névoa de Guerra (clique e arraste o pincel)"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Revelar Névoa</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool("fog_hide")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTool === "fog_hide"
              ? "bg-[#1A1D24] text-white shadow-md border border-[#23272F]"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
          title="Cobrir com Névoa de Guerra (clique e arraste o pincel)"
        >
          <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
          <span>Cobrir Névoa</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool("ruler")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTool === "ruler"
              ? "bg-purple-600/90 text-white shadow-md shadow-purple-950/30 border border-purple-400/60"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
          title="Régua de Medição em Metros e Quadrados"
        >
          <Ruler className="w-3.5 h-3.5 text-purple-400" />
          <span>Régua</span>
        </button>
      </div>

      {/* Sub-controles da Névoa de Guerra */}
      {isFog && (
        <>
          <div className="w-[1px] h-5 bg-[#23272F] mx-0.5" />

          {/* Tamanho do Pincel */}
          <div className="flex items-center gap-1 bg-[#0B0C0E] rounded-xl p-0.5 border border-[#23272F]">
            <span className="text-[10px] text-zinc-400 px-1 font-semibold">Pincel:</span>
            {[1, 2, 3].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onBrushSizeChange(size)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  brushSize === size
                    ? "bg-amber-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                title={`Pincel ${size}x${size} blocos`}
              >
                {size}x{size}
              </button>
            ))}
          </div>

          {/* Ações Rápidas de Névoa */}
          <button
            type="button"
            onClick={onCoverAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold bg-[#0B0C0E] hover:bg-[#1A1D24] text-zinc-200 border border-[#23272F] transition-colors cursor-pointer text-[11px]"
            title="Cobrir o mapa inteiro com névoa escura"
          >
            <Cloud className="w-3.5 h-3.5 text-zinc-400" />
            <span>Cobrir Tudo</span>
          </button>

          <button
            type="button"
            onClick={onRevealAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-600/30 transition-colors cursor-pointer text-[11px]"
            title="Revelar todo o mapa"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Revelar Tudo</span>
          </button>
        </>
      )}

      {/* Sub-controles da Régua */}
      {isRuler && (
        <>
          <div className="w-[1px] h-5 bg-[#23272F] mx-0.5" />

          {/* Formato da Medição */}
          <div className="flex items-center gap-1 bg-[#0B0C0E] rounded-xl p-0.5 border border-[#23272F]">
            <button
              type="button"
              onClick={() => onRulerShapeChange("line")}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                rulerShape === "line"
                  ? "bg-purple-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Medir Distância em Linha Reta"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Linha</span>
            </button>
            <button
              type="button"
              onClick={() => onRulerShapeChange("circle")}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                rulerShape === "circle"
                  ? "bg-purple-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Medir Raio / Área (Feitiço ou Expansão de Domínio)"
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>Círculo</span>
            </button>
          </div>

          {/* Toggle Mostrar na TV */}
          <button
            type="button"
            onClick={onToggleShowRulerOnTv}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-[11px] ${
              showRulerOnTv
                ? "bg-emerald-600/90 text-white shadow-md shadow-emerald-950/30 border border-emerald-400/50"
                : "bg-[#0B0C0E] text-zinc-400 hover:text-white border border-[#23272F]"
            }`}
            title={showRulerOnTv ? "Medição visível no Telão" : "Projetar medição no Telão da TV"}
          >
            <Tv className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showRulerOnTv ? "Na TV: Ligado" : "Mostrar na TV"}</span>
          </button>

          {/* Limpar medição */}
          <button
            type="button"
            onClick={onClearRuler}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
            title="Limpar medição ativa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
