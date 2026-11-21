"use client";

import { AttributeKey, Origin, ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from "@/systems/feiticeiros-e-maldicoes";
import { WizardSpell } from "./wizardTypes";
import { WIZARD_TECHNIQUE_PRESETS } from "./wizardPresets";
import { Wand2, Plus, Trash2 } from "lucide-react";

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

  function applyPreset(presetId: string) {
    const preset = WIZARD_TECHNIQUE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setTechniqueName(preset.name);
    setTechniqueDesc(preset.description);
    setTechniqueAttribute(preset.attribute);
    setSpells(preset.spells);
  }

  function updateSpell(index: number, field: keyof WizardSpell, value: string | number) {
    const updated = [...spells];
    updated[index] = { ...updated[index], [field]: value };
    setSpells(updated);
  }

  function addCustomSpell() {
    if (spells.length >= 4) return;
    setSpells([
      ...spells,
      {
        name: `Feitiço ${spells.length + 1}`,
        level: 1,
        cost: 2,
        action: "Ação Padrão",
        range: "9m",
        description: "Descreva os efeitos de dano ou controle deste feitiço.",
      },
    ]);
  }

  function removeSpell(index: number) {
    if (spells.length <= 1) return;
    setSpells(spells.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          {isRestringido ? "Passo 5: Estilo Físico & Habilidades de Estamina" : "Passo 5: Técnica Inata & Feitiços Iniciais"}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {isRestringido
            ? "Como Restringido, você não possui técnica inata nem PE. Defina seu estilo marcial sobre-humano e manobras de vigor."
            : "Escolha uma das técnicas famosas da obra ou crie uma técnica inata própria e personalize seus 2 feitiços de 1º nível."}
        </p>
      </div>

      {!isRestringido && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Sugestões Rápidas (Enciclopédia Jujutsu):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {WIZARD_TECHNIQUE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                  techniqueName === p.name
                    ? "bg-indigo-600 text-white border-indigo-500 font-semibold shadow-xs"
                    : "bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-indigo-400/60"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
              Nome da Técnica / Habilidade
            </label>
            <input
              type="text"
              required
              placeholder={isRestringido ? "Ex: Corpo Sublime, Sentidos Absolutos..." : "Ex: Ilimitado, Proporções 7:3..."}
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
            Conceito & Descrição da Técnica
          </label>
          <textarea
            rows={2}
            placeholder="Como essa técnica funciona narrativamente?"
            value={techniqueDesc}
            onChange={(e) => setTechniqueDesc(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            {isRestringido ? "Manobras Marciais (1º Nível)" : "Feitiços Iniciais (1º Nível)"}
          </span>
          {spells.length < 3 && (
            <button
              type="button"
              onClick={addCustomSpell}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Feitiço
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {spells.map((sp, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={sp.name}
                  onChange={(e) => updateSpell(idx, "name", e.target.value)}
                  placeholder="Nome do Feitiço"
                  className="font-bold text-xs px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] flex-1"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">Custo:</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={sp.cost}
                    onChange={(e) => updateSpell(idx, "cost", Number(e.target.value))}
                    className="w-12 text-center text-xs px-1 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] font-bold"
                  />
                  <span className="text-[11px] text-[var(--text-muted)]">{isRestringido ? "Vigor" : "PE"}</span>

                  {spells.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpell(idx)}
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                      title="Excluir Feitiço"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  value={sp.action}
                  onChange={(e) => updateSpell(idx, "action", e.target.value)}
                  placeholder="Ação (ex: Ação Padrão, Reação)"
                  className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[11px]"
                />
                <input
                  type="text"
                  value={sp.range}
                  onChange={(e) => updateSpell(idx, "range", e.target.value)}
                  placeholder="Alcance (ex: 9m, Toque)"
                  className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[11px]"
                />
              </div>

              <textarea
                rows={2}
                value={sp.description}
                onChange={(e) => updateSpell(idx, "description", e.target.value)}
                placeholder="Efeito e dano do feitiço..."
                className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
