"use client";

import { useState } from "react";
import { Box, Plus, Image as ImageIcon } from "lucide-react";
import { MapElement, PRESET_PROPS, PresetProp } from "./elementTypes";
import { GalleryMediaPicker } from "../GalleryMediaPicker";

interface PropPickerTabProps {
  campaignId: string;
  spawnPosition: { x: number; y: number };
  onAddElement: (elem: MapElement) => void;
  onClose: () => void;
}

export function PropPickerTab({
  campaignId,
  spawnPosition,
  onAddElement,
  onClose,
}: PropPickerTabProps) {
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customWidth, setCustomWidth] = useState(1);
  const [customHeight, setCustomHeight] = useState(1);
  const [customShape, setCustomShape] = useState<"rect" | "circle">("rect");
  const [showGallery, setShowGallery] = useState(false);

  function genId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function handleAddPresetProp(preset: PresetProp) {
    const newElement: MapElement = {
      id: genId(),
      type: "PROP",
      name: preset.name,
      widthCells: preset.widthCells,
      heightCells: preset.heightCells,
      propShape: preset.propShape,
      propIcon: preset.propIcon,
      propColor: preset.propColor,
      rotation: 0,
      x: spawnPosition.x + Math.floor(Math.random() * 40 - 20),
      y: spawnPosition.y + Math.floor(Math.random() * 40 - 20),
    };

    onAddElement(newElement);
    onClose();
  }

  function handleAddCustomProp(e: React.FormEvent) {
    e.preventDefault();
    if (!customName.trim()) return;

    const newElement: MapElement = {
      id: genId(),
      type: "PROP",
      name: customName.trim(),
      imageUrl: customUrl.trim() || undefined,
      widthCells: Math.max(1, customWidth),
      heightCells: Math.max(1, customHeight),
      propShape: customShape,
      propColor: "#334155",
      rotation: 0,
      x: spawnPosition.x,
      y: spawnPosition.y,
    };

    onAddElement(newElement);
    setCustomName("");
    setCustomUrl("");
    onClose();
  }

  return (
    <div className="space-y-4">
      {/* Presets Rápidos */}
      <div>
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Objetos Rápidos
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_PROPS.map((prop) => (
            <button
              key={prop.id}
              type="button"
              onClick={() => handleAddPresetProp(prop)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-emerald-500/50 hover:bg-zinc-800/80 text-center transition-all group cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 shadow"
                style={{ backgroundColor: prop.propColor }}
              >
                <Box className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 line-clamp-1">
                {prop.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {prop.widthCells}x{prop.heightCells}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Prop Customizado */}
      <form onSubmit={handleAddCustomProp} className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-zinc-300">Objeto Customizado / Imagem Livre</h4>
          <button
            type="button"
            onClick={() => setShowGallery(!showGallery)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {showGallery ? "Ocultar Galeria" : "Da Galeria"}
          </button>
        </div>

        {showGallery && (
          <div className="p-2 rounded-xl bg-zinc-950/80 border border-white/10">
            <span className="block text-[11px] text-zinc-400 font-bold mb-1.5">
              Clique para usar uma imagem salva:
            </span>
            <GalleryMediaPicker
              campaignId={campaignId}
              selectedUrl={customUrl}
              onSelect={(url, title) => {
                setCustomUrl(url);
                if (!customName.trim() && title) setCustomName(title);
                setShowGallery(false);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Nome do objeto"
            value={customName || ""}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full bg-zinc-950 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            required
          />
          <input
            type="url"
            placeholder="URL da imagem (opcional)"
            value={customUrl || ""}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="w-full bg-zinc-950 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-300">
          <label className="flex items-center gap-1.5">
            <span>Largura:</span>
            <input
              type="number"
              min={1}
              max={8}
              value={customWidth || 1}
              onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 bg-zinc-950 border border-white/15 rounded px-2 py-1 text-center"
            />
          </label>
          <label className="flex items-center gap-1.5">
            <span>Altura:</span>
            <input
              type="number"
              min={1}
              max={8}
              value={customHeight || 1}
              onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 bg-zinc-950 border border-white/15 rounded px-2 py-1 text-center"
            />
          </label>
          <button
            type="submit"
            className="ml-auto px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>
      </form>
    </div>
  );
}
