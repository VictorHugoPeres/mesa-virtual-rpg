"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  SPECIALIZATIONS,
  ORIGINS,
  Specialization,
  Origin,
} from "@/systems/feiticeiros-e-maldicoes";

interface QuickCharacterFormProps {
  campaignId: string;
  onClose: () => void;
  onBackToOptions: () => void;
}

export function QuickCharacterForm({
  campaignId,
  onClose,
  onBackToOptions,
}: QuickCharacterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<"PC" | "NPC">("PC");
  const [specialization, setSpecialization] = useState<Specialization>("Lutador");
  const [origin, setOrigin] = useState<Origin>("Inato");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      onClose();
      router.refresh();
      router.push(`/mestre/${campaignId}/fichas/${character.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
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
              <option key={o} value={o}>{o}</option>
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
          onChange={(e) => setSpecialization(e.target.value as Specialization)}
          className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]
                     text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
        >
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[var(--border-default)]">
        <button
          type="button"
          onClick={onBackToOptions}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
        >
          ← Voltar às opções
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
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
      </div>
    </form>
  );
}
