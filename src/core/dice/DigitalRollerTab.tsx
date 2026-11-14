"use client";

import { useState } from "react";
import { rollDigitalDice, RollResult } from "./diceParser";
import { RollRequest, useDice } from "./DiceContext";
import { Dices, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

interface DigitalRollerTabProps {
  request: RollRequest | null;
  onSuccess: () => void;
}

export function DigitalRollerTab({ request, onSuccess }: DigitalRollerTabProps) {
  const { notifyRollSaved } = useDice();
  const defaultDiceType = request?.defaultDice || "1d20";
  const defaultMod = request?.modifier ?? 0;

  const [formula, setFormula] = useState(
    defaultMod !== 0
      ? `${defaultDiceType}${defaultMod >= 0 ? `+${defaultMod}` : defaultMod}`
      : defaultDiceType
  );
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">(
    "normal"
  );
  const [result, setResult] = useState<RollResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleRoll() {
    const res = rollDigitalDice(formula, rollMode);
    setResult(res);
    setIsSaving(true);

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
        }),
      });
      notifyRollSaved();
    } catch (err) {
      console.error("Erro ao salvar log de rolagem:", err);
    } finally {
      setIsSaving(false);
    }
  }

  const dicePresets = ["1d20", "1d4", "1d6", "1d8", "1d10", "1d12", "1d100"];

  return (
    <div className="space-y-4">
      {/* Fórmula & Atalhos */}
      <div>
        <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
          Fórmula do Dado
        </label>
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

      {/* Botões de Vantagem / Desvantagem */}
      <div className="flex gap-2">
        {(
          [
            { id: "normal", label: "Normal" },
            { id: "advantage", label: "Vantagem (2d20)" },
            { id: "disadvantage", label: "Desvantagem (2d20)" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setRollMode(m.id)}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              rollMode === m.id
                ? "bg-blue-950/60 border-blue-500 text-blue-300"
                : "bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Atalhos rápidos de dados */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {dicePresets.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              const mod = request?.modifier ?? 0;
              setFormula(mod !== 0 ? `${d}${mod >= 0 ? `+${mod}` : mod}` : d);
            }}
            className="px-2.5 py-1 text-xs rounded bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-default)] text-[var(--text-secondary)] font-mono cursor-pointer"
          >
            {d}
          </button>
        ))}
      </div>

      {/* Destaque Visual do Resultado */}
      {result && (
        <div
          className={`p-4 rounded-xl border text-center transition-all animate-in zoom-in-95 duration-150 ${
            result.isCritical
              ? "bg-amber-950/30 border-amber-500/80 shadow-lg shadow-amber-500/10"
              : result.isFumble
              ? "bg-red-950/30 border-red-500/80 shadow-lg shadow-red-500/10"
              : "bg-[var(--bg-secondary)] border-[var(--border-default)]"
          }`}
        >
          {result.isCritical && (
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1 mb-1">
              <Sparkles className="w-4 h-4" /> Sucesso Crítico! (20 Natural)
            </p>
          )}

          {result.isFumble && (
            <p className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="w-4 h-4" /> Falha Crítica! (1 Natural)
            </p>
          )}

          <div className="text-4xl font-extrabold tracking-tight my-1 text-[var(--text-primary)]">
            {result.total}
          </div>

          <div className="text-xs text-[var(--text-secondary)] flex items-center justify-center gap-2">
            <span>
              Dados: [
              {result.rolls.map((r, i) => (
                <span
                  key={i}
                  className={`mx-0.5 font-bold ${
                    result.keptIndex !== undefined && result.keptIndex !== i
                      ? "line-through opacity-40"
                      : r === 20
                      ? "text-amber-400"
                      : r === 1
                      ? "text-red-400"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {r}
                </span>
              ))}
              ]
            </span>
            {result.modifier !== 0 && (
              <span>
                {result.modifier >= 0
                  ? `+ ${result.modifier}`
                  : `- ${Math.abs(result.modifier)}`}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
