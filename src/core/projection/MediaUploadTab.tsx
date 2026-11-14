"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";

interface MediaUploadTabProps {
  campaignId: string;
  onSuccess: () => void;
}

export function MediaUploadTab({ campaignId, onSuccess }: MediaUploadTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("SCENE");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      if (!title) {
        // Sugere o nome do arquivo sem extensão como título
        const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("campaignId", campaignId);
      formData.append("title", title.trim());
      formData.append("category", category);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Falha ao realizar upload da imagem");
      }

      setFile(null);
      setPreview(null);
      setTitle("");
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs rounded-lg bg-red-950/40 border border-red-800 text-red-300">
          {error}
        </div>
      )}

      {/* Área de Seleção de Arquivo */}
      <div className="border-2 border-dashed border-[var(--border-default)] hover:border-blue-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[var(--bg-secondary)]/50">
        <label className="cursor-pointer block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? (
            <div className="relative aspect-video max-h-48 mx-auto rounded-lg overflow-hidden bg-black/40">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center gap-2">
              <UploadCloud className="w-10 h-10 text-[var(--text-muted)]" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Clique para selecionar uma imagem do seu computador
              </p>
              <p className="text-[10px] text-[var(--text-muted)]">
                PNG, JPG, WEBP, GIF (Armazenado localmente)
              </p>
            </div>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">
            Título da Cena / Imagem
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Ryomen Sukuna, Estação Shibuya..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          >
            <option value="SCENE">Cena / Cenário</option>
            <option value="NPC">NPC / Ameaça</option>
            <option value="MAP">Mapa</option>
            <option value="HANDOUT">Documento / Pista</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading || !file || !title.trim()}
        className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Salvando Imagem...
          </>
        ) : (
          <>
            <ImageIcon className="w-4 h-4" /> Salvar na Galeria
          </>
        )}
      </button>
    </form>
  );
}
