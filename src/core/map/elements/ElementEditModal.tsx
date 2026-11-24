"use client";

import { useState } from "react";
import { X, Save, Image as ImageIcon, ArrowRightLeft } from "lucide-react";
import { Portal } from "@/core/ui";
import { MapElement } from "./elementTypes";
import { GalleryMediaPicker } from "../GalleryMediaPicker";

interface ElementEditModalProps {
  element: MapElement;
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: MapElement) => void;
  availableMaps?: { id: string; title: string }[];
  onTransfer?: (targetMapId: string) => void;
}

export function ElementEditModal({
  element,
  campaignId,
  isOpen,
  onClose,
  onSave,
  availableMaps,
  onTransfer,
}: ElementEditModalProps) {
  const [name, setName] = useState(element.name || "");
  const [imageUrl, setImageUrl] = useState(element.imageUrl || "");
  const [widthCells, setWidthCells] = useState(element.widthCells || 1);
  const [heightCells, setHeightCells] = useState(element.heightCells || 1);
  const [healthStatus, setHealthStatus] = useState(element.healthStatus || "Saudável");
  const [showGallery, setShowGallery] = useState(false);
  const [targetMapId, setTargetMapId] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const updated: MapElement = {
      ...element,
      name: name.trim() || element.name,
      imageUrl: imageUrl.trim() || undefined,
      widthCells: Math.max(1, widthCells),
      heightCells: Math.max(1, heightCells),
      healthStatus: element.type === "TOKEN" ? healthStatus : undefined,
    };
    onSave(updated);
    onClose();
  }

  function handleTransferClick() {
    if (targetMapId && onTransfer) {
      onTransfer(targetMapId);
      onClose();
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#14161A] border border-[#23272F] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23272F]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Editar {element.type === "TOKEN" ? "Token" : "Objeto de Cenário"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto">
          {/* Nome */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Nome / Rótulo</label>
            <input
              type="text"
              required
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0B0C0E] border border-[#23272F] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs"
            />
          </div>

          {/* Dimensões */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Largura (células)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={widthCells || 1}
                onChange={(e) => setWidthCells(Number(e.target.value) || 1)}
                className="w-full bg-[#0B0C0E] border border-[#23272F] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs text-center"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Altura (células)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={heightCells || 1}
                onChange={(e) => setHeightCells(Number(e.target.value) || 1)}
                className="w-full bg-[#0B0C0E] border border-[#23272F] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs text-center"
              />
            </div>
          </div>

          {/* Imagem / Avatar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-zinc-400 font-semibold">Imagem (URL Web)</label>
              <button
                type="button"
                onClick={() => setShowGallery(!showGallery)}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {showGallery ? "Ocultar Galeria" : "Escolher da Galeria"}
              </button>
            </div>
            <input
              type="url"
              placeholder="https://exemplo.com/imagem.png"
              value={imageUrl || ""}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#0B0C0E] border border-[#23272F] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs"
            />
          </div>

          {/* Seletor da Galeria embutido */}
          {showGallery && (
            <div className="p-2 rounded-xl bg-zinc-900/80 border border-white/10">
              <span className="block text-[11px] text-zinc-400 font-bold mb-2">Imagens da Campanha:</span>
              <GalleryMediaPicker
                campaignId={campaignId}
                selectedUrl={imageUrl}
                onSelect={(url) => {
                  setImageUrl(url);
                  setShowGallery(false);
                }}
              />
            </div>
          )}

          {/* Estado de Saúde para Tokens */}
          {element.type === "TOKEN" && (
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Estado de Saúde</label>
              <select
                value={healthStatus || "Saudável"}
                onChange={(e) => setHealthStatus(e.target.value as any)}
                className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-2 text-white text-xs cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                <option value="Saudável">Saudável (Verde)</option>
                <option value="Ferido">Ferido (Amarelo)</option>
                <option value="Crítico">Crítico (Laranja)</option>
                <option value="Gravemente Ferido">Gravemente Ferido (Vermelho)</option>
                <option value="Derrotado">Derrotado (Cinza)</option>
              </select>
            </div>
          )}

          {/* Mover para outro Mapa da Campanha */}
          {availableMaps && availableMaps.length > 0 && onTransfer && (
            <div className="pt-3 border-t border-white/10">
              <label className="block text-zinc-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                Mover para outro Mapa da Campanha
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={targetMapId}
                  onChange={(e) => setTargetMapId(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-white/15 rounded-lg px-3 py-2 text-white text-xs cursor-pointer focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Selecione o mapa destino...</option>
                  {availableMaps.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!targetMapId}
                  onClick={handleTransferClick}
                  className="px-3 py-2 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
                >
                  Transferir
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#23272F]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#23272F] text-zinc-400 hover:text-white hover:bg-[#1A1D24] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold bg-rose-600 text-white hover:bg-rose-500 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
}
