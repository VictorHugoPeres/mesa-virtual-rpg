"use client";

import { useState } from "react";
import { FMCharacterData, SpellDef } from "@/systems/feiticeiros-e-maldicoes";
import { Plus, Sparkles, BookOpen, Wand2 } from "lucide-react";
import { useDice } from "@/core/dice/DiceContext";
import { useDialog } from "@/core/ui";
import { SpellRowItem } from "./SpellRowItem";
import { TechniqueCatalogModal, GuidedSpellBuilderModal } from "../../techniques";
import { getMaxSpellsByCharacterLevel } from "@/systems/feiticeiros-e-maldicoes/data/techniqueCreationRules";
import { generateId } from "@/lib/id";

interface SpellsListProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
  characterName?: string;
  characterId?: string;
  campaignId?: string;
}

export function SpellsList({
  data,
  onChange,
  characterName,
  characterId,
  campaignId,
}: SpellsListProps) {
  const { openRoller } = useDice();
  const { toast } = useDialog();
  const cp = data.cursedProfile;
  const maxSpells = getMaxSpellsByCharacterLevel(data.level);

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  function handleCastSpell(spell: SpellDef) {
    if ((data.energy?.current ?? 0) < spell.peCost) {
      toast.warning(`PE Insuficiente! Você possui ${data.energy?.current ?? 0} PE, mas "${spell.name}" requer ${spell.peCost} PE.`);
      return;
    }

    const nextPE = Math.max(0, (data.energy?.current ?? 0) - spell.peCost);
    onChange((prev) => ({
      ...prev,
      energy: { ...prev.energy, current: nextPE },
    }));

    if (campaignId) {
      fetch("/api/rolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "PHYSICAL",
          campaignId,
          characterId,
          roller: characterName || "Personagem",
          formula: `${spell.peCost} PE`,
          rawRoll: `Conjurou: ${spell.name} (-${spell.peCost} PE)`,
          modifier: 0,
          total: spell.peCost,
          label: `Feitiço: ${spell.name}`,
          isCritical: false,
          isFumble: false,
          showOnTv: true,
        }),
      }).catch((e) => console.warn("Erro ao registrar feitiço:", e));
    }

    const diceMatch = spell.effect?.match(/(\d*d\d+(?:\s*[+-]\s*\d+)?)/i);
    if (diceMatch) {
      openRoller({
        label: `${spell.name} (Efeito/Dano)`,
        modifier: 0,
        defaultDice: diceMatch[1],
        roller: characterName || "Personagem",
        characterId,
        campaignId,
      });
    }
  }

  function handleRollDice(label: string, diceFormula: string) {
    openRoller({
      label,
      modifier: 0,
      defaultDice: diceFormula,
      roller: characterName || "Personagem",
      characterId,
      campaignId,
    });
  }

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
    toast.success(`Técnica "${techData.name}" e feitiços aplicados com sucesso!`);
  }

  function handleSaveFromBuilder(newSpell: {
    name: string;
    level: number;
    peCost: number;
    action: string;
    range: string;
    duration: string;
    effect: string;
  }) {
    const spell: SpellDef = {
      id: generateId("spell"),
      ...newSpell,
    };

    onChange((prev) => ({
      ...prev,
      cursedProfile: {
        ...prev.cursedProfile,
        spells: [...prev.cursedProfile.spells, spell],
      },
    }));
    toast.success(`Feitiço "${spell.name}" adicionado ao grimório!`);
  }

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] space-y-4">
      {/* Header com Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Feitiços & Liberações ({cp.spells.length} / {maxSpells} slots)
            </h3>
            {cp.spells.length >= maxSpells && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                Limite do Nível Atingido
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Golpes, disparos e manifestações da sua técnica amaldiçoada (Nível {data.level})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" /> Catálogo da Obra
          </button>

          <button
            type="button"
            onClick={() => setIsBuilderOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> + Feitiço Guiado (F&M 2.5)
          </button>

          <button
            type="button"
            onClick={() => {
              onChange((prev) => ({
                ...prev,
                cursedProfile: {
                  ...prev.cursedProfile,
                  spells: [
                    ...prev.cursedProfile.spells,
                    {
                      id: generateId("spell"),
                      name: "Novo Feitiço",
                      level: 1,
                      peCost: 2,
                      action: "Ação Comum",
                      range: "12m",
                      duration: "Instantânea",
                      effect: "",
                    },
                  ],
                },
              }));
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
            title="Criar feitiço em branco para preenchimento manual"
          >
            <Plus className="w-3.5 h-3.5" /> Rápido
          </button>
        </div>
      </div>

      {/* Lista de Feitiços */}
      {cp.spells.length === 0 ? (
        <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)]/30 rounded-xl space-y-2">
          <Wand2 className="w-8 h-8 mx-auto opacity-30 stroke-1" />
          <p className="font-semibold text-[var(--text-secondary)]">Nenhum feitiço cadastrado no grimório.</p>
          <p>Utilize o <strong>Catálogo da Obra</strong> para importar feitiços prontos ou o <strong>Construtor Guiado (F&M 2.5)</strong> para criar um novo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cp.spells.map((spell, idx) => (
            <SpellRowItem
              key={spell.id || idx}
              spell={spell}
              index={idx}
              onCast={handleCastSpell}
              onRollDice={handleRollDice}
              onUpdate={(i, updater) => {
                onChange((prev) => {
                  const spells = [...prev.cursedProfile.spells];
                  spells[i] = updater(spells[i]);
                  return { ...prev, cursedProfile: { ...prev.cursedProfile, spells } };
                });
              }}
              onRemove={(i) => {
                onChange((prev) => ({
                  ...prev,
                  cursedProfile: {
                    ...prev.cursedProfile,
                    spells: prev.cursedProfile.spells.filter((_, idx) => idx !== i),
                  },
                }));
              }}
            />
          ))}
        </div>
      )}

      {/* Modais Integrados */}
      <TechniqueCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        characterLevel={data.level}
        maxSpells={maxSpells}
        onApplyTechnique={handleApplyFromCatalog}
      />

      <GuidedSpellBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        characterLevel={data.level}
        currentSpellCount={cp.spells.length}
        maxSpells={maxSpells}
        techniqueAttribute={cp.techniqueAttribute as any}
        onSaveSpell={handleSaveFromBuilder}
      />
    </div>
  );
}
