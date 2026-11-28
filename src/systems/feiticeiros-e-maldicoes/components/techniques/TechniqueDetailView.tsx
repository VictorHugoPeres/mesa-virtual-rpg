"use client";

import { useState, useEffect } from "react";
import { InnateTechnique, ReadySpell } from "../../data/techniques";
import { getUnlockedSpellLevels } from "../../data/techniqueCreationRules";
import { AttributeKey } from "../../constants";
import { Sparkles, Check, Lock, Shield, BookOpen, AlertCircle, Flame } from "lucide-react";

interface TechniqueDetailViewProps {
  technique: InnateTechnique;
  characterLevel?: number;
  maxSpells?: number;
  onApply: (tech: {
    name: string;
    attribute: AttributeKey;
    description: string;
    selectedSpells: ReadySpell[];
    domainExpansion?: {
      name: string;
      type: string;
      cost: number;
      description: string;
    };
  }) => void;
  onBack?: () => void;
}

export function TechniqueDetailView({
  technique,
  characterLevel = 1,
  maxSpells = 2,
  onApply,
  onBack,
}: TechniqueDetailViewProps) {
  const unlockedLevels = getUnlockedSpellLevels(characterLevel);
  const [selectedSpellNames, setSelectedSpellNames] = useState<string[]>([]);
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Pré-seleciona os primeiros feitiços liberados respeitando o limite
  useEffect(() => {
    const available = technique.spells.filter((s) => unlockedLevels.includes(s.level as any));
    const initialSelection = available.slice(0, maxSpells).map((s) => s.name);
    setSelectedSpellNames(initialSelection);
  }, [technique, characterLevel, maxSpells]);

  function toggleSpell(spell: ReadySpell, isUnlocked: boolean) {
    if (!isUnlocked) return;
    if (selectedSpellNames.includes(spell.name)) {
      setSelectedSpellNames(selectedSpellNames.filter((n) => n !== spell.name));
    } else {
      if (selectedSpellNames.length >= maxSpells) return;
      setSelectedSpellNames([...selectedSpellNames, spell.name]);
    }
  }

  function handleConfirm() {
    const chosen = technique.spells.filter((s) => selectedSpellNames.includes(s.name));
    onApply({
      name: technique.name,
      attribute: technique.suggestedAttribute,
      description: technique.description,
      selectedSpells: chosen,
      domainExpansion: technique.domainExpansion,
    });
  }

  const isLongDesc = technique.description.length > 200;

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--bg-card)] overflow-y-auto overscroll-contain touch-pan-y">
      {/* Cabeçalho Sticky no Topo */}
      <div className="sticky top-0 z-10 p-4 sm:p-5 border-b border-[var(--border-default)] bg-[var(--bg-card)]/95 backdrop-blur-md shadow-xs shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="md:hidden flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold mb-2 cursor-pointer"
              >
                ← Voltar às Técnicas
              </button>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {technique.category}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Atributo: {technique.suggestedAttribute}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1.5">{technique.name}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Usuário de referência: <strong className="text-[var(--text-secondary)]">{technique.characterRef}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-950/30 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Check className="w-4 h-4" /> Aplicar Técnica
          </button>
        </div>
      </div>

      {/* Descrição da Técnica & Funcionamento Básico (no mesmo fluxo de scroll) */}
      <div className="p-4 sm:p-5 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/25 space-y-3 shrink-0">
        <div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {showFullDesc || !isLongDesc
              ? technique.description
              : `${technique.description.slice(0, 200)}...`}
          </p>
          {isLongDesc && (
            <button
              type="button"
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold mt-1 inline-block cursor-pointer"
            >
              {showFullDesc ? "▲ Recolher descrição" : "▼ Ver descrição completa"}
            </button>
          )}
        </div>

        {technique.basicFunction && (
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs">
            <span className="font-bold text-blue-300 block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Funcionamento Básico:
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
              {technique.basicFunction}
            </p>
          </div>
        )}

        {technique.domainExpansion && (
          <div className="p-3.5 rounded-xl bg-purple-950/25 border border-purple-500/35 text-xs space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-1.5">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-purple-400" /> Expansão de Domínio: {technique.domainExpansion.name}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-900/50 text-purple-300 border border-purple-700/50">
                {technique.domainExpansion.type} • {technique.domainExpansion.cost} PE
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-[11px] pt-0.5">
              {technique.domainExpansion.description}
            </p>
          </div>
        )}
      </div>

      {/* Lista de Feitiços */}
      <div className="p-4 sm:p-5 space-y-3 pb-16">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Feitiços Prontos ({technique.spells.length})
          </h4>
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Selecionados: <strong className="text-blue-400">{selectedSpellNames.length}</strong> / {maxSpells} slots
          </span>
        </div>

        {technique.spells.length === 0 ? (
          <div className="p-6 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)]/30 rounded-xl">
            Esta técnica utiliza mecânica livre de cópia/manifestação por invocação.
          </div>
        ) : (
          technique.spells.map((spell, index) => {
            const isUnlocked = unlockedLevels.includes(spell.level as any);
            const isSelected = selectedSpellNames.includes(spell.name);

            return (
              <div
                key={`${technique.id}-${spell.name}-${spell.level}-${index}`}
                onClick={() => toggleSpell(spell, isUnlocked)}
                className={`p-3.5 rounded-xl border transition-all ${
                  !isUnlocked
                    ? "opacity-50 bg-[var(--bg-secondary)]/20 border-white/5 cursor-not-allowed"
                    : isSelected
                    ? "bg-blue-600/10 border-blue-500/50 shadow-sm cursor-pointer"
                    : "bg-[var(--bg-secondary)]/50 border-[var(--border-default)] hover:border-blue-400/30 cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isUnlocked}
                      onChange={() => toggleSpell(spell, isUnlocked)}
                      className="rounded border-[var(--border-default)] text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{spell.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                          Nível {spell.level} ({spell.cost})
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                        {spell.action} • {spell.range} • {spell.duration}
                      </span>
                    </div>
                  </div>

                  {!isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400/80 font-medium shrink-0">
                      <Lock className="w-3 h-3" /> Requer Nível Superior
                    </span>
                  ) : spell.rollFormula ? (
                    <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 shrink-0">
                      {spell.rollFormula}
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed pl-6 whitespace-pre-wrap">
                  {spell.description}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
