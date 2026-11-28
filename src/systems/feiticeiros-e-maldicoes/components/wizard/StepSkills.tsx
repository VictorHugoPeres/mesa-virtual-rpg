"use client";

import { useMemo, useState } from "react";
import { Specialization, Origin, SKILLS_LIST, SkillDef, CRAFT_CATEGORIES, CraftCategory, AttributeKey, getModifier } from "@/systems/feiticeiros-e-maldicoes";
import { SavingThrowPicker } from "./SavingThrowPicker";
import { AttributeSkillBonusSelector } from "./AttributeSkillBonusSelector";
import { SkillItemCard } from "./SkillItemCard";
import { Plus, Trash2, Shield, Wrench } from "lucide-react";

interface StepSkillsProps {
  specialization: Specialization;
  origin: Origin;
  clan?: string;
  attributes: Record<AttributeKey, number>;
  chosenTR?: string;
  setChosenTR: (tr: string) => void;
  skillBonusAttribute: "INT" | "SAB";
  setSkillBonusAttribute: (attr: "INT" | "SAB") => void;
  trainedSkills: string[];
  setTrainedSkills: (skills: string[]) => void;
  expertSkills?: string[];
  setExpertSkills: (skills: string[]) => void;
  craftSkills?: string[];
  setCraftSkills: (crafts: string[]) => void;
}

const SPEC_BASE_DATA: Record<Specialization, { fixed: string[]; free: number }> = {
  Lutador: { fixed: ["Atletismo"], free: 3 },
  "Especialista em Combate": { fixed: ["Atletismo"], free: 4 }, // 3 livres + 1 ofício
  "Especialista em Técnica": { fixed: ["Feitiçaria", "Ocultismo"], free: 2 },
  Controlador: { fixed: ["Percepção", "Persuasão"], free: 2 },
  Suporte: { fixed: ["Medicina", "Prestidigitação"], free: 3 },
  Restringido: { fixed: [], free: 4 },
};

const CLAN_SKILLS: Record<string, string[]> = {
  Gojo: ["Feitiçaria", "Ocultismo"],
  Zenin: ["Atletismo", "Intimidação"],
  Kamo: ["Atletismo", "Medicina"],
  Inumaki: ["Furtividade", "Prestidigitação"],
};

export function StepSkills({
  specialization,
  origin,
  clan,
  attributes,
  chosenTR,
  setChosenTR,
  skillBonusAttribute,
  setSkillBonusAttribute,
  trainedSkills,
  setTrainedSkills,
  expertSkills = [],
  setExpertSkills,
  craftSkills = [],
  setCraftSkills,
}: StepSkillsProps) {
  const [selectedCraftCategory, setSelectedCraftCategory] = useState<CraftCategory>("Ferreiro");
  const [swapClanForExpert, setSwapClanForExpert] = useState(false);

  const specData = SPEC_BASE_DATA[specialization] || { fixed: [], free: 3 };
  const clanSkillsList = origin === "Herdado" && clan && CLAN_SKILLS[clan] ? CLAN_SKILLS[clan] : [];

  // Perícias fixas concedidas automaticamente
  const fixedSkills = useMemo(() => {
    const list = [...specData.fixed];
    if (origin === "Herdado" && !swapClanForExpert) {
      list.push(...clanSkillsList);
    }
    return Array.from(new Set(list));
  }, [specData.fixed, origin, swapClanForExpert, clanSkillsList]);

  // Total de escolhas livres disponíveis
  const totalFreePicks = useMemo(() => {
    let count = specData.free;
    if (origin === "Sem Técnica") count += 2;
    if (origin === "Feiticeiro Reencarnado") count += 2;
    const attrMod = getModifier(attributes[skillBonusAttribute] || 10);
    count += Math.max(0, attrMod);
    return count;
  }, [specData.free, origin, attributes, skillBonusAttribute]);

  // Escolhas gastas (perícias livres treinadas + mestres comprados)
  const userChosenTrained = trainedSkills.filter((s) => !fixedSkills.includes(s));
  const userChosenExperts = expertSkills;
  const spentChoices = userChosenTrained.length + userChosenExperts.length;
  const remainingPicks = totalFreePicks - spentChoices;

  // Toggle treinamento de uma perícia
  function handleToggleSkill(skillName: string) {
    if (specialization === "Restringido" && skillName === "Feitiçaria") return;
    if (fixedSkills.includes(skillName)) return;

    if (trainedSkills.includes(skillName)) {
      setTrainedSkills(trainedSkills.filter((s) => s !== skillName));
      if (expertSkills.includes(skillName)) {
        setExpertSkills(expertSkills.filter((s) => s !== skillName));
      }
    } else if (remainingPicks > 0) {
      setTrainedSkills([...trainedSkills, skillName]);
    }
  }

  // Toggle mestria (Regra de Redundância / Promoção a Mestre no Nível 1)
  function handleToggleExpert(skillName: string) {
    if (expertSkills.includes(skillName)) {
      setExpertSkills(expertSkills.filter((s) => s !== skillName));
    } else if (remainingPicks > 0 || (swapClanForExpert && clanSkillsList.includes(skillName))) {
      setExpertSkills([...expertSkills, skillName]);
    }
  }

  function handleAddCraft() {
    const craftName = `Ofício (${selectedCraftCategory})`;
    if (craftSkills.includes(craftName) || trainedSkills.includes(craftName)) return;
    setCraftSkills([...craftSkills, craftName]);
    if (!trainedSkills.includes(craftName) && remainingPicks > 0) {
      setTrainedSkills([...trainedSkills, craftName]);
    }
  }

  function handleRemoveCraft(craftName: string) {
    setCraftSkills(craftSkills.filter((c) => c !== craftName));
    setTrainedSkills(trainedSkills.filter((s) => s !== craftName));
    setExpertSkills(expertSkills.filter((s) => s !== craftName));
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-zinc-100">Passo 4: Perícias, TRs & Ofícios</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Configure Teste de Resistência, perícias da classe/origem, bônus cognitivo e promoções a Mestre.
        </p>
      </div>

      {/* 1. Testes de Resistência */}
      <SavingThrowPicker
        specialization={specialization}
        chosenTR={chosenTR}
        onSelectTR={setChosenTR}
      />

      {/* 2. Bônus Cognitivo por INT ou SAB (p. 283) */}
      <AttributeSkillBonusSelector
        attributes={attributes}
        selectedAttribute={skillBonusAttribute}
        onSelectAttribute={setSkillBonusAttribute}
      />

      {/* 3. Regra Opcional do Clã Herdado */}
      {origin === "Herdado" && clan && clanSkillsList.length > 0 && (
        <div className="p-3 rounded-xl bg-[#0B0C0E] border border-indigo-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="font-bold text-zinc-200 block">Tradição do Clã {clan}</span>
              <span className="text-[11px] text-zinc-400">
                Garante {clanSkillsList.join(" e ")}. Ou troque ambas por Mestre em 1 delas!
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSwapClanForExpert(!swapClanForExpert)}
            className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
              swapClanForExpert
                ? "bg-amber-950/60 border-amber-500 text-amber-300"
                : "bg-[#14161A] border-[#23272F] text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {swapClanForExpert ? "Mestre Ativado (1 Perícia)" : "Trocar por Mestre"}
          </button>
        </div>
      )}

      {/* Contador de Escolhas e Adição de Ofícios */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#14161A] border border-[#23272F]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-zinc-300">Escolhas Restantes:</span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
            remainingPicks === 0
              ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
              : remainingPicks < 0
              ? "bg-rose-950/80 border border-rose-800 text-rose-300"
              : "bg-[#0B0C0E] border border-sky-800 text-sky-300"
          }`}>
            {spentChoices} / {totalFreePicks} selecionadas ({remainingPicks} disponíveis)
          </span>
        </div>

        {/* Seletor Oficial de Ofício */}
        <div className="flex items-center gap-1.5 bg-[#0B0C0E] border border-[#23272F] p-1 rounded-lg">
          <Wrench className="w-3.5 h-3.5 text-zinc-400 ml-1" />
          <select
            value={selectedCraftCategory}
            onChange={(e) => setSelectedCraftCategory(e.target.value as CraftCategory)}
            className="bg-transparent text-xs text-zinc-200 py-0.5 px-1 focus:outline-none"
          >
            {CRAFT_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#14161A] text-zinc-100">{c}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddCraft}
            className="px-2 py-0.5 text-xs font-bold bg-rose-950/60 border border-rose-800/60 text-rose-300 hover:text-white rounded cursor-pointer"
          >
            <Plus className="w-3 h-3 inline" /> Ofício
          </button>
        </div>
      </div>

      {/* Grid de Perícias Oficiais v2.5 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {/* Perícias Base */}
        {SKILLS_LIST.filter((s) => !s.isSavingThrow).map((skill: SkillDef) => {
          const isTrained = trainedSkills.includes(skill.name) || fixedSkills.includes(skill.name);
          const isExpert = expertSkills.includes(skill.name);
          const isFixed = fixedSkills.includes(skill.name);
          const isRestringidoLocked = specialization === "Restringido" && skill.name === "Feitiçaria";

          return (
            <SkillItemCard
              key={skill.name}
              name={skill.name}
              attribute={skill.attribute}
              isTrained={isTrained}
              isExpert={isExpert}
              isFixed={isFixed}
              isLocked={isRestringidoLocked}
              lockReason="Bloqueado para Restringido"
              canPromoteToExpert={isTrained && remainingPicks > 0}
              onToggle={() => handleToggleSkill(skill.name)}
              onToggleExpert={() => handleToggleExpert(skill.name)}
            />
          );
        })}

        {/* Ofícios Adicionados */}
        {craftSkills.map((craftName) => {
          const isTrained = trainedSkills.includes(craftName);
          const isExpert = expertSkills.includes(craftName);

          return (
            <div key={craftName} className="relative group">
              <SkillItemCard
                name={craftName}
                attribute="INT"
                isTrained={isTrained}
                isExpert={isExpert}
                canPromoteToExpert={isTrained && remainingPicks > 0}
                onToggle={() => handleToggleSkill(craftName)}
                onToggleExpert={() => handleToggleExpert(craftName)}
              />
              <button
                type="button"
                onClick={() => handleRemoveCraft(craftName)}
                className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-950 border border-rose-800 text-rose-300 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover Ofício"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
