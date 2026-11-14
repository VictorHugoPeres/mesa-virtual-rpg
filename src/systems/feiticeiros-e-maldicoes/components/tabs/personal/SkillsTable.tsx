"use client";

import { useState } from "react";
import {
  FMCharacterData,
  SKILLS_LIST,
  getProficiencyBonus,
  getSkillBonus,
  calcAttention,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { Dices, Search } from "lucide-react";

interface SkillsTableProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
  characterName?: string;
  characterId?: string;
  campaignId?: string;
}

export function SkillsTable({
  data,
  onChange,
  characterName,
  characterId,
  campaignId,
}: SkillsTableProps) {
  const [skillSearch, setSkillSearch] = useState("");
  const { openRoller } = useDice();
  const profBonus = getProficiencyBonus(data.level);

  const filteredSkills = SKILLS_LIST.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  function handleRollSkill(skillName: string, attr: string, total: number) {
    openRoller({
      label: `Perícia: ${skillName} (${attr})`,
      modifier: total,
      defaultDice: "1d20",
      roller: characterName || "Personagem",
      characterId,
      campaignId,
    });
  }

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Perícias e Testes de Resistência ({SKILLS_LIST.length})
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Total = Mod. Atributo + (se Mt.: +{profBonus}) + (se Es.: +{profBonus * 2}) + Outros (Clique para rolar)
          </p>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar perícia..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] w-48"
          />
        </div>
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
              <th className="py-2 px-3 text-right">Rolar</th>
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
                    <button
                      type="button"
                      onClick={() => handleRollSkill(s.name, s.attribute, total)}
                      className="text-left hover:text-blue-400 hover:underline cursor-pointer flex items-center gap-1.5"
                      title="Clique para rolar esta perícia"
                    >
                      <span>{s.name}</span>
                      {s.requiresTraining && (
                        <span className="text-[9px] text-[var(--text-muted)]" title="Exige Treinamento">
                          *
                        </span>
                      )}
                    </button>
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
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRollSkill(s.name, s.attribute, total)}
                      className={`inline-flex items-center gap-1 font-bold text-xs py-1 px-2 rounded cursor-pointer transition-all ${
                        total > 0
                          ? "text-green-400 bg-green-950/20 hover:bg-green-900/40"
                          : total < 0
                          ? "text-red-400 bg-red-950/20 hover:bg-red-900/40"
                          : "text-[var(--text-muted)] bg-[var(--bg-secondary)] hover:text-white"
                      }`}
                      title={`Rolar 1d20 ${total >= 0 ? `+ ${total}` : `- ${Math.abs(total)}`}`}
                    >
                      <Dices className="w-3 h-3" />
                      <span>{total >= 0 ? `+${total}` : total}</span>
                    </button>
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
