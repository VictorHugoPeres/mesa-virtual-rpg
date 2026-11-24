"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { Plus, Trash2, Swords, Sparkles } from "lucide-react";

interface WeaponsTableProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
  characterName?: string;
  characterId?: string;
  campaignId?: string;
}

export function WeaponsTable({
  data,
  onChange,
  characterName,
  characterId,
  campaignId,
}: WeaponsTableProps) {
  const { openRoller } = useDice();

  function handleRollAttack(name: string, bonus: number, damage?: string) {
    openRoller({
      label: `Ataque: ${name}`,
      modifier: bonus,
      defaultDice: "1d20",
      roller: characterName || "Personagem",
      characterId,
      campaignId,
      linkedDamage: damage?.trim() || undefined,
    });
  }

  function handleRollDamage(name: string, damageFormula: string) {
    openRoller({
      label: `Dano: ${name}`,
      modifier: 0,
      defaultDice: damageFormula.trim() || "1d6",
      roller: characterName || "Personagem",
      characterId,
      campaignId,
    });
  }

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Registro Rápido de Armas & Ataques
        </h3>
        <button
          onClick={() => {
            onChange((prev) => ({
              ...prev,
              weapons: [
                ...prev.weapons,
                {
                  name: "Nova Arma",
                  attackBonus: 0,
                  damage: "1d6",
                  critical: "20",
                  damageType: "Físico",
                  range: "Corpo a corpo",
                },
              ],
            }));
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-rose-400" /> Adicionar Arma
        </button>
      </div>

      {data.weapons.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] py-4 text-center">
          Nenhuma arma cadastrada. Clique em &quot;Adicionar Arma&quot;.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-default)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2">Arma</th>
                <th className="py-2 px-2 text-center">Acerto</th>
                <th className="py-2 px-2">Dano</th>
                <th className="py-2 px-2 text-center">Crítico</th>
                <th className="py-2 px-2">Tipo</th>
                <th className="py-2 px-2">Alcance</th>
                <th className="py-2 px-2 text-center">Rolagens</th>
                <th className="py-2 px-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {data.weapons.map((w, idx) => (
                <tr key={idx} className="hover:bg-[var(--bg-secondary)]/50">
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={w.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const weapons = [...prev.weapons];
                          weapons[idx] = { ...weapons[idx], name: val };
                          return { ...prev, weapons };
                        });
                      }}
                      className="w-full px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] font-medium"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={w.attackBonus}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        onChange((prev) => {
                          const weapons = [...prev.weapons];
                          weapons[idx] = { ...weapons[idx], attackBonus: val };
                          return { ...prev, weapons };
                        });
                      }}
                      className="w-14 text-center py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-green-400 font-bold"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Ex: 1d8+3"
                      value={w.damage}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const weapons = [...prev.weapons];
                          weapons[idx] = { ...weapons[idx], damage: val };
                          return { ...prev, weapons };
                        });
                      }}
                      className="w-24 px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] font-mono"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="text"
                      value={w.critical}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const weapons = [...prev.weapons];
                          weapons[idx] = { ...weapons[idx], critical: val };
                          return { ...prev, weapons };
                        });
                      }}
                      className="w-14 text-center py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Ex: Cortante"
                      value={w.damageType}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const weapons = [...prev.weapons];
                          weapons[idx] = { ...weapons[idx], damageType: val };
                          return { ...prev, weapons };
                        });
                      }}
                      className="w-20 px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Ex: 9m"
                      value={w.range}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const weapons = [...prev.weapons];
                          weapons[idx] = { ...weapons[idx], range: val };
                          return { ...prev, weapons };
                        });
                      }}
                      className="w-20 px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRollAttack(w.name, w.attackBonus, w.damage)}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-blue-900/40 border border-blue-700/60 text-blue-300 hover:bg-blue-800/60 transition-all cursor-pointer flex items-center gap-1"
                        title="Rolar Ataque (1d20 + bônus)"
                      >
                        <Swords className="w-3 h-3" /> Acerto
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRollDamage(w.name, w.damage)}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-rose-900/40 border border-rose-700/60 text-rose-300 hover:bg-rose-800/60 transition-all cursor-pointer flex items-center gap-1"
                        title="Rolar Dano da Arma"
                      >
                        <Sparkles className="w-3 h-3" /> Dano
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => {
                        onChange((prev) => ({
                          ...prev,
                          weapons: prev.weapons.filter((_, i) => i !== idx),
                        }));
                      }}
                      className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
