"use client";

import { useState } from "react";
import { Plus, X, Upload, Link2, Loader2, Map as MapIcon, Image as ImageIcon } from "lucide-react";
import { Portal } from "@/core/ui";
import { GalleryMediaPicker } from "./GalleryMediaPicker";

interface AddMapModalProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMapModal({ campaignId, isOpen, onClose, onSuccess }: AddMapModalProps) {
  const [tab, setTab] = useState<"upload" | "url" | "gallery">("upload");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [selectedGalleryUrl, setSelectedGalleryUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [gridSize, setGridSize] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Informe o nome do mapa.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let finalImageUrl = "";

      if (tab === "upload") {
        if (!file) throw new Error("Selecione um arquivo de imagem.");
        const formData = new FormData();
        formData.append("campaignId", campaignId);
        formData.append("title", title.trim());
        formData.append("category", "MAP");
        formData.append("file", file);

        const resUpload = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!resUpload.ok) {
          const data = await resUpload.json().catch(() => ({}));
          throw new Error(data.error || "Erro ao fazer upload da imagem");
        }

        const dataUpload = await resUpload.json();
        if (!dataUpload.media?.url) {
          throw new Error("URL da imagem não retornada pelo servidor.");
        }
        finalImageUrl = dataUpload.media.url;
      } else if (tab === "url") {
        if (!url.trim()) throw new Error("Informe a URL da imagem.");
        finalImageUrl = url.trim();
      } else if (tab === "gallery") {
        if (!selectedGalleryUrl) throw new Error("Selecione uma imagem da galeria.");
        finalImageUrl = selectedGalleryUrl;
      }

      // Cria o registro TacticalMap no SQLite
      const resMap = await fetch(`/api/campaigns/${campaignId}/maps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          imageUrl: finalImageUrl,
          gridSize: Number(gridSize) || 50,
          gridEnabled: true,
          gridColor: "#ffffff",
          gridOpacity: 0.25,
          metersPerGrid: 1.5,
        }),
      });

      if (!resMap.ok) {
        const data = await resMap.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao salvar o mapa.");
      }

      onSuccess();
      onClose();
      setTitle("");
      setUrl("");
      setSelectedGalleryUrl("");
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar mapa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#14161A] border border-[#23272F] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23272F]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapIcon className="w-4 h-4 text-rose-500" /> Adicionar Mapa Tático
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-[#23272F] bg-[#0B0C0E] text-xs">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === "upload"
                ? "border-rose-500 text-rose-400 bg-[#14161A]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === "url"
                ? "border-rose-500 text-rose-400 bg-[#14161A]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" /> Link / URL Web
          </button>
          <button
            type="button"
            onClick={() => setTab("gallery")}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === "gallery"
                ? "border-rose-500 text-rose-400 bg-[#14161A]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Da Galeria
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              Nome do Mapa / Local
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Templo Subterrâneo, Estação de Shibuya..."
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0B0C0E] border border-[#23272F] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] font-medium mb-1">
              Tamanho Inicial da Grade (pixels)
            </label>
            <input
              type="number"
              min="20"
              max="150"
              value={gridSize || 50}
              onChange={(e) => setGridSize(Number(e.target.value) || 50)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          {tab === "upload" && (
            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1">
                Arquivo de Imagem (PNG, JPG, WEBP)
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-white/80 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-600/30 file:text-emerald-300 hover:file:bg-emerald-600/50"
              />
            </div>
          )}

          {tab === "url" && (
            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1">
                URL da Imagem
              </label>
              <input
                type="url"
                required
                placeholder="https://exemplo.com/mapa.jpg"
                value={url || ""}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          )}

          {tab === "gallery" && (
            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1.5">
                Selecione uma imagem já enviada para a campanha:
              </label>
              <GalleryMediaPicker
                campaignId={campaignId}
                selectedUrl={selectedGalleryUrl}
                onSelect={(selectedUrl, itemTitle) => {
                  setSelectedGalleryUrl(selectedUrl);
                  if (!title.trim() && itemTitle) setTitle(itemTitle);
                }}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#23272F]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#23272F] text-zinc-300 hover:text-white hover:bg-[#1A1D24] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-semibold bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-40 cursor-pointer transition-colors shadow-sm"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Criando..." : "Criar Mapa"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
}
