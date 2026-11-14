"use client";

import { useState } from "react";
import {
  FMCharacterData,
  SKILLS_LIST,
  getProficiencyBonus,
  getSkillBonus,
  calcAttention,
} from "@/systems/feiticeiros-e-maldicoes";

interface SkillsTableProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function SkillsTable({ data, onChange }: SkillsTableProps) {
  const [skillSearch, setSkillSearch] = useState("");
  const profBonus = getProficiencyBonus(data.level);

  const filteredSkills = SKILLS_LIST.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Perícias e Testes de Resistência ({SKILLS_LIST.length})
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Total = Mod. Atributo + (se Mt.: +{profBonus}) + (se Es.: +{profBonus * 2}) + Outros
          </p>
        </div>
        <input
          type="text"
          placeholder="Buscar perícia..."
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] w-48"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
              <th className="py-2 px-3">Perícia</th>
              <th className="py-2 px-2 text-center">Atributo</th>
              <th className="py-2 px-2 text-center" title="Treinado (+Maestria)">
                Mt.
              </th>
              <th className="py-2 px-2 text-center" title="Especialização (+2x Maestria)">
                Es.
              </th>
              <th className="py-2 px-2 text-center">Outros</th>
              <th className="py-2 px-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {filteredSkills.map((s) => {
              const skillData = data.skills[s.name] || {
                trained: false,
                expert: false,
                otherBonus: 0,
              };
              const attrVal = data.attributes[s.attribute] ?? 10;
              const total = getSkillBonus(
                attrVal,
                data.level,
                skillData.trained,
                skillData.expert,
                skillData.otherBonus
              );

              return (
                <tr
                  key={s.name}
                  className="hover:bg-[var(--bg-secondary)]/50 transition-colors"
                >
                  <td className="py-2 px-3 font-medium text-[var(--text-primary)]">
                    {s.name}
                    {s.requiresTraining && (
                      <span className="ml-1 text-[9px] text-[var(--text-muted)]">
                        *
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-[var(--text-muted)] font-mono">
                    {s.attribute}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={skillData.trained}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        onChange((prev) => {
                          const updatedSkills = {
                            ...prev.skills,
                            [s.name]: {
                              ...skillData,
                              trained: checked,
                              expert: checked ? skillData.expert : false,
                            },
                          };
                          const next = { ...prev, skills: updatedSkills };
                          next.attention = calcAttention(next);
                          return next;
                        });
                      }}
                      className="rounded border-[var(--border-default)] accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={skillData.expert}
                      disabled={!skillData.trained}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        onChange((prev) => {
                          const updatedSkills = {
                            ...prev.skills,
                            [s.name]: {
                              ...skillData,
                              expert: checked,
                            },
                          };
                          const next = { ...prev, skills: updatedSkills };
                          next.attention = calcAttention(next);
                          return next;
                        });
                      }}
                      className="rounded border-[var(--border-default)] accent-purple-600 cursor-pointer disabled:opacity-30"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={skillData.otherBonus}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        onChange((prev) => {
                          const updatedSkills = {
                            ...prev.skills,
                            [s.name]: {
                              ...skillData,
                              otherBonus: val,
                            },
                          };
                          const next = { ...prev, skills: updatedSkills };
                          next.attention = calcAttention(next);
                          return next;
                        });
                      }}
                      className="w-12 text-center py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-sm">
                    <span
                      className={
                        total > 0
                          ? "text-green-400"
                          : total < 0
                          ? "text-red-400"
                          : "text-[var(--text-muted)]"
                      }
                    >
                      {total >= 0 ? `+${total}` : total}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
