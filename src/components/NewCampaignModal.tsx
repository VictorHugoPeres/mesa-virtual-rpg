"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import { Portal } from "@/core/ui";

export function NewCampaignModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [systemId, setSystemId] = useState("feiticeiros-e-maldicoes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), systemId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar campanha");
      }

      const { campaign } = await res.json();
      setName("");
      setIsOpen(false);
      router.refresh();
      router.push(`/mestre/${campaign.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold
                   bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-sm cursor-pointer select-none active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Nova Campanha
      </button>

      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
              <h3 className="text-lg font-semibold">Criar Nova Campanha</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-sm rounded bg-red-950/60 border border-red-800 text-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                  Nome da Campanha
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Incidente de Shibuya, O Ritual Maldito..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]
                             text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-red-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                  Sistema de RPG
                </label>
                <select
                  value={systemId}
                  onChange={(e) => setSystemId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]
                             text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                >
                  <option value="feiticeiros-e-maldicoes">
                    Feiticeiros e Maldições (F&M v2.0)
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-default)]">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Criando..." : "Criar Campanha"}
                </button>
              </div>
            </form>
          </div>
          </div>
        </Portal>
      )}
    </>
  );
}
