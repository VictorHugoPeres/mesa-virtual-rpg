"use client";

import { useState } from "react";
import { Grid, Eye, EyeOff, Sliders, ChevronDown, ChevronUp } from "lucide-react";
import { GRID_COLOR_PRESETS } from "./mapTypes";

interface GridControlsOverlayProps {
  gridEnabled: boolean;
  gridSize: number;
  gridColor: string;
  gridOpacity: number;
  metersPerGrid: number;
  onChange: (updates: {
    gridEnabled?: boolean;
    gridSize?: number;
    gridColor?: string;
    gridOpacity?: number;
    metersPerGrid?: number;
  }) => void;
}

export function GridControlsOverlay({
  gridEnabled,
  gridSize,
  gridColor,
  gridOpacity,
  metersPerGrid,
  onChange,
}: GridControlsOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
      {/* Botão de Toggle Rápido / Expandir Painel */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-xl text-xs">
        <button
          type="button"
          onClick={() => onChange({ gridEnabled: !gridEnabled })}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            gridEnabled
              ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
              : "bg-zinc-800 text-zinc-400 border border-zinc-700/60"
          }`}
          title={gridEnabled ? "Grade Ativada" : "Grade Oculta"}
        >
          {gridEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Grade {gridEnabled ? "ON" : "OFF"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Configurações da Grade"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Painel de Ajustes Expandido */}
      {isExpanded && (
        <div className="w-72 p-4 rounded-xl bg-black/90 backdrop-blur-md border border-white/15 shadow-2xl text-xs space-y-3.5 text-white animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold flex items-center gap-1.5 text-emerald-400">
              <Grid className="w-4 h-4" /> Ajuste do Grid
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Tamanho da Célula */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-zinc-400">Tamanho da Célula</span>
              <span className="font-mono text-emerald-400">{gridSize}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="2"
              value={gridSize}
              onChange={(e) => onChange({ gridSize: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Opacidade da Grade */}
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-zinc-400">Opacidade</span>
              <span className="font-mono text-emerald-400">{Math.round(gridOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={gridOpacity}
              onChange={(e) => onChange({ gridOpacity: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Cor da Grade */}
          <div>
            <span className="block text-zinc-400 font-semibold mb-1.5">Cor da Grade</span>
            <div className="flex items-center gap-1.5">
              {GRID_COLOR_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onChange({ gridColor: p.value })}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    gridColor.toLowerCase() === p.value.toLowerCase()
                      ? "ring-2 ring-emerald-400 scale-110"
                      : "border-white/30 hover:scale-105"
                  }`}
                  style={{ backgroundColor: p.value }}
                  title={p.name}
                />
              ))}
              <input
                type="color"
                value={gridColor}
                onChange={(e) => onChange({ gridColor: e.target.value })}
                className="w-6 h-6 rounded border border-white/30 bg-transparent cursor-pointer ml-auto"
                title="Cor customizada"
              />
            </div>
          </div>

          {/* Escala (Metros por Quadrado) */}
          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            <span className="text-zinc-400 font-semibold">Escala / Quadrado</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={metersPerGrid}
                onChange={(e) => onChange({ metersPerGrid: Number(e.target.value) || 1.5 })}
                className="w-14 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-center font-bold text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-zinc-400 font-bold">m</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
