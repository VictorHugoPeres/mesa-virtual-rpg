"use client";

import { useState } from "react";
import { AttributeKey, Origin, Specialization, ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from "@/systems/feiticeiros-e-maldicoes";
import { WizardSpell } from "./wizardTypes";
import { TechniqueCatalogModal, GuidedSpellBuilderModal } from "../techniques";
import { WizardSpellCard } from "./WizardSpellCard";
import { Level1FeaturePicker } from "./Level1FeaturePicker";
import { Wand2, BookOpen, Plus, Sparkles, Swords, Ban } from "lucide-react";

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
  }) {
    setTechniqueName(techData.name);
    setTechniqueDesc(techData.description);
    setTechniqueAttribute(techData.attribute);

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

  function updateSpell(index: number, field: keyof WizardSpell, value: string | number) {
    const updated = [...spells];
    updated[index] = { ...updated[index], [field]: value };
    setSpells(updated);
  }

  function removeSpell(index: number) {
    if (spells.length <= 1) return;
    setSpells(spells.filter((_, i) => i !== index));
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
        <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F] space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <Swords className="w-4 h-4 text-amber-400" />
            <span>Estilo Físico e Manobras Marciais (0 PE / Estamina)</span>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300 uppercase">
              Nome do Estilo Marcial
            </label>
            <input
              type="text"
              value={techniqueName}
              placeholder="Ex: Caçador Fushiguro, Pugilato Desarmado..."
              onChange={(e) => setTechniqueName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
            />
            <label className="block text-xs font-semibold text-zinc-300 uppercase mt-2">
              Descrição do Treinamento Físico
            </label>
            <textarea
              rows={2}
              value={techniqueDesc}
              placeholder="Descreva seu rigoroso treinamento físico e como utiliza armas amaldiçoadas..."
              onChange={(e) => setTechniqueDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100 resize-none"
            />
          </div>
        </div>
      ) : (
        /* Caso Padrão: Técnica Inata & Feitiços */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsCatalogOpen(true)}
              className="p-3.5 rounded-xl border border-rose-900/40 bg-rose-950/20 hover:bg-rose-900/30 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 text-rose-400 font-bold text-xs mb-1">
                <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>📚 Escolher Técnica Pronta</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Explore o catálogo completo com as técnicas canônicas (Ilimitado, Santuário, Dez Sombras, etc.).
              </p>
            </button>

            <button
              type="button"
              onClick={() => setIsBuilderOpen(true)}
              className="p-3.5 rounded-xl border border-purple-900/40 bg-purple-950/20 hover:bg-purple-900/30 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 text-purple-400 font-bold text-xs mb-1">
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>✨ Criar Feitiço Guiado v2.5</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Monte feitiços personalizados com validação ao vivo de custos em PE e efeitos.
              </p>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F] space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Nome da Técnica
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ilimitado, Manipulação de Sangue..."
                  value={techniqueName}
                  onChange={(e) => setTechniqueName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Atributo de Convocação (CD)
                </label>
                <select
                  value={techniqueAttribute}
                  onChange={(e) => setTechniqueAttribute(e.target.value as AttributeKey)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
                >
                  {ATTRIBUTE_KEYS.map((k) => (
                    <option key={k} value={k}>{ATTRIBUTE_LABELS[k]} ({k})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Conceito & Funcionamento
              </label>
              <textarea
                rows={2}
                placeholder="Como essa técnica funciona narrativamente e mecanicamente?"
                value={techniqueDesc}
                onChange={(e) => setTechniqueDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100 resize-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-rose-500" />
                Feitiços Iniciais ({spells.length} de {maxSpellsAllowed} slots{isInato ? " • Marca Registrada Ativa" : ""})
              </span>
              {spells.length < maxSpellsAllowed && (
                <button
                  type="button"
                  onClick={() => setSpells([...spells, { name: `Feitiço ${spells.length + 1}`, level: 1, cost: isInato && spells.length === 2 ? 1 : 2, action: "Ação Padrão", range: "12m", description: "" }])}
                  className="text-[11px] font-semibold text-rose-400 hover:text-white cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> + Feitiço
                </button>
              )}
            </div>

            <div className="space-y-2">
              {spells.map((sp, idx) => (
                <WizardSpellCard
                  key={idx}
                  spell={sp}
                  index={idx}
                  totalSpells={spells.length}
                  isRestringido={false}
                  onUpdate={updateSpell}
                  onRemove={removeSpell}
                />
              ))}
            </div>
          </div>
        </div>
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
