"use client";

import { useState } from "react";
import {
  RotateCw,
  RotateCcw,
  Trash2,
  Edit3,
  ArrowRightLeft,
  X,
  User,
  Box,
} from "lucide-react";
import { MapElement } from "./elementTypes";
import { ElementEditModal } from "./ElementEditModal";

interface ElementControlsOverlayProps {
  element: MapElement;
  gridSize: number;
  campaignId?: string;
  onUpdate: (updated: MapElement) => void;
  onDelete: (id: string) => void;
  onDeselect: () => void;
  availableMaps?: { id: string; title: string }[];
  onTransfer?: (targetMapId: string) => void;
}

export function ElementControlsOverlay({
  element,
  gridSize,
  campaignId = "",
  onUpdate,
  onDelete,
  onDeselect,
  availableMaps,
  onTransfer,
}: ElementControlsOverlayProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const isToken = element.type === "TOKEN";

  function rotate(delta: number) {
    const newRot = ((element.rotation || 0) + delta + 360) % 360;
    onUpdate({ ...element, rotation: newRot });
  }

  function setSize(cells: number) {
    onUpdate({ ...element, widthCells: cells, heightCells: cells });
  }

  function adjustPropDimension(field: "widthCells" | "heightCells", delta: number) {
    const cur = element[field] || 1;
    const next = Math.max(1, Math.min(8, cur + delta));
    onUpdate({ ...element, [field]: next });
  }

  return (
    <>
      <div
        className="absolute top-4 right-4 z-30 w-72 p-3.5 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-xs text-white select-none space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 pointer-events-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Inspetor */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <div
              className={`p-1.5 rounded-lg border ${
                isToken
                  ? "bg-emerald-950/80 border-emerald-700/60 text-emerald-400"
                  : "bg-amber-950/80 border-amber-700/60 text-amber-400"
              }`}
            >
              {isToken ? <User className="w-4 h-4" /> : <Box className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-white truncate">{element.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-zinc-400 font-medium">
                  {isToken ? "Token de Personagem" : "Objeto de Cenário"}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                  {element.widthCells}x{element.heightCells}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onDeselect}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar inspetor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Linha 1: Rotação */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold mb-1">
            <span>Rotação</span>
            <span className="font-mono text-zinc-300">{element.rotation || 0}°</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => rotate(-45)}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 transition-colors cursor-pointer text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>-45°</span>
            </button>
            <button
              type="button"
              onClick={() => rotate(45)}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 transition-colors cursor-pointer text-xs font-semibold"
            >
              <RotateCw className="w-3.5 h-3.5 text-zinc-400" />
              <span>+45°</span>
            </button>
          </div>
        </div>

        {/* Linha 2: Tamanho / Dimensões */}
        <div>
          <span className="block text-[11px] text-zinc-400 font-semibold mb-1">
            Tamanho no Grid
          </span>
          {isToken ? (
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSize(size)}
                  className={`py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    element.widthCells === size
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950 border border-emerald-400"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
                  }`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between bg-zinc-900 px-2 py-1.5 rounded-xl border border-white/10">
                <span className="text-zinc-400 font-semibold">Largura:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustPropDimension("widthCells", -1)}
                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-bold">{element.widthCells}</span>
                  <button
                    type="button"
                    onClick={() => adjustPropDimension("widthCells", 1)}
                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 px-2 py-1.5 rounded-xl border border-white/10">
                <span className="text-zinc-400 font-semibold">Altura:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustPropDimension("heightCells", -1)}
                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-bold">{element.heightCells}</span>
                  <button
                    type="button"
                    onClick={() => adjustPropDimension("heightCells", 1)}
                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Linha 3: Mover para outro mapa (se houver mais de 1) */}
        {availableMaps && availableMaps.length > 0 && onTransfer && (
          <div className="pt-2 border-t border-white/10">
            <span className="block text-[11px] text-zinc-400 font-semibold mb-1 flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3 text-indigo-400" />
              Mover para outro mapa
            </span>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) onTransfer(e.target.value);
              }}
              className="w-full bg-zinc-900 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Selecione o mapa destino...</option>
              {availableMaps.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Linha 4: Ações (Editar Completo e Excluir) */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-colors cursor-pointer text-xs"
            title="Editar nome, avatar e propriedades completas"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(element.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/60 transition-colors cursor-pointer text-xs"
            title="Remover do mapa"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      {isEditOpen && (
        <ElementEditModal
          element={element}
          campaignId={campaignId}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={onUpdate}
          availableMaps={availableMaps}
          onTransfer={onTransfer}
        />
      )}
    </>
  );
}
