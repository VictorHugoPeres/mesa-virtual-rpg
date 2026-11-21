"use client";

import {
  AttributeKey,
  ATTRIBUTE_KEYS,
  SPEC_TABLE,
  getModifier,
  calcSpellDC,
} from "@/systems/feiticeiros-e-maldicoes";
import { WizardState } from "./wizardTypes";
import { WIZARD_WEAPONS, WIZARD_TOOLKITS } from "./wizardPresets";
import { Loader2, Check } from "lucide-react";

interface StepReviewProps {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  onSubmit: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function StepReview({
  state,
  setState,
  onSubmit,
  isSubmitting,
  error,
}: StepReviewProps) {
  const isRestringido = state.origin === "Restringido";
  const specInfo = SPEC_TABLE[state.specialization] || SPEC_TABLE["Lutador"];

  function getFinalValue(key: AttributeKey): number {
    let bonus = 0;
    if (isRestringido) {
      if (key === "FOR") bonus += 2;
      if (key === state.bonusPlus2) bonus += 2;
    } else {
      if (key === state.bonusPlus2) bonus += 2;
      if (key === state.bonusPlus1) bonus += 1;
    }
    return (state.baseAttributes[key] || 10) + bonus;
  }

  const conMod = getModifier(getFinalValue("CON"));
  const dexMod = getModifier(getFinalValue("DEX"));
  const sabMod = getModifier(getFinalValue("SAB"));
  const techAttrVal = getFinalValue(state.techniqueAttribute);
  const techMod = getModifier(techAttrVal);

  const maxHP = specInfo.hpBase + conMod;
  const maxPE = isRestringido ? 0 : specInfo.pePerLevel + (specInfo.addsAttributeToPE ? Math.max(0, techMod) : 0);
  const totalDefense = 10 + dexMod;
  const initiative = dexMod;
  const attention = 10 + sabMod + (state.trainedSkills.includes("Percepção") ? 2 : 0);
  const spellDC = calcSpellDC(1, techAttrVal);
  const movement = isRestringido ? 12 : 9;

  const weaponNames = state.selectedWeapons.map(
    (wId) => WIZARD_WEAPONS.find((w) => w.id === wId)?.name || wId
  );
  const kitName = WIZARD_TOOLKITS.find((k) => k.id === state.selectedToolKit)?.name || state.selectedToolKit;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">Passo 7: Detalhes & Revisão Final</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Dê um nome ao seu feiticeiro, revise os cálculos automáticos da ficha e confirme a criação.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs rounded-lg bg-red-950/60 border border-red-800 text-red-200">
          {error}
        </div>
      )}

      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
              Nome do Personagem *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Yuji Itadori, Maki Zenin..."
              value={state.name}
              onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
              Tipo de Personagem
            </label>
            <select
              value={state.type}
              onChange={(e) => setState((prev) => ({ ...prev, type: e.target.value as "PC" | "NPC" }))}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
            >
              <option value="PC">Personagem Jogador (PC)</option>
              <option value="NPC">NPC / Aliado / Ameaça</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
            Conceito / Ideais do Personagem (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ex: Lutar para que ninguém morra sem ter uma escolha digna."
            value={state.concept}
            onChange={(e) => setState((prev) => ({ ...prev, concept: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
              Origem: {state.origin}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
              Classe: {state.specialization}
            </span>
          </div>
          <span className="text-xs font-bold text-[var(--text-muted)]">Nível 1 • 4° Grau</span>
        </div>

        <div className="grid grid-cols-6 gap-2 text-center">
          {ATTRIBUTE_KEYS.map((k: AttributeKey) => {
            const val = getFinalValue(k);
            const mod = getModifier(val);
            const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
            return (
              <div key={k} className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                <span className="text-[10px] text-[var(--text-muted)] font-bold block">{k}</span>
                <span className="text-sm font-bold text-[var(--text-primary)] block">{val}</span>
                <span className="text-[11px] font-bold text-emerald-400 block">{modStr}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase block">Vida (PV)</span>
            <span className="text-base font-bold text-rose-400">{maxHP}</span>
            <span className="text-[10px] text-[var(--text-muted)] block">Dado: {specInfo.hitDie}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase block">{isRestringido ? "Vigor" : "Energia (PE)"}</span>
            <span className="text-base font-bold text-blue-400">{maxPE}</span>
            <span className="text-[10px] text-[var(--text-muted)] block">Recurso</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase block">Defesa / CA</span>
            <span className="text-base font-bold text-emerald-400">{totalDefense}</span>
            <span className="text-[10px] text-[var(--text-muted)] block">10 + DEX</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase block">Iniciativa / Mov.</span>
            <span className="text-base font-bold text-amber-400">+{initiative} / {movement}m</span>
            <span className="text-[10px] text-[var(--text-muted)] block">Atenção: {attention}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-[var(--border-default)]">
          <div>
            <span className="font-bold text-[var(--text-secondary)] block mb-1">
              {isRestringido ? "Habilidades:" : `Técnica: ${state.techniqueName || "Inominada"} (CD ${spellDC})`}
            </span>
            <p className="text-[var(--text-muted)] line-clamp-2">{state.techniqueDesc || "Sem descrição."}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {state.spells.map((s) => (
                <span key={s.name} className="px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[10px] text-indigo-300">
                  {s.name} ({s.cost} {isRestringido ? "Vigor" : "PE"})
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-[var(--text-secondary)] block mb-1">Equipamentos & Ferramentas:</span>
            <p className="text-[var(--text-muted)]">
              {weaponNames.join(", ") || "Nenhuma arma"}, Uniforme Jujutsu, {kitName || "Sem kit"}.
            </p>
            <span className="font-bold text-[var(--text-secondary)] block mt-2 mb-0.5">Perícias ({state.trainedSkills.length}):</span>
            <p className="text-[var(--text-muted)] truncate">{state.trainedSkills.join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          disabled={!state.name.trim() || isSubmitting}
          onClick={onSubmit}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Criando Personagem...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Finalizar e Criar Personagem
            </>
          )}
        </button>
      </div>
    </div>
  );
}
