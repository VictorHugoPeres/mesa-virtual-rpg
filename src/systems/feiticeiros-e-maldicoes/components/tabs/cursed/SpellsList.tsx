"use client";

import { useState } from "react";
import { FMCharacterData, SpellDef } from "@/systems/feiticeiros-e-maldicoes";
import { Wand2, Swords } from "lucide-react";
import { useDice } from "@/core/dice/DiceContext";
import { useDialog } from "@/core/ui";
import { SpellRowItem } from "./SpellRowItem";
import { SpellsHeaderControls } from "./SpellsHeaderControls";
import { SpellsModalsManager } from "./SpellsModalsManager";
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
  const isRestringido = data.origin === "Restringido" || data.specialization === "Restringido";
  const cp = data.cursedProfile;
  const maxSpells = getMaxSpellsByCharacterLevel(data.level);

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isMartialOpen, setIsMartialOpen] = useState(false);
  const [isShadowOpen, setIsShadowOpen] = useState(false);

  function handleCastSpell(spell: SpellDef) {
    const currentResource = data.energy?.current ?? 0;
    const resLabel = isRestringido ? "EST" : "PE";
    const resName = isRestringido ? "Estamina" : "PE";

    if (currentResource < spell.peCost) {
      toast.warning(`${resName} Insuficiente! Você possui ${currentResource} ${resLabel}, mas "${spell.name}" requer ${spell.peCost} ${resLabel}.`);
      return;
    }

    const nextEnergy = Math.max(0, currentResource - spell.peCost);
    onChange((prev) => ({
      ...prev,
      energy: { ...prev.energy, current: nextEnergy },
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
          formula: `${spell.peCost} ${resLabel}`,
          rawRoll: `${isRestringido ? "Usou Manobra" : "Conjurou"}: ${spell.name} (-${spell.peCost} ${resLabel})`,
          modifier: 0,
          total: spell.peCost,
          label: `${isRestringido ? "Manobra" : "Feitiço"}: ${spell.name}`,
          isCritical: false,
          isFumble: false,
          showOnTv: true,
        }),
      }).catch((e) => console.warn("Erro ao registrar habilidade:", e));
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

  function handleApplyFromCatalog(techData: any) {
    onChange((prev) => {
      const newSpells: SpellDef[] = techData.selectedSpells.map((s: any) => ({
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
    toast.success(`Técnica "${techData.name}" e feitiços aplicados com sucesso!`);
  }

  function handleSaveFromBuilder(newSpell: any) {
    const spell: SpellDef = { id: generateId("spell"), ...newSpell };
    onChange((prev) => ({
      ...prev,
      cursedProfile: { ...prev.cursedProfile, spells: [...prev.cursedProfile.spells, spell] },
    }));
    toast.success(`Feitiço "${spell.name}" adicionado ao grimório!`);
  }

  function handleAddTechniqueItem(item: any, successMsg: string) {
    onChange((prev) => ({
      ...prev,
      cursedProfile: {
        ...prev.cursedProfile,
        spells: [...prev.cursedProfile.spells, { id: generateId("spell"), ...item }],
      },
    }));
    toast.success(successMsg);
  }

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] space-y-4">
      <SpellsHeaderControls
        isRestringido={isRestringido}
        spellCount={cp.spells.length}
        maxSpells={maxSpells}
        characterLevel={data.level}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenBuilder={() => setIsBuilderOpen(true)}
        onOpenMartial={() => setIsMartialOpen(true)}
        onOpenShadow={() => setIsShadowOpen(true)}
        onAddQuick={() => {
          onChange((prev) => ({
            ...prev,
            cursedProfile: {
              ...prev.cursedProfile,
              spells: [
                ...prev.cursedProfile.spells,
                {
                  id: generateId("spell"),
                  name: isRestringido ? "Nova Manobra" : "Novo Feitiço",
                  level: 1,
                  peCost: 2,
                  action: "Ação Comum",
                  range: isRestringido ? "Corpo a corpo" : "12m",
                  duration: "Instantânea",
                  effect: "",
                },
              ],
            },
          }));
        }}
      />

      {cp.spells.length === 0 ? (
        <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)]/30 rounded-xl space-y-2">
          {isRestringido ? (
            <>
              <Swords className="w-8 h-8 mx-auto opacity-30 stroke-1 text-amber-400" />
              <p className="font-semibold text-[var(--text-secondary)]">Nenhuma manobra cadastrada no arsenal.</p>
              <p>Abra o <strong>Arsenal Marcial</strong> para adicionar golpes e manobras do Restringido Celestial.</p>
            </>
          ) : (
            <>
              <Wand2 className="w-8 h-8 mx-auto opacity-30 stroke-1" />
              <p className="font-semibold text-[var(--text-secondary)]">Nenhum feitiço cadastrado no grimório.</p>
              <p>Utilize o <strong>Catálogo da Obra</strong> para importar feitiços prontos ou crie um novo.</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {cp.spells.map((spell, idx) => (
            <SpellRowItem
              key={spell.id || idx}
              spell={spell}
              index={idx}
              isRestringido={isRestringido}
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

      <SpellsModalsManager
        isCatalogOpen={isCatalogOpen}
        onCloseCatalog={() => setIsCatalogOpen(false)}
        isBuilderOpen={isBuilderOpen}
        onCloseBuilder={() => setIsBuilderOpen(false)}
        isMartialOpen={isMartialOpen}
        onCloseMartial={() => setIsMartialOpen(false)}
        isShadowOpen={isShadowOpen}
        onCloseShadow={() => setIsShadowOpen(false)}
        characterLevel={data.level}
        maxSpells={maxSpells}
        currentSpellCount={cp.spells.length}
        techniqueAttribute={cp.techniqueAttribute}
        onApplyTechnique={handleApplyFromCatalog}
        onSaveSpell={handleSaveFromBuilder}
        onAddMartialTechnique={(tech) => {
          handleAddTechniqueItem(tech, `Manobra "${tech.name}" adicionada ao Arsenal!`);
          setIsMartialOpen(false);
        }}
        onAddShadowTechnique={(spell) => {
          handleAddTechniqueItem(spell, `"${spell.name}" adicionada ao grimório!`);
          setIsShadowOpen(false);
        }}
      />
    </div>
  );
}
