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
  const halfLevel = Math.floor(data.level / 2);
  const calcDC = 10 + halfLevel + prof + techAttrMod;
  const calcAttack = halfLevel + prof + techAttrMod;

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
    <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F]">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-semibold text-zinc-100">Técnica Amaldiçoada & Atributos Mágicos</h3>
        </div>
        <button
          type="button"
          onClick={() => setIsCatalogOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Catálogo de Técnicas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
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
            className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100 font-semibold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
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
            className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
          >
            {ATTRIBUTE_KEYS.map((k) => (
              <option key={k} value={k}>
                {ATTRIBUTE_LABELS[k]} ({k})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
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
            className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
          />
        </div>
      </div>

      {/* Cards de CD e Ataque Mágico Clicável v2.5 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-[#0B0C0E] border border-[#23272F] mb-4">
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-zinc-400">
            CD de Resistência (v2.5)
          </p>
          <p className="text-2xl font-bold text-sky-400">{calcDC}</p>
          <p className="text-[10px] text-zinc-500 font-mono">
            10 + ⌊N/2⌋ (+{halfLevel}) + BT (+{prof}) + Mod ({techAttrMod >= 0 ? `+${techAttrMod}` : techAttrMod})
          </p>
        </div>

        {/* Acerto Mágico Clicável */}
        <button
          type="button"
          onClick={handleRollSpellAttack}
          className="text-center p-1.5 rounded-lg border border-transparent hover:border-emerald-500/50 hover:bg-[#14161A] transition-all cursor-pointer group"
          title="Clique para rolar Acerto Mágico (1d20 + bônus)"
        >
          <div className="flex items-center justify-center gap-1">
            <p className="text-[10px] uppercase font-bold text-zinc-400 group-hover:text-emerald-300">
              Acerto de Feitiço
            </p>
            <Dices className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            {calcAttack >= 0 ? `+${calcAttack}` : calcAttack}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">
            Mod ({techAttrMod >= 0 ? `+${techAttrMod}` : techAttrMod}) + ⌊N/2⌋ (+{halfLevel}) + BT (+{prof})
          </p>
        </button>

        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-zinc-400">
            Bônus de Treino (BT)
          </p>
          <p className="text-2xl font-bold text-zinc-200">+{prof}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Nível {data.level}</p>
        </div>

        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-zinc-400">
            Modificador ({techAttr})
          </p>
          <p className="text-2xl font-bold text-zinc-200">
            {techAttrMod >= 0 ? `+${techAttrMod}` : techAttrMod}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">Valor {data.attributes[techAttr] ?? 10}</p>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
          Descrição & Funcionamento Básico da Técnica
        </label>
        <textarea
          rows={3}
          placeholder="Descreva o conceito, regras e efeito da técnica inata..."
          value={cp.techniqueDesc}
          onChange={(e) => {
            const val = e.target.value;
            onChange((prev) => ({
              ...prev,
              cursedProfile: { ...prev.cursedProfile, techniqueDesc: val },
            }));
          }}
          className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-200 text-xs"
        />
      </div>

      <TechniqueCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onApplyTechnique={handleApplyFromCatalog}
      />
    </div>
  );
}
