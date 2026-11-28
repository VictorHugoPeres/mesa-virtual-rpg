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
import { Sparkles, BookOpen, Shield, Swords } from "lucide-react";
import { TechniqueCatalogModal, ShadowStyleModal } from "../../techniques";
import { MagicStatsGrid } from "./MagicStatsGrid";
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
  const [isShadowOpen, setIsShadowOpen] = useState(false);
  const isRestringido = data.origin === "Restringido" || data.specialization === "Restringido";
  const isSemTecnica = data.origin === "Sem Técnica";
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
    domainExpansion?: any;
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

      const domain = techData.domainExpansion
        ? {
            name: techData.domainExpansion.name,
            type: techData.domainExpansion.type,
            cost: techData.domainExpansion.cost,
            description: techData.domainExpansion.description,
          }
        : prev.cursedProfile.domainExpansion;

      return {
        ...prev,
        cursedProfile: {
          ...prev.cursedProfile,
          techniqueName: techData.name,
          techniqueDesc: techData.description,
          techniqueAttribute: techData.attribute,
          spells: [...prev.cursedProfile.spells, ...newSpells],
          domainExpansion: domain,
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
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          {isRestringido ? (
            <Swords className="w-5 h-5 text-amber-400" />
          ) : (
            <Sparkles className="w-5 h-5 text-rose-400" />
          )}
          <h3 className="text-base font-semibold text-zinc-100">
            {isRestringido
              ? "Estilo Físico & Habilidades Marciais"
              : isSemTecnica
              ? "Fundamentos de Energia & Estilo da Sombra"
              : "Técnica Amaldiçoada & Atributos Mágicos"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsShadowOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer shadow-xs active:scale-95 ${
              isSemTecnica
                ? "bg-indigo-950/40 hover:bg-indigo-900/50 border-indigo-500/40 text-indigo-300 hover:text-white"
                : "bg-[#14161A] hover:bg-[#1A1D24] border-[#23272F] hover:border-white/20 text-zinc-300 hover:text-white"
            }`}
            title="Consultar posturas e técnicas do Novo Estilo da Sombra"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" /> Estilo da Sombra
          </button>

          {!isRestringido && (
            <button
              type="button"
              onClick={() => setIsCatalogOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Catálogo de Técnicas
            </button>
          )}
        </div>
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

      {/* Cards de CD e Ataque Mágico Clicável v2.5 / Estilo do Restringido */}
      <MagicStatsGrid
        level={data.level}
        calcDC={calcDC}
        calcAttack={calcAttack}
        halfLevel={halfLevel}
        prof={prof}
        techAttr={techAttr}
        techAttrMod={techAttrMod}
        techAttrValue={data.attributes[techAttr] ?? 10}
        isRestringido={isRestringido}
        onRollSpellAttack={handleRollSpellAttack}
      />

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

      <ShadowStyleModal
        isOpen={isShadowOpen}
        onClose={() => setIsShadowOpen(false)}
        characterLevel={data.level}
        onApplySpell={(spell) => {
          onChange((prev) => ({
            ...prev,
            cursedProfile: {
              ...prev.cursedProfile,
              spells: [
                ...prev.cursedProfile.spells,
                {
                  id: generateId("spell"),
                  ...spell,
                },
              ],
            },
          }));
          toast.success(`"${spell.name}" adicionada aos feitiços/habilidades!`);
          setIsShadowOpen(false);
        }}
      />
    </div>
  );
}
