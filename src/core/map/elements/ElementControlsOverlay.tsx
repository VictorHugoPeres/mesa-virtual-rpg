"use client";

import { useState } from "react";
import { RotateCw, RotateCcw, Trash2, Edit3, X } from "lucide-react";
import { MapElement } from "./elementTypes";
import { ElementEditModal } from "./ElementEditModal";

interface ElementControlsOverlayProps {
  element: MapElement;
  gridSize: number;
  campaignId?: string;
  onUpdate: (updated: MapElement) => void;
  onDelete: (id: string) => void;
  onDeselect: () => void;
}

export function ElementControlsOverlay({
  element,
  gridSize,
  campaignId = "",
  onUpdate,
  onDelete,
  onDeselect,
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

  const posX = element.x;
  const posY = element.y - 44;

  return (
    <>
      <div
        className="absolute z-30 flex items-center gap-1.5 p-1 rounded-xl bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl text-xs text-white select-none transition-all"
        style={{
          left: `${posX}px`,
          top: `${Math.max(10, posY)}px`,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-bold text-[11px] px-2 text-emerald-400 border-r border-white/10 truncate max-w-[110px]">
          {element.name}
        </span>

        {/* Rotação */}
        <button
          type="button"
          onClick={() => rotate(-45)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Girar -45°"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => rotate(45)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Girar +45°"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/20" />

        {/* Ajuste Rápido de Tamanho */}
        {isToken ? (
          <div className="flex items-center gap-1 text-[10px] font-bold">
            {[1, 2, 3].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSize(size)}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  element.widthCells === size
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:text-white"
                }`}
                title={`Tamanho ${size}x${size}`}
              >
                {size}x{size}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <span className="text-zinc-400">L:</span>
            <button
              type="button"
              onClick={() => adjustPropDimension("widthCells", -1)}
              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <span className="w-3 text-center">{element.widthCells}</span>
            <button
              type="button"
              onClick={() => adjustPropDimension("widthCells", 1)}
              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
            >
              +
            </button>

            <span className="text-zinc-400 ml-1">A:</span>
            <button
              type="button"
              onClick={() => adjustPropDimension("heightCells", -1)}
              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <span className="w-3 text-center">{element.heightCells}</span>
            <button
              type="button"
              onClick={() => adjustPropDimension("heightCells", 1)}
              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
            >
              +
            </button>
          </div>
        )}

        <div className="w-[1px] h-4 bg-white/20" />

        {/* Botão de Edição Completa (Nome / Imagem / Tamanho) */}
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="p-1.5 rounded-lg hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          title="Editar Nome, Imagem e Propriedades"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        {/* Excluir */}
        <button
          type="button"
          onClick={() => onDelete(element.id)}
          className="p-1.5 rounded-lg hover:bg-red-950/60 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          title="Remover do mapa"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Deselecionar */}
        <button
          type="button"
          onClick={onDeselect}
          className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
          title="Fechar controles"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {isEditOpen && (
        <ElementEditModal
          element={element}
          campaignId={campaignId}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={onUpdate}
        />
      )}
    </>
  );
}
