"use client";

import { AttributeKey, ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from "@/systems/feiticeiros-e-maldicoes";
import { WizardSpell } from "./wizardTypes";
import { WizardSpellCard } from "./WizardSpellCard";
import { Wand2, BookOpen, Plus, Sparkles, Flame } from "lucide-react";

interface InnateTechniqueSectionProps {
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
  maxSpellsAllowed: number;
  isInato: boolean;
  onOpenCatalog: () => void;
  onOpenBuilder: () => void;
}

export function InnateTechniqueSection({
  techniqueName,
  setTechniqueName,
  techniqueDesc,
  setTechniqueDesc,
  techniqueAttribute,
  setTechniqueAttribute,
  spells,
  setSpells,
  domainExpansion,
  maxSpellsAllowed,
  isInato,
  onOpenCatalog,
  onOpenBuilder,
}: InnateTechniqueSectionProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenCatalog}
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
          onClick={onOpenBuilder}
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

      {domainExpansion && (
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="font-bold text-purple-300">
                Expansão de Domínio: {domainExpansion.name} ({domainExpansion.type} • {domainExpansion.cost} PE)
              </span>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                ℹ️ O domínio será cadastrado na sua ficha e só pode ser ativado após desbloquear a Aptidão de Domínio nos níveis adequados.
              </p>
            </div>
          </div>
        </div>
      )}

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
  );
}
