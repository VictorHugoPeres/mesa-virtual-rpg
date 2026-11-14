"use client";

import { useState } from "react";
import { MediaCard, MediaItem } from "./MediaCard";
import { ProjectionData } from "../sync/syncTypes";
import { FolderOpen, RefreshCw } from "lucide-react";

interface MediaGalleryTabProps {
  mediaList: MediaItem[];
  loading: boolean;
  activeProjection: ProjectionData | null;
  onProject: (item: MediaItem) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function MediaGalleryTab({
  mediaList,
  loading,
  activeProjection,
  onProject,
  onClear,
  onDelete,
  onRefresh,
}: MediaGalleryTabProps) {
  const [categoryFilter, setCategoryFilter] = useState("TODOS");

  const filteredList = mediaList.filter((m) =>
    categoryFilter === "TODOS" ? true : m.category === categoryFilter
  );

  return (
    <div>
      {/* Filtros de Categoria & Botão Atualizar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5 overflow-x-auto text-xs">
          {["TODOS", "SCENE", "NPC", "MAP", "HANDOUT"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer text-xs ${
                categoryFilter === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat === "TODOS"
                ? "Todas"
                : cat === "SCENE"
                ? "Cenas"
                : cat === "NPC"
                ? "NPCs/Ameaças"
                : cat === "MAP"
                ? "Mapas"
                : "Pistas"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
          title="Atualizar galeria"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`}
          />
        </button>
      </div>

      {/* Grid de Cards */}
      {filteredList.length === 0 ? (
        <div className="py-16 text-center text-xs text-[var(--text-muted)]">
          <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>Nenhuma imagem cadastrada nesta categoria.</p>
          <p className="mt-1">
            Faça upload de uma imagem do seu PC ou adicione uma URL na aba ao lado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredList.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              isActive={activeProjection?.mediaUrl === item.url}
              onProject={onProject}
              onClear={onClear}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
