"use client";

import { Tv, EyeOff, Trash2 } from "lucide-react";

export interface MediaItem {
  id: string;
  campaignId: string;
  title: string;
  url: string;
  category: string;
  notes?: string | null;
  createdAt: string;
}

interface MediaCardProps {
  item: MediaItem;
  isActive: boolean;
  onProject: (item: MediaItem) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

export function MediaCard({
  item,
  isActive,
  onProject,
  onClear,
  onDelete,
}: MediaCardProps) {
  const categoryLabels: Record<string, string> = {
    SCENE: "Cena",
    NPC: "NPC / Ameaça",
    MAP: "Mapa",
    HANDOUT: "Documento",
  };

  return (
    <div
      className={`relative group rounded-xl border overflow-hidden bg-[var(--bg-card)] transition-all ${
        isActive
          ? "border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500"
          : "border-[var(--border-default)] hover:border-[var(--border-accent)]"
      }`}
    >
      {/* Thumbnail da Imagem */}
      <div className="relative aspect-video w-full bg-black/40 overflow-hidden flex items-center justify-center">
        <img
          src={item.url}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {isActive && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            No Telão
          </div>
        )}

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Excluir mídia"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Detalhes do Asset */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-2">
          <h4 className="font-bold text-xs text-[var(--text-primary)] line-clamp-1" title={item.title}>
            {item.title}
          </h4>
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] shrink-0">
            {categoryLabels[item.category] || item.category}
          </span>
        </div>

        {/* Botão de Projeção */}
        {isActive ? (
          <button
            type="button"
            onClick={onClear}
            className="w-full py-1.5 px-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 text-red-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <EyeOff className="w-3.5 h-3.5" /> Ocultar do Telão
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onProject(item)}
            className="w-full py-1.5 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Tv className="w-3.5 h-3.5" /> Projetar na TV
          </button>
        )}
      </div>
    </div>
  );
}
