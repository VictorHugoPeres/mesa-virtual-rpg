"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, X, Loader2 } from "lucide-react";
import {
  SPECIALIZATIONS,
  ORIGINS,
  Specialization,
  Origin,
} from "@/systems/feiticeiros-e-maldicoes";

export function NewCharacterModal({ campaignId }: { campaignId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"PC" | "NPC">("PC");
  const [specialization, setSpecialization] = useState<Specialization>("Lutador");
  const [origin, setOrigin] = useState<Origin>("Inato");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          specialization,
          origin,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar personagem");
      }

      const { character } = await res.json();
      setName("");
      setIsOpen(false);
      router.refresh();
      // Leva direto para a ficha recém-criada
      router.push(`/mestre/${campaignId}/fichas/${character.id}`);
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
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium
                   bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
      >
        <UserPlus className="w-4 h-4" />
        Novo Personagem
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
              <h3 className="text-lg font-semibold">Criar Personagem</h3>
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
                  Nome do Personagem
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Megumi Fushiguro, Aoi Todo..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]
                             text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                    Tipo
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "PC" | "NPC")}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]
                               text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="PC">Jogador (PC)</option>
                    <option value="NPC">NPC / Ameaça</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                    Origem
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value as Origin)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]
                               text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  >
                    {ORIGINS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                  Especialização Inicial
                </label>
                <select
                  value={specialization}
                  onChange={(e) =>
                    setSpecialization(e.target.value as Specialization)
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]
                             text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                >
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
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
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Criando..." : "Criar Personagem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
