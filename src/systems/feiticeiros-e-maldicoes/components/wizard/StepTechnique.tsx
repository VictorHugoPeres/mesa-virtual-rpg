"use client";

import { useState } from "react";
import { AttributeKey, Origin, Specialization } from "@/systems/feiticeiros-e-maldicoes";
import { WizardSpell } from "./wizardTypes";
import { TechniqueCatalogModal, GuidedSpellBuilderModal } from "../techniques";
import { Level1FeaturePicker } from "./Level1FeaturePicker";
import { MartialTechniquesStepPicker } from "./MartialTechniquesStepPicker";
import { InnateTechniqueSection } from "./InnateTechniqueSection";
import { Swords, Ban } from "lucide-react";

interface StepTechniqueProps {
  origin: Origin;
  specialization?: Specialization;
  techniqueName: string;
  setTechniqueName: (name: string) => void;
  techniqueDesc: string;
  setTechniqueDesc: (desc: string) => void;
  techniqueAttribute: AttributeKey;
  setTechniqueAttribute: (attr: AttributeKey) => void;
  spells: WizardSpell[];
  setSpells: (spells: WizardSpell[]) => void;
  domainExpansion?: {
    name: string;
    type: string;
    cost: number;
    description: string;
  };
  setDomainExpansion?: (de: {
    name: string;
    type: string;
    cost: number;
    description: string;
  } | undefined) => void;
  level1FeatId?: string;
  onSelectLevel1Feat?: (id: string, name: string, type: "talento" | "aptidao", desc: string) => void;
}

export function StepTechnique({
  origin,
  specialization,
  techniqueName,
  setTechniqueName,
  techniqueDesc,
  setTechniqueDesc,
  techniqueAttribute,
  setTechniqueAttribute,
  spells,
  setSpells,
  domainExpansion,
  setDomainExpansion,
  level1FeatId,
  onSelectLevel1Feat,
}: StepTechniqueProps) {
  const isRestringido = origin === "Restringido" || specialization === "Restringido";
  const isSemTecnica = origin === "Sem Técnica";
  const isInato = origin === "Inato";

  const maxSpellsAllowed = isInato ? 3 : 2;

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  function handleApplyFromCatalog(techData: {
    name: string;
    attribute: AttributeKey;
    description: string;
    selectedSpells: any[];
    domainExpansion?: any;
  }) {
    setTechniqueName(techData.name);
    setTechniqueDesc(techData.description);
    setTechniqueAttribute(techData.attribute);

    if (techData.domainExpansion && setDomainExpansion) {
      setDomainExpansion(techData.domainExpansion);
    }

    if (techData.selectedSpells && techData.selectedSpells.length > 0) {
      const converted: WizardSpell[] = techData.selectedSpells.slice(0, maxSpellsAllowed).map((s, idx) => ({
        name: s.name,
        level: s.level,
        cost: isInato && idx === 2 ? Math.max(1, (parseInt(s.cost) || 2) - 1) : parseInt(s.cost) || 2,
        action: s.action || "Ação Padrão",
        range: s.range || "12m",
        description: s.description || "",
      }));
      setSpells(converted);
    }
  }

  function handleSaveFromBuilder(newSpell: any) {
    const cost = isInato && spells.length === 2 ? Math.max(1, newSpell.peCost - 1) : newSpell.peCost;
    const converted: WizardSpell = {
      name: newSpell.name,
      level: newSpell.level,
      cost,
      action: newSpell.action,
      range: newSpell.range,
      description: newSpell.effect,
    };
    setSpells([...spells.slice(0, maxSpellsAllowed - 1), converted]);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-zinc-100">
          {isRestringido
            ? "Passo 5: Estilo Marcial & Técnicas de Vigor"
            : isSemTecnica
            ? "Passo 5: Fundamentos da Energia Amaldiçoada"
            : "Passo 5: Técnica Inata & Feitiços Iniciais"}
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          {isRestringido
            ? "Voto Celestial absoluto: você não possui PE nem feitiços. Defina seu estilo marcial e manobras físicas."
            : isSemTecnica
            ? "Sem Técnica Inata: você manipula energia pura com maestria através de armas e postura marcial."
            : isInato
            ? "Técnica Inata com Marca Registrada (+1 feitiço adicional inicial com custo reduzido em 1 PE)."
            : "Escolha uma técnica oficial ou crie uma técnica inata personalizada com até 2 feitiços iniciais."}
        </p>
      </div>

      {/* Seletor de Talento / Aptidão Amaldiçoada de Nível 1 */}
      {onSelectLevel1Feat && (
        <Level1FeaturePicker
          origin={origin}
          selectedFeatId={level1FeatId}
          onSelectFeat={onSelectLevel1Feat}
        />
      )}

      {/* Caso: Sem Técnica */}
      {isSemTecnica ? (
        <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F] space-y-2">
          <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs">
            <Ban className="w-4 h-4 text-zinc-400" />
            <span>Feiticeiro Sem Técnica Inata</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Seu personagem não possui feitiços inatos. Toda a sua energia amaldiçoada é canalizada através do reforço corporal, ferramentas amaldiçoadas e posturas do Novo Estilo da Sombra.
          </p>
        </div>
      ) : isRestringido ? (
        /* Caso: Restringido */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F] space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Estilo Físico & Arsenal Marcial (0 PE / Alimentado por Estamina)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Nome do Estilo Marcial
                </label>
                <input
                  type="text"
                  value={techniqueName}
                  placeholder="Ex: Combate Fushiguro, Pugilato Desarmado..."
                  onChange={(e) => setTechniqueName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Treinamento Físico
                </label>
                <input
                  type="text"
                  value={techniqueDesc}
                  placeholder="Ex: Treinamento com armas pesadas e reflexos sobre-humanos..."
                  onChange={(e) => setTechniqueDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
                />
              </div>
            </div>
          </div>

          <MartialTechniquesStepPicker
            selectedSpells={spells}
            onChangeSpells={setSpells}
          />
        </div>
      ) : (
        /* Caso Padrão: Técnica Inata & Feitiços */
        <InnateTechniqueSection
          techniqueName={techniqueName}
          setTechniqueName={setTechniqueName}
          techniqueDesc={techniqueDesc}
          setTechniqueDesc={setTechniqueDesc}
          techniqueAttribute={techniqueAttribute}
          setTechniqueAttribute={setTechniqueAttribute}
          spells={spells}
          setSpells={setSpells}
          domainExpansion={domainExpansion}
          maxSpellsAllowed={maxSpellsAllowed}
          isInato={isInato}
          onOpenCatalog={() => setIsCatalogOpen(true)}
          onOpenBuilder={() => setIsBuilderOpen(true)}
        />
      )}

      <TechniqueCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        characterLevel={1}
        maxSpells={maxSpellsAllowed}
        onApplyTechnique={handleApplyFromCatalog}
      />

      <GuidedSpellBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        characterLevel={1}
        currentSpellCount={spells.length}
        maxSpells={maxSpellsAllowed}
        techniqueAttribute={techniqueAttribute}
        onSaveSpell={handleSaveFromBuilder}
      />
    </div>
  );
}
