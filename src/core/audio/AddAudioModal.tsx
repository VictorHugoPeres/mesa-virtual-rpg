"use client";

import { useState } from "react";
import { Plus, X, Upload, Link as LinkIcon, Loader2, AlertCircle } from "lucide-react";
import { Portal } from "@/core/ui";

interface AddAudioModalProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultType?: "BGM" | "SFX";
}

export function AddAudioModal({
  campaignId,
  isOpen,
  onClose,
  onSuccess,
  defaultType = "BGM",
}: AddAudioModalProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(defaultType === "SFX" ? "SFX" : "BGM_AMBIENTE");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      if (tab === "upload") {
        if (!file) throw new Error("Selecione um arquivo de áudio.");
        const formData = new FormData();
        formData.append("campaignId", campaignId);
        formData.append("title", title.trim());
        formData.append("category", category);
        formData.append("file", file);

        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro no upload do áudio");
        }
      } else {
        const cleanUrl = url.trim();
        if (!cleanUrl) throw new Error("Informe a URL direta do áudio.");

        // Validação de links de plataformas de vídeo
        if (
          cleanUrl.includes("youtube.com") ||
          cleanUrl.includes("youtu.be") ||
          cleanUrl.includes("tiktok.com") ||
          cleanUrl.includes("instagram.com")
        ) {
          throw new Error(
            "Links de plataformas de vídeo como YouTube não são compatíveis diretamente. Por favor, insira um link direto para um arquivo de áudio (.mp3, .ogg, .wav) ou faça o upload do arquivo local."
          );
        }

        const res = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId,
            title: title.trim(),
            url: cleanUrl,
            category,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao salvar áudio por link");
        }
      }

      onSuccess();
      onClose();
      setTitle("");
      setUrl("");
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar áudio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-default)]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-pink-400" /> Adicionar Faixa ou Efeito
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-secondary)] text-xs">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              tab === "upload"
                ? "border-pink-500 text-pink-400 bg-[var(--bg-card)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Arquivo Local (MP3/OGG/WAV)
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              tab === "url"
                ? "border-pink-500 text-pink-400 bg-[var(--bg-card)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> Link / URL Direta
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-800 text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[var(--text-secondary)] font-medium mb-1">Título</label>
            <input
              type="text"
              required
              placeholder="Ex: Tema de Batalha, Chuva Noturna..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] font-medium mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-900 border border-[var(--border-default)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500 cursor-pointer text-xs"
            >
              <option value="BGM_COMBATE" className="bg-neutral-900 text-white py-1">
                Música: Combate
              </option>
              <option value="BGM_TENSAO" className="bg-neutral-900 text-white py-1">
                Música: Tensão
              </option>
              <option value="BGM_EXPLORACAO" className="bg-neutral-900 text-white py-1">
                Música: Exploração
              </option>
              <option value="BGM_AMBIENTE" className="bg-neutral-900 text-white py-1">
                Música: Ambiente
              </option>
              <option value="BGM_OUTROS" className="bg-neutral-900 text-white py-1">
                Outros
              </option>
              <option value="SFX" className="bg-neutral-900 text-white py-1">
                Efeito Sonoro (SFX)
              </option>
            </select>
          </div>

          {tab === "upload" ? (
            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1">
                Arquivo de Áudio
              </label>
              <input
                type="file"
                accept="audio/mp3,audio/ogg,audio/wav,audio/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-white/80 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-pink-600/30 file:text-pink-300 hover:file:bg-pink-600/50"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1">URL do Áudio</label>
              <input
                type="url"
                required
                placeholder="https://exemplo.com/audio.mp3"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500 text-xs"
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                Insira uma URL direta de áudio como .mp3 ou .ogg. Links de plataformas de vídeo como YouTube não são compatíveis diretamente.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-default)]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-500 disabled:opacity-40"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Salvando..." : "Salvar Áudio"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
}
