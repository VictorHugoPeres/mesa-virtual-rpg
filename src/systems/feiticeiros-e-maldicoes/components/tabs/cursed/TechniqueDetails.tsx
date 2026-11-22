"use client";

import { useState } from "react";
import {
  FMCharacterData,
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  AttributeKey,
  getModifier,
  getProficiencyBonus,
  SpellDef,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { useDialog } from "@/core/ui";
import { Sparkles, Dices, BookOpen } from "lucide-react";
import { TechniqueCatalogModal } from "../../techniques";
import { generateId } from "@/lib/id";

interface TechniqueDetailsProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
  characterName?: string;
  characterId?: string;
  campaignId?: string;
}

export function TechniqueDetails({
  data,
  onChange,
  characterName,
  characterId,
  campaignId,
}: TechniqueDetailsProps) {
  const { openRoller } = useDice();
  const { toast } = useDialog();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const prof = getProficiencyBonus(data.level);
  const cp = data.cursedProfile;

  const techAttr = (cp.techniqueAttribute || "INT") as AttributeKey;
  const techAttrMod = getModifier(data.attributes[techAttr] ?? 10);
  const calcDC = 8 + prof + techAttrMod;
  const calcAttack = prof + techAttrMod;

  function handleApplyFromCatalog(techData: {
    name: string;
    attribute: any;
    description: string;
    selectedSpells: any[];
  }) {
    onChange((prev) => {
      const newSpells: SpellDef[] = techData.selectedSpells.map((s) => ({
        id: generateId("spell"),
        name: s.name,
        level: s.level,
        peCost: parseInt(s.cost) || (s.level === 0 ? 0 : s.level === 1 ? 2 : 5),
        action: s.action || "Ação Comum",
        range: s.range || "12m",
        duration: s.duration || "Instantânea",
        effect: s.description || "",
      }));

      return {
        ...prev,
        cursedProfile: {
          ...prev.cursedProfile,
          techniqueName: techData.name,
          techniqueDesc: techData.description,
          techniqueAttribute: techData.attribute,
          spells: [...prev.cursedProfile.spells, ...newSpells],
        },
      };
    });
    toast.success(`Técnica "${techData.name}" e feitiços aplicados na ficha!`);
  }

  function handleRollSpellAttack() {
    openRoller({
      label: `Acerto Mágico: ${cp.techniqueName || "Técnica Amaldiçoada"}`,
      modifier: calcAttack,
      defaultDice: "1d20",
      roller: characterName || "Personagem",
      characterId,
      campaignId,
    });
  }

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-semibold">Técnica Amaldiçoada & Atributos Mágicos</h3>
        </div>
        <button
          type="button"
          onClick={() => setIsCatalogOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" /> 📚 Catálogo de Técnicas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Nome da Técnica
          </label>
          <input
            type="text"
            placeholder="Ex: Proporções (7:3), Ilimitado, Manipulação de Maldições..."
            value={cp.techniqueName}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                cursedProfile: { ...prev.cursedProfile, techniqueName: val },
              }));
            }}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Atributo da Técnica
          </label>
          <select
            value={cp.techniqueAttribute}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                cursedProfile: { ...prev.cursedProfile, techniqueAttribute: val },
              }));
            }}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          >
            {ATTRIBUTE_KEYS.map((k) => (
              <option key={k} value={k}>
                {ATTRIBUTE_LABELS[k]} ({k})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Perícia da Técnica
          </label>
          <input
            type="text"
            placeholder="Ex: Feitiçaria, Ocultismo"
            value={cp.techniqueSkill}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                cursedProfile: { ...prev.cursedProfile, techniqueSkill: val },
              }));
            }}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          />
        </div>
      </div>

      {/* Cards de CD e Ataque Mágico Clicável */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] mb-4">
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
            CD de Resistência
          </p>
          <p className="text-2xl font-bold text-blue-400">{calcDC}</p>
          <p className="text-[10px] text-[var(--text-muted)]">
            8 + Maestria (+{prof}) + Mod ({techAttrMod >= 0 ? `+${techAttrMod}` : techAttrMod})
          </p>
        </div>

        {/* Acerto Mágico Clicável */}
        <button
          type="button"
          onClick={handleRollSpellAttack}
          className="text-center p-1.5 rounded-lg border border-transparent hover:border-green-500/50 hover:bg-[var(--bg-card)] transition-all cursor-pointer group"
          title="Clique para rolar Acerto Mágico (1d20 + bônus)"
        >
          <div className="flex items-center justify-center gap-1">
            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] group-hover:text-green-300">
              Acerto de Feitiço
            </p>
            <Dices className="w-3 h-3 text-green-400 opacity-60 group-hover:opacity-100" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            {calcAttack >= 0 ? `+${calcAttack}` : calcAttack}
          </p>
          <p className="text-[10px] text-[var(--text-muted)]">
            1d20 + Maestria (+{prof}) + Mod
          </p>
        </button>

        <div className="text-center col-span-2 flex flex-col justify-center">
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Funcionamento Básico
          </p>
          <p className="text-xs text-[var(--text-secondary)] italic">
            Todo feiticeiro inicia com sua técnica e o funcionamento básico acordado com o Mestre.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Descrição e Regras da Técnica
        </label>
        <textarea
          rows={3}
          placeholder="Descreva as características inatas, condições e restrições da sua técnica..."
          value={cp.techniqueDesc}
          onChange={(e) => {
            const val = e.target.value;
            onChange((prev) => ({
              ...prev,
              cursedProfile: { ...prev.cursedProfile, techniqueDesc: val },
            }));
          }}
          className="w-full text-xs p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        />
      </div>

      <TechniqueCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        characterLevel={data.level}
        maxSpells={4}
        onApplyTechnique={handleApplyFromCatalog}
      />
    </div>
  );
}
