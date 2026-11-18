"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Check } from "lucide-react";

export interface GalleryMediaItem {
  id: string;
  title: string;
  url: string;
  category?: string;
}

interface GalleryMediaPickerProps {
  campaignId: string;
  selectedUrl?: string;
  onSelect: (url: string, title?: string) => void;
}

export function GalleryMediaPicker({
  campaignId,
  selectedUrl,
  onSelect,
}: GalleryMediaPickerProps) {
  const [items, setItems] = useState<GalleryMediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/media?campaignId=${campaignId}&type=image`);
        if (!res.ok) throw new Error("Erro ao buscar imagens da galeria");
        const data = await res.json();
        setItems(data.media || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="py-8 text-center text-xs text-zinc-400">
        Carregando imagens da galeria...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center text-xs text-red-400">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-zinc-400">
        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30 text-emerald-400" />
        Nenhuma imagem salva na galeria desta campanha ainda.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
      {items.map((item) => {
        const isSelected = selectedUrl === item.url;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.url, item.title)}
            className={`group relative flex flex-col rounded-xl overflow-hidden border text-left transition-all cursor-pointer ${
              isSelected
                ? "border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-950/20"
                : "border-white/10 hover:border-white/30 bg-zinc-900"
            }`}
          >
            <div className="w-full h-24 bg-zinc-950 overflow-hidden relative">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-600 text-white shadow">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-[11px] font-bold text-white truncate group-hover:text-emerald-400">
                {item.title}
              </p>
              {item.category && (
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono">
                  {item.category}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
