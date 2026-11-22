"use client";

import { useState } from "react";
import { rollDigitalDice, RollResult, extractDiceFormula } from "./diceParser";
import { RollRequest, useDice } from "./DiceContext";
import { postBroadcastEvent } from "@/core/sync/broadcast";
import { SyncEvent, DiceRollEventData } from "@/core/sync/syncTypes";
import { useCombatTargets } from "./useCombatTargets";
import { CombatTargetSelector } from "./CombatTargetSelector";
import { Dices, Sparkles, AlertTriangle, Tv, Swords, Crosshair } from "lucide-react";

interface DigitalRollerTabProps {
  request: RollRequest | null;
  onSuccess: () => void;
}

export function DigitalRollerTab({ request }: DigitalRollerTabProps) {
  const { notifyRollSaved, openRoller } = useDice();
  const defaultDiceType = request?.defaultDice || "1d20";
  const defaultMod = request?.modifier ?? 0;

  const cleanDice = extractDiceFormula(defaultDiceType);
  const [formula, setFormula] = useState(
    defaultMod !== 0
      ? `${cleanDice}${defaultMod >= 0 ? `+${defaultMod}` : defaultMod}`
      : cleanDice
  );
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">("normal");
  const [showOnTv, setShowOnTv] = useState(true);
  const [applyAutoDamage, setApplyAutoDamage] = useState(true);
  const [result, setResult] = useState<RollResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [appliedDamageDone, setAppliedDamageDone] = useState<number | null>(null);

  // Alvos do combate ativo
  const { targets, selectedTargetId, setSelectedTargetId, selectedTarget } = useCombatTargets(
    request?.campaignId,
    request?.roller
  );

  const isAttack = Boolean(
    request?.label?.toLowerCase().includes("ataque") ||
    request?.label?.toLowerCase().includes("acerto") ||
    formula.toLowerCase().includes("d20")
  );
  const isDamage = Boolean(
    request?.label?.toLowerCase().includes("dano") ||
    (!isAttack && !formula.toLowerCase().includes("d20"))
  );

  // Calcula acerto vs defesa
  const hitEvaluation = result && selectedTarget && isAttack ? {
    isCritical: result.isCritical,
    isFumble: result.isFumble,
    isHit: result.isCritical || (!result.isFumble && result.total >= selectedTarget.defense),
  } : null;

  async function handleRoll() {
    const res = rollDigitalDice(formula, rollMode);
    setResult(res);
    setIsSaving(true);
    setAppliedDamageDone(null);

    const hitStatus = selectedTarget && isAttack ? (res.isCritical || (!res.isFumble && res.total >= selectedTarget.defense)) : undefined;
    const willApplyDamage = Boolean(selectedTarget && isDamage && applyAutoDamage);

    // Disparo local no BroadcastChannel
    if (showOnTv && request?.campaignId) {
      const syncEvent: SyncEvent<DiceRollEventData> = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        type: "DICE_ROLL",
        campaignId: request.campaignId,
        payload: {
          roller: request.roller || "Mestre",
          formula: res.formula,
          rawRoll: JSON.stringify(res.rolls),
          modifier: res.modifier,
          total: res.total,
          label: request.label || "Rolagem Livre",
          isCritical: res.isCritical,
          isFumble: res.isFumble,
          mode: "DIGITAL",
          targetName: selectedTarget?.name,
          targetDefense: selectedTarget?.defense,
          isHit: hitStatus,
          appliedDamage: willApplyDamage ? res.total : undefined,
        },
        timestamp: Date.now(),
      };
      postBroadcastEvent(request.campaignId, syncEvent);
    }

    try {
      await fetch("/api/rolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "DIGITAL",
          campaignId: request?.campaignId,
          characterId: request?.characterId,
          roller: request?.roller || "Mestre",
          label: request?.label || "Rolagem Livre",
          formula: res.formula,
          rawRoll: JSON.stringify(res.rolls),
          modifier: res.modifier,
          total: res.total,
          isCritical: res.isCritical,
          isFumble: res.isFumble,
          showOnTv,
          targetName: selectedTarget?.name,
          targetDefense: selectedTarget?.defense,
          isHit: hitStatus,
          applyDamageToTarget: willApplyDamage ? { targetId: selectedTarget!.id, damage: res.total } : undefined,
        }),
      });

      if (willApplyDamage) setAppliedDamageDone(res.total);
      notifyRollSaved();
    } catch (err) {
      console.error("Erro ao salvar rolagem:", err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleRollLinkedDamage() {
    if (!request?.linkedDamage) return;
    const cleanDmg = extractDiceFormula(request.linkedDamage);
    setFormula(cleanDmg);
    setResult(null);
    setAppliedDamageDone(null);
  }

  return (
    <div className="space-y-3.5">
      {/* Seletor de Alvo do Combate */}
      {targets.length > 0 && (
        <CombatTargetSelector
          targets={targets}
          selectedTargetId={selectedTargetId}
          onSelectTargetId={setSelectedTargetId}
        />
      )}

      {/* Se for dano com alvo selecionado, exibe toggle para aplicar automático */}
      {selectedTarget && isDamage && (
        <label className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={applyAutoDamage}
            onChange={(e) => setApplyAutoDamage(e.target.checked)}
            className="rounded accent-rose-600"
          />
          <span>Descontar PV automaticamente de <strong>{selectedTarget.name}</strong></span>
        </label>
      )}

      {/* Input de Fórmula e Botão Rolar */}
      <div>
        <div className="flex gap-2">
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="Ex: 1d20+5, 2d8+3"
            className="flex-1 px-3 py-2 text-sm font-mono font-bold rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          />
          <button
            type="button"
            onClick={handleRoll}
            disabled={isSaving}
            className="px-5 py-2 font-bold text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Dices className="w-4 h-4" /> Rolar
          </button>
        </div>
      </div>

      {/* Modos Vantagem / Desvantagem */}
      <div className="flex gap-1.5">
        {[
          { id: "normal", label: "Normal" },
          { id: "advantage", label: "Vantagem" },
          { id: "disadvantage", label: "Desvantagem" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setRollMode(m.id as any)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              rollMode === m.id
                ? "bg-blue-950/60 border-blue-500 text-blue-300"
                : "bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-muted)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Destaque do Resultado */}
      {result && (
        <div className={`p-3.5 rounded-xl border text-center transition-all ${
          result.isCritical ? "bg-amber-950/30 border-amber-500/80" : result.isFumble ? "bg-red-950/30 border-red-500/80" : "bg-[var(--bg-secondary)] border-[var(--border-default)]"
        }`}>
          <div className="text-3xl font-black font-mono text-[var(--text-primary)]">{result.total}</div>
          <div className="text-xs text-[var(--text-muted)] font-mono">
            [{result.rolls.join(", ")}] {result.modifier !== 0 ? (result.modifier > 0 ? `+${result.modifier}` : result.modifier) : ""}
          </div>

          {/* Feedback de Acerto vs Defesa */}
          {hitEvaluation && (
            <div className={`mt-2 py-1.5 px-3 rounded-lg text-xs font-bold ${
              hitEvaluation.isCritical ? "bg-amber-950/80 text-amber-300 border border-amber-600" : hitEvaluation.isHit ? "bg-emerald-950/80 text-emerald-300 border border-emerald-600" : "bg-red-950/80 text-red-300 border border-red-600"
            }`}>
              {hitEvaluation.isCritical ? "💥 CRÍTICO! Acerto Garantido!" : hitEvaluation.isHit ? `🎯 ACERTOU ${selectedTarget!.name}!` : `❌ ERROU ${selectedTarget!.name}!`}
              <span className="text-[11px] font-normal opacity-80 block">Total: {result.total} vs Defesa: {selectedTarget!.defense}</span>
            </div>
          )}

          {/* Botão Rolar Dano no Alvo */}
          {hitEvaluation?.isHit && request?.linkedDamage && (
            <button
              type="button"
              onClick={handleRollLinkedDamage}
              className="mt-2.5 w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5" /> Rolar Dano no Alvo ({request.linkedDamage})
            </button>
          )}

          {/* Feedback de Dano Aplicado */}
          {appliedDamageDone !== null && selectedTarget && (
            <div className="mt-2 py-1.5 px-3 rounded-lg bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-bold">
              💥 {appliedDamageDone} de dano aplicado em {selectedTarget.name}!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
