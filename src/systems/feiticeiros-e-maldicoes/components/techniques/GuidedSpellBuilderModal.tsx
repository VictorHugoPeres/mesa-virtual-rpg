"use client";

import { useState, useMemo } from "react";
import { Portal } from "@/core/ui";
import {
  SpellLevel,
  SPELL_LEVEL_RULES,
  getUnlockedSpellLevels,
  CONDITIONS_RULES,
} from "../../data/techniqueCreationRules";
import { SpellAdvancedOptions } from "./SpellAdvancedOptions";
import { SpellPreviewCard } from "./SpellPreviewCard";
import { SpellBasicFields } from "./SpellBasicFields";
import { AttributeKey } from "../../constants";
import { Wand2, X, AlertCircle, Check } from "lucide-react";

interface GuidedSpellBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterLevel?: number;
  currentSpellCount?: number;
  maxSpells?: number;
  techniqueAttribute?: AttributeKey;
  onSaveSpell: (spell: {
    name: string;
    level: number;
    peCost: number;
    action: string;
    range: string;
    duration: string;
    effect: string;
  }) => void;
}

export function GuidedSpellBuilderModal({
  isOpen,
  onClose,
  characterLevel = 1,
  currentSpellCount = 0,
  maxSpells = 2,
  onSaveSpell,
}: GuidedSpellBuilderModalProps) {
  const unlockedLevels = getUnlockedSpellLevels(characterLevel);

  const [name, setName] = useState("");
  const [level, setLevel] = useState<SpellLevel>(1);
  const [spellType, setSpellType] = useState<"DANO_ATAQUE" | "DANO_TR" | "AREA_TR" | "CURA" | "BUFF_DEFESA" | "UTILIDADE">("DANO_ATAQUE");
  const [action, setAction] = useState("Ação Comum");
  const [range, setRange] = useState("12m");
  const [duration, setDuration] = useState("Instantânea");
  const [customEffectText, setCustomEffectText] = useState("");

  // Opções Avançadas F&M 2.5
  const [condition, setCondition] = useState("");
  const [isSoulAttack, setIsSoulAttack] = useState(false);
  const [ritual, setRitual] = useState("");

  const rule = SPELL_LEVEL_RULES[level];
  const isLevelLocked = !unlockedLevels.includes(level);

  // Calcula fórmula de dados sugerida respeitando tetos e penalidades de condição
  const calculatedFormula = useMemo(() => {
    let base = "0";
    if (spellType === "DANO_ATAQUE") base = rule.maxDamageAttack;
    else if (spellType === "DANO_TR") base = rule.maxDamageSave;
    else if (spellType === "AREA_TR") base = rule.maxAreaDamage;
    else if (spellType === "CURA") base = rule.maxHealingSingle;
    else if (spellType === "BUFF_DEFESA") return `+${rule.maxBuffACImmediate} CA / RD`;
    else return "Efeito Utilitário";

    if (condition) {
      const condRule = CONDITIONS_RULES.find((c) => c.name === condition);
      if (condRule && base.includes("d")) {
        const parts = base.match(/^(\d+)d(\d+)$/);
        if (parts) {
          const numDice = Math.max(1, parseInt(parts[1]) - condRule.damagePenaltyDice);
          base = `${numDice}d${parts[2]}`;
        }
      }
    }

    if (isSoulAttack) {
      base += " (Alma /3)";
    }

    return base;
  }, [level, spellType, condition, isSoulAttack, rule]);

  if (!isOpen) return null;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    let finalDesc = customEffectText.trim() || `Manifestação de feitiço nível ${level}.`;
    if (calculatedFormula && calculatedFormula !== "Efeito Utilitário") {
      finalDesc = `Causa ${calculatedFormula}. ${finalDesc}`;
    }
    if (condition) finalDesc += ` Aplica a condição ${condition} no alvo.`;
    if (ritual) finalDesc += ` [Ritual F&M 2.5: ${ritual}].`;

    onSaveSpell({
      name: name.trim(),
      level,
      peCost: rule.costPE,
      action,
      range,
      duration,
      effect: finalDesc,
    });
    onClose();
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-2xl h-[92dvh] sm:h-auto max-h-[92dvh] sm:max-h-[85vh] bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-2xl flex flex-col min-h-0 overflow-hidden animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23272F] bg-[#0B0C0E] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Construtor Guiado de Feitiços (F&M 2.5)
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Crie feitiços balanceados com limites oficiais de dano, custos e condições.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-5 space-y-4 pb-8">
            <SpellPreviewCard
              name={name}
              level={level}
              costPE={rule.costPE}
              calculatedFormula={calculatedFormula}
              action={action}
              range={range}
              duration={duration}
              currentSpellCount={currentSpellCount}
              maxSpells={maxSpells}
              characterLevel={characterLevel}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Nome do Feitiço *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Disparo Carmesim, Espeto de Gelo..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Nível do Feitiço (PE)
                </label>
                <select
                  value={level}
                  onChange={(e) => {
                    const nextLvl = Number(e.target.value) as SpellLevel;
                    setLevel(nextLvl);
                    if (nextLvl === 0 && spellType === "AREA_TR") setSpellType("DANO_ATAQUE");
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-white focus:outline-none focus:border-purple-500"
                >
                  {[0, 1, 2, 3, 4, 5].map((lvl) => {
                    const r = SPELL_LEVEL_RULES[lvl as SpellLevel];
                    const isLocked = !unlockedLevels.includes(lvl as SpellLevel);
                    return (
                      <option key={lvl} value={lvl}>
                        Nível {lvl} ({r.costPE} PE) {isLocked ? "🔒 (Nível Alto)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {isLevelLocked && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Atenção: Feitiços de Nível {level} exigem personagem de Nível {rule.minCharacterLevel} ou superior.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Tipo e Mecânica Central
              </label>
              <select
                value={spellType}
                onChange={(e) => setSpellType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-white focus:outline-none focus:border-purple-500"
              >
                <option value="DANO_ATAQUE">Dano em 1 Alvo (Teste de Ataque vs CA)</option>
                <option value="DANO_TR">Dano em 1 Alvo (Teste de Resistência do Alvo)</option>
                <option value="AREA_TR" disabled={level === 0}>
                  Dano em Área / Múltiplos Alvos (TR) {level === 0 ? "— Bloqueado no Nível 0" : ""}
                </option>
                <option value="CURA">Cura de PV / Regeneração</option>
                <option value="BUFF_DEFESA">Defensivo (Aumento de CA / Redução de Dano)</option>
                <option value="UTILIDADE">Utilidade / Mobilidade / Barreira</option>
              </select>
            </div>

            <SpellBasicFields
              action={action}
              setAction={setAction}
              range={range}
              setRange={setRange}
              duration={duration}
              setDuration={setDuration}
              maxRangeMeters={rule.maxRangeMeters}
            />

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Descrição Narrativa & Efeitos Específicos
              </label>
              <textarea
                rows={2}
                value={customEffectText}
                onChange={(e) => setCustomEffectText(e.target.value)}
                placeholder="Descreva visualmente o feitiço e particularidades da sua técnica..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-[#0B0C0E] border border-[#23272F] text-white focus:outline-none focus:border-rose-500/50 resize-none"
              />
            </div>

            <SpellAdvancedOptions
              spellLevel={level}
              selectedCondition={condition}
              onSelectCondition={setCondition}
              isSoulAttack={isSoulAttack}
              onToggleSoulAttack={setIsSoulAttack}
              selectedRitual={ritual}
              onSelectRitual={setRitual}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-[#23272F]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs rounded-xl border border-[#23272F] text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-950/30 disabled:opacity-40 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" /> Salvar Feitiço no Grimório
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
