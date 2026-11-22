"use client";

import { useState } from "react";
import { Music, Play, Pause, Trash2, Plus, Filter } from "lucide-react";
import { AudioTrack, BGM_CATEGORIES, BGMCategoryType } from "./audioTypes";
import { useAudio } from "./AudioContext";
import { useDialog } from "@/core/ui";

interface BGMTabProps {
  onOpenAddModal: () => void;
}

export function BGMTab({ onOpenAddModal }: BGMTabProps) {
  const { confirm, toast } = useDialog();
  const { tracks, bgmState, playTrack, togglePlay, loadTracks } = useAudio();
  const [selectedCategory, setSelectedCategory] = useState<BGMCategoryType>("TODOS");

  const filtered = tracks.filter((t) => {
    if (selectedCategory === "TODOS") return true;
    return t.category.toUpperCase() === selectedCategory;
  });

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: "Excluir Faixa",
      message: "Deseja realmente excluir esta faixa da campanha?",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
      loadTracks();
      toast.success("Faixa excluída com sucesso.");
    } catch (err) {
      console.warn("Erro ao excluir faixa:", err);
      toast.error("Erro ao excluir faixa.");
    }
  }

  return (
    <div className="space-y-4">
      {/* Barra de Filtro e Botão de Adicionar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
          {BGM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-pink-600 text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-pink-600/20 text-pink-300 border border-pink-500/30 hover:bg-pink-600/30 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar Faixa
        </button>
      </div>

      {/* Lista de Faixas */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-[var(--border-default)] rounded-xl">
          <Music className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-white/80">Nenhuma faixa de áudio encontrada</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Cadastre músicas locais (MP3/OGG/WAV) ou URLs externas clicando no botão acima.
          </p>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.map((track) => {
            const isThisTrack = bgmState.track?.url === track.url;
            const isPlaying = isThisTrack && bgmState.isPlaying;

            return (
              <div
                key={track.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isThisTrack
                    ? "bg-pink-950/20 border-pink-500/50 shadow-md ring-1 ring-pink-500/30"
                    : "bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-[var(--border-hover,#3f3f4e)]"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-950/80 text-pink-300 border border-pink-800/60 uppercase">
                      {track.category}
                    </span>
                    {isPlaying && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-pink-400 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400" /> Tocando
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white truncate" title={track.title}>
                    {track.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (isThisTrack) {
                        togglePlay();
                      } else {
                        playTrack(track);
                      }
                    }}
                    className={`p-2 rounded-lg font-semibold text-xs cursor-pointer transition-all ${
                      isPlaying
                        ? "bg-pink-600 text-white shadow-xs"
                        : "bg-[var(--bg-input)] text-pink-300 hover:bg-pink-600/30 border border-pink-500/30"
                    }`}
                    title={isPlaying ? "Pausar" : "Tocar"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(track.id)}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Excluir faixa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
