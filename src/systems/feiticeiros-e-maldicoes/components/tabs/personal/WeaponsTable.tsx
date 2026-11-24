"use client";

import {
  FMCharacterData,
  getProficiencyBonus,
  calcAttackBonus,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { Plus, Trash2, Swords } from "lucide-react";

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
  const prof = getProficiencyBonus(data.level);
  const halfLevel = Math.floor(data.level / 2);

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
    <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
            Registro Rápido de Armas & Ataques
          </h3>
          <p className="text-xs text-zinc-400 font-mono">
            Acerto v2.5 = Mod. Atributo + ⌊N/2⌋ (+{halfLevel}) + (se proficiente: BT +{prof})
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const initialBonus = calcAttackBonus(data.attributes["FOR"] ?? 10, data.level, true);
            onChange((prev) => ({
              ...prev,
              weapons: [
                ...prev.weapons,
                {
                  name: "Nova Arma",
                  attackBonus: initialBonus,
                  damage: "1d6",
                  critical: "20",
                  damageType: "Impacto",
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
        <p className="text-xs text-zinc-400 py-4 text-center">
          Nenhuma arma cadastrada. Clique em &quot;Adicionar Arma&quot;.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#23272F] text-zinc-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2">Arma</th>
                <th className="py-2 px-2 text-center" title="Bônus de Acerto total da jogada de ataque">Acerto</th>
                <th className="py-2 px-2">Dano</th>
                <th className="py-2 px-2 text-center">Crítico</th>
                <th className="py-2 px-2">Tipo</th>
                <th className="py-2 px-2">Alcance</th>
                <th className="py-2 px-2 text-center">Rolagens</th>
                <th className="py-2 px-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23272F]">
              {data.weapons.map((w, idx) => (
                <tr key={idx} className="hover:bg-[#1A1D24]/50 transition-colors">
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
                      className="w-full px-2 py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100 font-medium"
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
                      className="w-14 text-center py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-emerald-400 font-bold"
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
                      className="w-24 px-2 py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100 font-mono"
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
                      className="w-14 text-center py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-300 font-mono"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={w.damageType}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const weapons = [...prev.weapons];
                          weapons[idx] = { ...weapons[idx], damageType: val };
                          return { ...prev, weapons };
                        });
                      }}
                      className="w-20 px-2 py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-300 text-xs"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={w.range}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const weapons = [...prev.weapons];
                          weapons[idx] = { ...weapons[idx], range: val };
                          return { ...prev, weapons };
                        });
                      }}
                      className="w-24 px-2 py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-300 text-xs"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex gap-1 justify-center">
                      <button
                        type="button"
                        onClick={() => handleRollAttack(w.name, w.attackBonus, w.damage)}
                        className="px-2 py-1 text-[11px] rounded bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                        title="Rolar Jogada de Ataque (1d20 + acerto)"
                      >
                        Ataque ({w.attackBonus >= 0 ? `+${w.attackBonus}` : w.attackBonus})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRollDamage(w.name, w.damage)}
                        className="px-2 py-1 text-[11px] rounded bg-[#1A1D24] hover:bg-[#23272F] border border-[#23272F] text-rose-300 font-bold cursor-pointer"
                        title="Rolar Dano da Arma"
                      >
                        Dano
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        onChange((prev) => ({
                          ...prev,
                          weapons: prev.weapons.filter((_, i) => i !== idx),
                        }));
                      }}
                      className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      title="Excluir arma"
                    >
                      <Trash2 className="w-4 h-4" />
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
