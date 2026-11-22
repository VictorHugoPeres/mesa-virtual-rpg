"use client";

import { useState } from "react";
import { AttributeKey, Origin, ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from "@/systems/feiticeiros-e-maldicoes";
import { WizardSpell } from "./wizardTypes";
import { TechniqueCatalogModal, GuidedSpellBuilderModal } from "../techniques";
import { WizardSpellCard } from "./WizardSpellCard";
import { Wand2, BookOpen, Plus, Sparkles } from "lucide-react";

interface StepTechniqueProps {
  origin: Origin;
  techniqueName: string;
  setTechniqueName: (name: string) => void;
  techniqueDesc: string;
  setTechniqueDesc: (desc: string) => void;
  techniqueAttribute: AttributeKey;
  setTechniqueAttribute: (attr: AttributeKey) => void;
  spells: WizardSpell[];
  setSpells: (spells: WizardSpell[]) => void;
}

export function StepTechnique({
  origin,
  techniqueName,
  setTechniqueName,
  techniqueDesc,
  setTechniqueDesc,
  techniqueAttribute,
  setTechniqueAttribute,
  spells,
  setSpells,
}: StepTechniqueProps) {
  const isRestringido = origin === "Restringido";
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
      const converted: WizardSpell[] = techData.selectedSpells.map((s) => ({
        name: s.name,
        level: s.level,
        cost: parseInt(s.cost) || (s.level === 0 ? 0 : s.level === 1 ? 2 : 5),
        action: s.action || "Ação Comum",
        range: s.range || "12m",
        description: s.description || "",
      }));
      setSpells(converted);
    }
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
    const converted: WizardSpell = {
      name: newSpell.name,
      level: newSpell.level,
      cost: newSpell.peCost,
      action: newSpell.action,
      range: newSpell.range,
      description: newSpell.effect,
    };
    setSpells([...spells, converted]);
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
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          {isRestringido ? "Passo 5: Estilo Físico & Habilidades de Vigor" : "Passo 5: Técnica Inata & Feitiços Iniciais"}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {isRestringido
            ? "Como Restringido, você não possui técnica inata nem PE. Defina seu estilo marcial e manobras de vigor."
            : "Escolha uma das 26 técnicas prontas da obra ou crie uma técnica inata própria com o Construtor Guiado F&M 2.5."}
        </p>
      </div>

      {/* Botões de Escolha: Catálogo vs Construtor Guiado */}
      {!isRestringido && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="p-3.5 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-blue-400 font-bold text-xs mb-1">
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>📚 Escolher Técnica Pronta</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Explore o catálogo completo com as 26 técnicas oficiais da obra (Ilimitado, Santuário, Dez Sombras, etc.).
            </p>
          </button>

          <button
            type="button"
            onClick={() => setIsBuilderOpen(true)}
            className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-purple-400 font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>✨ Criar Feitiço Guiado (F&M 2.5)</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Monte feitiços personalizados com validação ao vivo de custos em PE, dados de dano e condições.
            </p>
          </button>
        </div>
      )}

      {/* Dados Principais da Técnica */}
      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
              Nome da Técnica / Habilidade
            </label>
            <input
              type="text"
              required
              placeholder={isRestringido ? "Ex: Corpo Sublime, Sentidos Absolutos..." : "Ex: Ilimitado, Santuário, Boneco de Palha..."}
              value={techniqueName}
              onChange={(e) => setTechniqueName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
              Atributo-Chave (CD)
            </label>
            <select
              value={techniqueAttribute}
              onChange={(e) => setTechniqueAttribute(e.target.value as AttributeKey)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
            >
              {ATTRIBUTE_KEYS.map((k: AttributeKey) => (
                <option key={k} value={k}>{ATTRIBUTE_LABELS[k]} ({k})</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
            Conceito & Funcionamento Básico
          </label>
          <textarea
            rows={2}
            placeholder="Como essa técnica funciona narrativamente e mecanicamente?"
            value={techniqueDesc}
            onChange={(e) => setTechniqueDesc(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>
      </div>

      {/* Lista de Feitiços Iniciais */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            {isRestringido ? "Manobras Marciais (1º Nível)" : `Feitiços Iniciais (${spells.length} de 2 slots)`}
          </span>
          <div className="flex items-center gap-2">
            {!isRestringido && (
              <button
                type="button"
                onClick={() => setIsBuilderOpen(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> + Feitiço Guiado
              </button>
            )}
            {spells.length < 3 && (
              <button
                type="button"
                onClick={() => setSpells([...spells, { name: `Feitiço ${spells.length + 1}`, level: 1, cost: 2, action: "Ação Comum", range: "12m", description: "" }])}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Rápido
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          {spells.map((sp, idx) => (
            <WizardSpellCard
              key={idx}
              spell={sp}
              index={idx}
              totalSpells={spells.length}
              isRestringido={isRestringido}
              onUpdate={updateSpell}
              onRemove={removeSpell}
            />
          ))}
        </div>
      </div>

      {/* Modais Integrados */}
      <TechniqueCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        characterLevel={1}
        maxSpells={2}
        onApplyTechnique={handleApplyFromCatalog}
      />

      <GuidedSpellBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        characterLevel={1}
        currentSpellCount={spells.length}
        maxSpells={2}
        techniqueAttribute={techniqueAttribute}
        onSaveSpell={handleSaveFromBuilder}
      />
    </div>
  );
}
