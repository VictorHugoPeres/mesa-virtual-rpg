"use client";

import { CONDITIONS_RULES, RITUAL_ENHANCEMENTS, SpellLevel, ConditionRule } from "../../data/techniqueCreationRules";
import { Skull, Sparkles, AlertTriangle, ShieldAlert } from "lucide-react";

interface SpellAdvancedOptionsProps {
  spellLevel: SpellLevel;
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
  isSoulAttack: boolean;
  onToggleSoulAttack: (active: boolean) => void;
  selectedRitual: string;
  onSelectRitual: (ritual: string) => void;
}

export function SpellAdvancedOptions({
  spellLevel,
  selectedCondition,
  onSelectCondition,
  isSoulAttack,
  onToggleSoulAttack,
  selectedRitual,
  onSelectRitual,
}: SpellAdvancedOptionsProps) {
  // Filtra as condições pelo nível do feitiço
  const availableConditions = CONDITIONS_RULES.filter((c) => spellLevel >= c.minSpellLevel);
  const lockedConditions = CONDITIONS_RULES.filter((c) => spellLevel < c.minSpellLevel);

  return (
    <div className="space-y-4 pt-3 border-t border-[var(--border-default)]">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Opções Avançadas & Regras F&M 2.5
      </h4>

      {/* Condição Aplicada */}
      <div>
        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
          Aplicar Condição no Alvo (Desconta dados de dano conforme a regra)
        </label>
        <select
          value={selectedCondition}
          onChange={(e) => onSelectCondition(e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Nenhuma Condição</option>
          <optgroup label="Condições Permitidas neste Nível">
            {availableConditions.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.severity} • Reduz {c.damagePenaltyDice}d de dano)
              </option>
            ))}
          </optgroup>
          {lockedConditions.length > 0 && (
            <optgroup label="Condições Bloqueadas (Exigem Nível Superior)">
              {lockedConditions.map((c) => (
                <option key={c.name} value="" disabled>
                  {c.name} (Requer Nível {c.minSpellLevel})
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Dano na Alma (F&M 2.5) */}
      <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-default)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg border ${isSoulAttack ? "bg-purple-950/80 border-purple-500 text-purple-300" : "bg-black/30 border-white/5 text-zinc-500"}`}>
            <Skull className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Ataque Direto na Alma (F&M 2.5)</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Reduz a Integridade da Alma do alvo. Por regra, a média de dano é dividida por 3.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleSoulAttack(!isSoulAttack)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            isSoulAttack
              ? "bg-purple-600 border-purple-500 text-white shadow-xs"
              : "bg-[var(--bg-card)] border-[var(--border-default)] text-[var(--text-muted)] hover:text-white"
          }`}
        >
          {isSoulAttack ? "Ativo (/3)" : "Desativado"}
        </button>
      </div>

      {/* Versatilidade / Rituais (F&M 2.5) */}
      <div>
        <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
          Melhoria de Ritual Opcional (F&M 2.5 - Abre mão de 1 Ação Comum)
        </label>
        <select
          value={selectedRitual}
          onChange={(e) => onSelectRitual(e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Nenhum Ritual Adicional</option>
          {RITUAL_ENHANCEMENTS.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name} — {r.desc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
