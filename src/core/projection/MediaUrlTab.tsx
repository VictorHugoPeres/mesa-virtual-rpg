"use client";

import { useState } from "react";
import { Link2, Image as ImageIcon, Loader2 } from "lucide-react";

interface MediaUrlTabProps {
  campaignId: string;
  onSuccess: () => void;
}

export function MediaUrlTab({ campaignId, onSuccess }: MediaUrlTabProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("SCENE");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          title: title.trim(),
          url: url.trim(),
          category,
        }),
      });

      if (!res.ok) {
        throw new Error("Falha ao salvar mídia");
      }

      setUrl("");
      setTitle("");
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs rounded-lg bg-red-950/40 border border-red-800 text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">
          URL da Imagem
        </label>
        <div className="relative">
          <Link2 className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
          <input
            type="url"
            required
            placeholder="https://exemplo.com/imagem.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">
            Título da Cena / Imagem
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Satoru Gojo, Templo..."
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
        disabled={saving || !url.trim() || !title.trim()}
        className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Salvando Link...
          </>
        ) : (
          <>
            <ImageIcon className="w-4 h-4" /> Salvar Link na Galeria
          </>
        )}
      </button>
    </form>
  );
}
