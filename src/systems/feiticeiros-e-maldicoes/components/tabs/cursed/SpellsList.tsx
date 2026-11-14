"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { Plus, Trash2 } from "lucide-react";

interface SpellsListProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function SpellsList({ data, onChange }: SpellsListProps) {
  const cp = data.cursedProfile;

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Feitiços & Liberações ({cp.spells.length})
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Golpes, disparos e manifestações da sua técnica amaldiçoada
          </p>
        </div>
        <button
          onClick={() => {
            onChange((prev) => ({
              ...prev,
              cursedProfile: {
                ...prev.cursedProfile,
                spells: [
                  ...prev.cursedProfile.spells,
                  {
                    id: Math.random().toString(36).substring(2, 9),
                    name: "Novo Feitiço",
                    level: 1,
                    peCost: 2,
                    action: "Ação Padrão",
                    range: "9m",
                    duration: "Instantânea",
                    effect: "",
                  },
                ],
              },
            }));
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Novo Feitiço
        </button>
      </div>

      {cp.spells.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] py-6 text-center">
          Nenhum feitiço cadastrado. Clique no botão acima para adicionar um feitiço de nível 0 a 5.
        </p>
      ) : (
        <div className="space-y-3">
          {cp.spells.map((spell, idx) => (
            <div
              key={spell.id || idx}
              className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
                    Nome do Feitiço
                  </label>
                  <input
                    type="text"
                    value={spell.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange((prev) => {
                        const spells = [...prev.cursedProfile.spells];
                        spells[idx] = { ...spells[idx], name: val };
                        return {
                          ...prev,
                          cursedProfile: { ...prev.cursedProfile, spells },
                        };
                      });
                    }}
                    className="w-full px-2.5 py-1 text-sm font-semibold rounded bg-[var(--bg-card)] border border-[var(--border-default)]"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
                    Círculo / Nível
                  </label>
                  <select
                    value={spell.level}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      onChange((prev) => {
                        const spells = [...prev.cursedProfile.spells];
                        spells[idx] = { ...spells[idx], level: val };
                        return {
                          ...prev,
                          cursedProfile: { ...prev.cursedProfile, spells },
                        };
                      });
                    }}
                    className="w-full px-2 py-1 text-xs rounded bg-[var(--bg-card)] border border-[var(--border-default)]"
                  >
                    {[0, 1, 2, 3, 4, 5].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Nível {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
                    Custo (PE)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={spell.peCost}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      onChange((prev) => {
                        const spells = [...prev.cursedProfile.spells];
                        spells[idx] = { ...spells[idx], peCost: val };
                        return {
                          ...prev,
                          cursedProfile: { ...prev.cursedProfile, spells },
                        };
                      });
                    }}
                    className="w-full text-center px-2 py-1 text-xs font-bold text-blue-400 rounded bg-[var(--bg-card)] border border-[var(--border-default)]"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
                    Execução
                  </label>
                  <input
                    type="text"
                    placeholder="Ação Padrão, Bônus..."
                    value={spell.action}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange((prev) => {
                        const spells = [...prev.cursedProfile.spells];
                        spells[idx] = { ...spells[idx], action: val };
                        return {
                          ...prev,
                          cursedProfile: { ...prev.cursedProfile, spells },
                        };
                      });
                    }}
                    className="w-full px-2 py-1 text-xs rounded bg-[var(--bg-card)] border border-[var(--border-default)]"
                  />
                </div>

                <div className="flex items-end justify-between gap-2">
                  <div className="flex-1">
                    <label className="block text-[9px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
                      Alcance
                    </label>
                    <input
                      type="text"
                      placeholder="9m, Toque..."
                      value={spell.range}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const spells = [...prev.cursedProfile.spells];
                          spells[idx] = { ...spells[idx], range: val };
                          return {
                            ...prev,
                            cursedProfile: { ...prev.cursedProfile, spells },
                          };
                        });
                      }}
                      className="w-full px-2 py-1 text-xs rounded bg-[var(--bg-card)] border border-[var(--border-default)]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onChange((prev) => ({
                        ...prev,
                        cursedProfile: {
                          ...prev.cursedProfile,
                          spells: prev.cursedProfile.spells.filter((_, i) => i !== idx),
                        },
                      }));
                    }}
                    className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Descrição do efeito, dano, teste de resistência exigido..."
                  value={spell.effect}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange((prev) => {
                      const spells = [...prev.cursedProfile.spells];
                      spells[idx] = { ...spells[idx], effect: val };
                      return {
                        ...prev,
                        cursedProfile: { ...prev.cursedProfile, spells },
                      };
                    });
                  }}
                  className="w-full text-xs p-2.5 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
