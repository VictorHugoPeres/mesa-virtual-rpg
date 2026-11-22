"use client";

import { useState } from "react";
import { calculatePhysicalRoll, extractDiceFormula } from "./diceParser";
import { RollRequest, useDice } from "./DiceContext";
import { postBroadcastEvent } from "@/core/sync/broadcast";
import { SyncEvent, DiceRollEventData } from "@/core/sync/syncTypes";
import { useCombatTargets } from "./useCombatTargets";
import { CombatTargetSelector } from "./CombatTargetSelector";
import { Sparkles, AlertTriangle, Dice5, Swords } from "lucide-react";

interface PhysicalInputTabProps {
  request: RollRequest | null;
  onSuccess: () => void;
}

export function PhysicalInputTab({ request }: PhysicalInputTabProps) {
  const { notifyRollSaved } = useDice();
  const [physicalValue, setPhysicalValue] = useState<string>("");
  const [isD20, setIsD20] = useState(!request?.defaultDice || request.defaultDice.includes("d20"));
  const [showOnTv, setShowOnTv] = useState(true);
  const [applyAutoDamage, setApplyAutoDamage] = useState(true);
  const [submitted, setSubmitted] = useState<ReturnType<typeof calculatePhysicalRoll> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [appliedDamageDone, setAppliedDamageDone] = useState<number | null>(null);

  const mod = request?.modifier ?? 0;
  const numVal = parseInt(physicalValue, 10);

  const { targets, selectedTargetId, setSelectedTargetId, selectedTarget } = useCombatTargets(
    request?.campaignId,
    request?.roller
  );

  const isAttack = Boolean(
    request?.label?.toLowerCase().includes("ataque") ||
    request?.label?.toLowerCase().includes("acerto") ||
    isD20
  );
  const isDamage = Boolean(
    request?.label?.toLowerCase().includes("dano") ||
    (!isAttack && !isD20)
  );

  const hitEvaluation = submitted && selectedTarget && isAttack ? {
    isCritical: submitted.isCritical,
    isFumble: submitted.isFumble,
    isHit: submitted.isCritical || (!submitted.isFumble && submitted.total >= selectedTarget.defense),
  } : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isNaN(numVal)) return;

    const calc = calculatePhysicalRoll(numVal, mod, isD20);
    setSubmitted(calc);
    setIsSaving(true);
    setAppliedDamageDone(null);

    const hitStatus = selectedTarget && isAttack ? (calc.isCritical || (!calc.isFumble && calc.total >= selectedTarget.defense)) : undefined;
    const willApplyDamage = Boolean(selectedTarget && isDamage && applyAutoDamage);
    const formulaStr = `${isD20 ? "1d20" : "Dado Físico"}${mod !== 0 ? (mod >= 0 ? `+${mod}` : mod) : ""}`;

    if (showOnTv && request?.campaignId) {
      const syncEvent: SyncEvent<DiceRollEventData> = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        type: "DICE_ROLL",
        campaignId: request.campaignId,
        payload: {
          roller: request.roller || "Mestre",
          formula: formulaStr,
          rawRoll: JSON.stringify([numVal]),
          modifier: mod,
          total: calc.total,
          label: request.label || "Dado Físico",
          isCritical: calc.isCritical,
          isFumble: calc.isFumble,
          mode: "PHYSICAL_INPUT",
          targetName: selectedTarget?.name,
          targetDefense: selectedTarget?.defense,
          isHit: hitStatus,
          appliedDamage: willApplyDamage ? calc.total : undefined,
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
          mode: "PHYSICAL_INPUT",
          campaignId: request?.campaignId,
          characterId: request?.characterId,
          roller: request?.roller || "Mestre",
          label: request?.label || "Dado Físico",
          formula: formulaStr,
          rawRoll: JSON.stringify([numVal]),
          modifier: mod,
          total: calc.total,
          isCritical: calc.isCritical,
          isFumble: calc.isFumble,
          showOnTv,
          targetName: selectedTarget?.name,
          targetDefense: selectedTarget?.defense,
          isHit: hitStatus,
          applyDamageToTarget: willApplyDamage ? { targetId: selectedTarget!.id, damage: calc.total } : undefined,
        }),
      });

      if (willApplyDamage) setAppliedDamageDone(calc.total);
      notifyRollSaved();
    } catch (err) {
      console.error("Erro ao registrar entrada física:", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {/* Seletor de Alvo do Combate */}
      {targets.length > 0 && (
        <CombatTargetSelector
          targets={targets}
          selectedTargetId={selectedTargetId}
          onSelectTargetId={setSelectedTargetId}
        />
      )}

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

      <div>
        <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
          Valor Rolado na Mesa (Face do Dado)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={100}
            required
            autoFocus
            value={physicalValue}
            onChange={(e) => setPhysicalValue(e.target.value)}
            placeholder="Ex: 14"
            className="flex-1 px-3 py-2 text-base font-bold text-center rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          />
          <button
            type="submit"
            disabled={isSaving || isNaN(numVal)}
            className="px-5 py-2 font-bold text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-40"
          >
            <Dice5 className="w-4 h-4" /> Confirmar
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-default)] text-[var(--text-secondary)]">
        <span>Modificador: <strong>{mod >= 0 ? `+${mod}` : mod}</strong></span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isD20}
            onChange={(e) => setIsD20(e.target.checked)}
            className="rounded border-[var(--border-default)] accent-emerald-500"
          />
          <span>Considerar d20 (Crítico 20 / Falha 1)</span>
        </label>
      </div>

      {submitted && (
        <div className={`p-3.5 rounded-xl border text-center transition-all ${
          submitted.isCritical ? "bg-amber-950/30 border-amber-500/80" : submitted.isFumble ? "bg-red-950/30 border-red-500/80" : "bg-[var(--bg-secondary)] border-[var(--border-default)]"
        }`}>
          <div className="text-3xl font-black font-mono text-[var(--text-primary)]">{submitted.total}</div>
          <div className="text-xs text-[var(--text-muted)] font-mono">
            Dado: {submitted.physicalValue} {mod !== 0 ? (mod > 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`) : ""}
          </div>

          {hitEvaluation && (
            <div className={`mt-2 py-1.5 px-3 rounded-lg text-xs font-bold ${
              hitEvaluation.isCritical ? "bg-amber-950/80 text-amber-300 border border-amber-600" : hitEvaluation.isHit ? "bg-emerald-950/80 text-emerald-300 border border-emerald-600" : "bg-red-950/80 text-red-300 border border-red-600"
            }`}>
              {hitEvaluation.isCritical ? "💥 CRÍTICO! Acerto Garantido!" : hitEvaluation.isHit ? `🎯 ACERTOU ${selectedTarget!.name}!` : `❌ ERROU ${selectedTarget!.name}!`}
              <span className="text-[11px] font-normal opacity-80 block">Total: {submitted.total} vs Defesa: {selectedTarget!.defense}</span>
            </div>
          )}

          {appliedDamageDone !== null && selectedTarget && (
            <div className="mt-2 py-1.5 px-3 rounded-lg bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-bold">
              💥 {appliedDamageDone} de dano aplicado em {selectedTarget.name}!
            </div>
          )}
        </div>
      )}
    </form>
  );
}
