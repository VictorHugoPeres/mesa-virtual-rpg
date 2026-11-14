"use client";

import { useState } from "react";
import { calculatePhysicalRoll } from "./diceParser";
import { RollRequest, useDice } from "./DiceContext";
import { Check, Sparkles, AlertTriangle, Dice5 } from "lucide-react";

interface PhysicalInputTabProps {
  request: RollRequest | null;
  onSuccess: () => void;
}

export function PhysicalInputTab({ request, onSuccess }: PhysicalInputTabProps) {
  const { notifyRollSaved } = useDice();
  const [physicalValue, setPhysicalValue] = useState<string>("");
  const [isD20, setIsD20] = useState(
    !request?.defaultDice || request.defaultDice.includes("d20")
  );
  const [submitted, setSubmitted] = useState<ReturnType<
    typeof calculatePhysicalRoll
  > | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const mod = request?.modifier ?? 0;
  const numVal = parseInt(physicalValue, 10);
  const preview = !isNaN(numVal) ? calculatePhysicalRoll(numVal, mod, isD20) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isNaN(numVal)) return;

    const calc = calculatePhysicalRoll(numVal, mod, isD20);
    setSubmitted(calc);
    setIsSaving(true);

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
          formula: `${isD20 ? "1d20" : "Dado Físico"}${mod >= 0 ? `+${mod}` : mod}`,
          rawRoll: JSON.stringify([numVal]),
          modifier: mod,
          total: calc.total,
          isCritical: calc.isCritical,
          isFumble: calc.isFumble,
        }),
      });
      notifyRollSaved();
    } catch (err) {
      console.error("Erro ao salvar dado físico:", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)]">
        Role o dado real na sua mesa e digite o número que caiu na face. O sistema somará o modificador da ficha automaticamente.
      </div>

      <div className="grid grid-cols-2 gap-3 items-end">
        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Valor Tirado no Dado
          </label>
          <input
            type="number"
            min={1}
            max={isD20 ? 20 : 100}
            required
            autoFocus
            value={physicalValue}
            onChange={(e) => {
              setPhysicalValue(e.target.value);
              setSubmitted(null);
            }}
            placeholder="Ex: 17"
            className="w-full px-3 py-2 text-2xl font-bold text-center rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Bônus da Ação
          </label>
          <div className="py-2.5 px-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-center font-bold text-base text-blue-400">
            {mod >= 0 ? `+${mod}` : mod}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isD20}
            onChange={(e) => setIsD20(e.target.checked)}
            className="rounded border-[var(--border-default)] accent-blue-600"
          />
          <span>Verificar Crítico/Falha (d20)</span>
        </label>

        {preview && (
          <span className="font-semibold text-sm">
            Total Previsto: <strong className="text-white">{preview.total}</strong>
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSaving || isNaN(numVal)}
        className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <Dice5 className="w-4 h-4" /> Registrar Dado Físico
      </button>

      {/* Resultado Confirmado */}
      {submitted && (
        <div
          className={`p-4 rounded-xl border text-center transition-all animate-in zoom-in-95 duration-150 ${
            submitted.isCritical
              ? "bg-amber-950/30 border-amber-500/80 shadow-lg shadow-amber-500/10"
              : submitted.isFumble
              ? "bg-red-950/30 border-red-500/80 shadow-lg shadow-red-500/10"
              : "bg-[var(--bg-secondary)] border-[var(--border-default)]"
          }`}
        >
          {submitted.isCritical && (
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1 mb-1">
              <Sparkles className="w-4 h-4" /> Sucesso Crítico! (20 Natural)
            </p>
          )}

          {submitted.isFumble && (
            <p className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="w-4 h-4" /> Falha Crítica! (1 Natural)
            </p>
          )}

          <div className="text-4xl font-extrabold tracking-tight my-1 text-[var(--text-primary)]">
            {submitted.total}
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            Dado: {submitted.physicalValue} {mod !== 0 && `${mod >= 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`}`} registrado com sucesso!
          </p>
        </div>
      )}
    </form>
  );
}
