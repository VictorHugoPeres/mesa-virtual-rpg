"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { Plus, Trash2 } from "lucide-react";

interface FeaturesListProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function FeaturesList({ data, onChange }: FeaturesListProps) {
  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Habilidades de Especialização & Características
        </h3>
        <button
          onClick={() => {
            onChange((prev) => ({
              ...prev,
              features: [
                ...prev.features,
                {
                  id: Math.random().toString(36).substring(2, 9),
                  name: "Nova Característica",
                  current: 0,
                  max: 0,
                  cost: "",
                  description: "",
                },
              ],
            }));
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-rose-400" /> Adicionar Habilidade
        </button>
      </div>

      {data.features.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] py-4 text-center">
          Nenhuma habilidade de especialização ou talento registrado.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.features.map((feat, idx) => (
            <div
              key={feat.id || idx}
              className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={feat.name}
                  placeholder="Nome da Habilidade / Talento"
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange((prev) => {
                      const features = [...prev.features];
                      features[idx] = { ...features[idx], name: val };
                      return { ...prev, features };
                    });
                  }}
                  className="font-semibold text-sm bg-transparent border-b border-transparent focus:border-blue-500 w-full"
                />
                <input
                  type="text"
                  value={feat.cost}
                  placeholder="Custo (ex: 2 PE)"
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange((prev) => {
                      const features = [...prev.features];
                      features[idx] = { ...features[idx], cost: val };
                      return { ...prev, features };
                    });
                  }}
                  className="text-xs text-right text-blue-400 bg-transparent w-28"
                />
                <button
                  onClick={() => {
                    onChange((prev) => ({
                      ...prev,
                      features: prev.features.filter((_, i) => i !== idx),
                    }));
                  }}
                  className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Descrição do efeito..."
                value={feat.description}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange((prev) => {
                    const features = [...prev.features];
                    features[idx] = { ...features[idx], description: val };
                    return { ...prev, features };
                  });
                }}
                className="w-full text-xs p-2 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
