"use client";

import { useState } from "react";
import {
  FMCharacterData,
  SKILLS_LIST,
  CRAFT_CATEGORIES,
  CraftCategory,
  getProficiencyBonus,
  getSkillBonus,
  calcAttention,
  AttributeKey,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { useDialog } from "@/core/ui";
import { Search, Plus, Trash2, Hammer } from "lucide-react";

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
  const [selectedCraft, setSelectedCraft] = useState<CraftCategory>("Ferreiro");
  const { openRoller } = useDice();
  const { toast } = useDialog();
  const profBonus = getProficiencyBonus(data.level);
  const halfLevel = Math.floor(data.level / 2);

  // Perícias base v2.5 + Ofícios customizados cadastrados na ficha
  const customCrafts = Object.keys(data.skills || {})
    .filter((k) => (k.startsWith("Ofício:") || k.startsWith("Ofício (")) && !SKILLS_LIST.some((s) => s.name === k))
    .map((name) => ({ name, attribute: "INT" as AttributeKey, requiresTraining: true, isSavingThrow: false, isCustom: true }));

  // Ofícios no topo da lista para visibilidade imediata
  const allSkills = [...customCrafts, ...SKILLS_LIST];
  const filteredSkills = allSkills.filter((s) => s.name.toLowerCase().includes(skillSearch.toLowerCase()));

  function handleRollSkill(skillName: string, attr: AttributeKey, total: number) {
    openRoller({
      label: `Perícia: ${skillName} (${attr})`,
      modifier: total,
      defaultDice: "1d20",
      roller: characterName || "Personagem",
      characterId,
      campaignId,
    });
  }

  function handleAddCraft() {
    const craftName = `Ofício (${selectedCraft})`;
    const altName = `Ofício: ${selectedCraft}`;
    if (data.skills[craftName] || data.skills[altName]) {
      toast.info(`Ofício (${selectedCraft}) já está na ficha`);
      return;
    }
    onChange((prev) => {
      const skills = {
        ...prev.skills,
        [craftName]: { trained: true, expert: false, otherBonus: 0 },
      };
      const next = { ...prev, skills };
      next.attention = calcAttention(next);
      return next;
    });
    toast.success(`Ofício (${selectedCraft}) adicionado com sucesso!`);
  }

  function handleRemoveCraft(craftName: string) {
    onChange((prev) => {
      const skills = { ...prev.skills };
      delete skills[craftName];
      const next = { ...prev, skills };
      next.attention = calcAttention(next);
      return next;
    });
    toast.info(`${craftName} removido da ficha`);
  }

  function updateSkill(skillName: string, updates: Partial<{ trained: boolean; expert: boolean; otherBonus: number }>) {
    const current = data.skills[skillName] || { trained: false, expert: false, otherBonus: 0 };
    onChange((prev) => {
      const updated = { ...prev.skills, [skillName]: { ...current, ...updates } };
      const next = { ...prev, skills: updated };
      next.attention = calcAttention(next);
      return next;
    });
  }

  return (
    <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
            Perícias e Testes de Resistência ({allSkills.length})
          </h3>
          <p className="text-xs text-zinc-400 font-mono">
            Mod + ⌊N/2⌋ (+{halfLevel}) + Treino (+{profBonus}) / Mestre (+{profBonus + Math.floor(profBonus / 2)}) + Outros
          </p>
        </div>

        {/* Barra de Busca e Seletor de Ofício */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar perícia..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100 w-36 sm:w-44"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0B0C0E] border border-[#23272F] p-0.5 rounded-lg">
            <select
              value={selectedCraft}
              onChange={(e) => setSelectedCraft(e.target.value as CraftCategory)}
              className="bg-transparent text-xs text-zinc-200 py-1 px-1.5 focus:outline-none"
            >
              {CRAFT_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#14161A] text-zinc-100">{c}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddCraft}
              className="px-2 py-1 text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 rounded flex items-center gap-1 cursor-pointer transition-colors"
              title="Adicionar subcategoria oficial de Ofício"
            >
              <Plus className="w-3 h-3" /> Ofício
            </button>
          </div>
        </div>
      </div>

      {/* Destaque Imediato: Mini-seção de Ofícios do Personagem */}
      {customCrafts.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-[#0B0C0E] border border-[#23272F]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5" /> Ofícios do Personagem ({customCrafts.length})
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">INT • Requer Treinamento</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {customCrafts.map((craft) => {
              const skillData = data.skills[craft.name] || { trained: true, expert: false, otherBonus: 0 };
              const attrVal = data.attributes.INT ?? 10;
              const total = getSkillBonus(attrVal, data.level, skillData.trained, skillData.expert, skillData.otherBonus, { attributeKey: "INT", origin: data.origin });
              const totalStr = total >= 0 ? `+${total}` : `${total}`;

              return (
                <div key={craft.name} className="p-2.5 rounded-lg bg-[#14161A] border border-[#23272F] flex items-center justify-between gap-2 shadow-xs">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-zinc-200 block truncate">{craft.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {skillData.expert ? "Mestre (1.5x BT)" : "Treinado (+BT)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRollSkill(craft.name, "INT", total)}
                      className="px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 font-bold text-xs cursor-pointer transition-colors"
                      title="Rolar Teste de Ofício"
                    >
                      {totalStr}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveCraft(craft.name)}
                      className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer transition-colors"
                      title="Remover Ofício"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabela Geral de Perícias e TRs */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#23272F] text-zinc-400 uppercase tracking-wider text-[10px]">
              <th className="py-2 px-3">Perícia / Teste de Resistência</th>
              <th className="py-2 px-2 text-center">Atributo</th>
              <th className="py-2 px-2 text-center" title="Treinado (+BT)">Treinado (+{profBonus})</th>
              <th className="py-2 px-2 text-center" title="Mestre (1,5x BT)">Mestre (+{profBonus + Math.floor(profBonus / 2)})</th>
              <th className="py-2 px-2 text-center">Outros</th>
              <th className="py-2 px-3 text-right">Rolar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23272F]">
            {filteredSkills.map((s) => {
              const skillData = data.skills[s.name] || { trained: false, expert: false, otherBonus: 0 };
              const attrVal = data.attributes[s.attribute] ?? 10;
              const total = getSkillBonus(attrVal, data.level, skillData.trained, skillData.expert, skillData.otherBonus, { attributeKey: s.attribute, origin: data.origin });

              return (
                <tr key={s.name} className={`hover:bg-[#1A1D24]/50 transition-colors ${s.isCustom ? "bg-amber-950/10" : ""}`}>
                  <td className="py-2 px-3 font-medium text-zinc-200">
                    <div className="flex items-center gap-1.5">
                      {s.isCustom ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300">
                          OFÍCIO
                        </span>
                      ) : s.isSavingThrow ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-950/50 border border-sky-800/50 text-sky-400">
                          TR
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleRollSkill(s.name, s.attribute, total)}
                        className="text-left hover:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
                        title="Clique para rolar"
                      >
                        <span>{s.name}</span>
                        {s.requiresTraining && (
                          <span className="text-[10px] text-rose-400 font-bold" title="Requer Treinamento">*</span>
                        )}
                      </button>
                      {s.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCraft(s.name)}
                          className="text-zinc-500 hover:text-rose-400 p-0.5 cursor-pointer ml-1 transition-colors"
                          title="Remover este Ofício"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center text-zinc-400 font-mono">{s.attribute}</td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={skillData.trained}
                      onChange={(e) => updateSkill(s.name, { trained: e.target.checked, expert: e.target.checked ? skillData.expert : false })}
                      className="rounded border-[#23272F] accent-rose-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={skillData.expert}
                      disabled={!skillData.trained}
                      onChange={(e) => updateSkill(s.name, { expert: e.target.checked })}
                      className="rounded border-[#23272F] accent-rose-600 cursor-pointer disabled:opacity-20"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={skillData.otherBonus}
                      onChange={(e) => updateSkill(s.name, { otherBonus: parseInt(e.target.value) || 0 })}
                      className="w-12 text-center py-0.5 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
                    />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRollSkill(s.name, s.attribute, total)}
                      className={`inline-flex items-center gap-1 font-bold text-xs py-1 px-2 rounded cursor-pointer transition-colors ${
                        total > 0
                          ? "text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/40"
                          : total < 0
                          ? "text-rose-400 bg-rose-950/20 hover:bg-rose-900/40"
                          : "text-zinc-400 bg-[#0B0C0E] hover:text-white"
                      }`}
                      title={`Rolar 1d20 ${total >= 0 ? `+ ${total}` : `- ${Math.abs(total)}`}`}
                    >
                      {total >= 0 ? `+${total}` : total}
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
