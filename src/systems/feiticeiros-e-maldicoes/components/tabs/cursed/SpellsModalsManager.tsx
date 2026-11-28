"use client";

import {
  TechniqueCatalogModal,
  GuidedSpellBuilderModal,
  MartialTechniquesModal,
  ShadowStyleModal,
} from "../../techniques";

interface SpellsModalsManagerProps {
  isCatalogOpen: boolean;
  onCloseCatalog: () => void;
  isBuilderOpen: boolean;
  onCloseBuilder: () => void;
  isMartialOpen: boolean;
  onCloseMartial: () => void;
  isShadowOpen: boolean;
  onCloseShadow: () => void;
  characterLevel: number;
  maxSpells: number;
  currentSpellCount: number;
  techniqueAttribute: string;
  onApplyTechnique: (techData: any) => void;
  onSaveSpell: (spell: any) => void;
  onAddMartialTechnique: (tech: any) => void;
  onAddShadowTechnique: (spell: any) => void;
}

export function SpellsModalsManager({
  isCatalogOpen,
  onCloseCatalog,
  isBuilderOpen,
  onCloseBuilder,
  isMartialOpen,
  onCloseMartial,
  isShadowOpen,
  onCloseShadow,
  characterLevel,
  maxSpells,
  currentSpellCount,
  techniqueAttribute,
  onApplyTechnique,
  onSaveSpell,
  onAddMartialTechnique,
  onAddShadowTechnique,
}: SpellsModalsManagerProps) {
  return (
    <>
      <TechniqueCatalogModal
        isOpen={isCatalogOpen}
        onClose={onCloseCatalog}
        characterLevel={characterLevel}
        maxSpells={maxSpells}
        onApplyTechnique={onApplyTechnique}
        onApplySpell={onAddShadowTechnique}
      />

      <GuidedSpellBuilderModal
        isOpen={isBuilderOpen}
        onClose={onCloseBuilder}
        characterLevel={characterLevel}
        currentSpellCount={currentSpellCount}
        maxSpells={maxSpells}
        techniqueAttribute={techniqueAttribute as any}
        onSaveSpell={onSaveSpell}
      />

      <MartialTechniquesModal
        isOpen={isMartialOpen}
        onClose={onCloseMartial}
        characterLevel={characterLevel}
        onAddTechnique={onAddMartialTechnique}
      />

      <ShadowStyleModal
        isOpen={isShadowOpen}
        onClose={onCloseShadow}
        characterLevel={characterLevel}
        onApplySpell={onAddShadowTechnique}
      />
    </>
  );
}
