"use client";

import { useState } from "react";
import { PenLine, Check, AlertCircle } from "lucide-react";

interface PhysicalDiceInputProps {
  currentPool: number[];
  onApplyPool: (values: number[]) => void;
}

export function PhysicalDiceInput({ currentPool, onApplyPool }: PhysicalDiceInputProps) {
  const [inputs, setInputs] = useState<string[]>(() => {
    if (currentPool && currentPool.length === 6) {
      return currentPool.map(String);
    }
    return ["15", "14", "13", "12", "10", "8"];
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(index: number, val: string) {
    const next = [...inputs];
    next[index] = val;
    setInputs(next);
    setError(null);
  }

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    const parsed: number[] = [];
    for (let i = 0; i < 6; i++) {
      const num = parseInt(inputs[i], 10);
      if (isNaN(num) || num < 3 || num > 18) {
        setError(`O dado #${i + 1} deve ser um valor válido entre 3 e 18.`);
        return;
      }
      parsed.push(num);
    }

    // Ordena decrescente para o pool de atributos
    parsed.sort((a, b) => b - a);
    onApplyPool(parsed);
    setError(null);
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-purple-300 flex items-center gap-1.5">
          <PenLine className="w-3.5 h-3.5" /> Digite os 6 valores tirados na mesa (3 a 18):
        </span>
        <button
          type="submit"
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" /> Aplicar na Ficha
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {inputs.map((val, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <label className="text-[10px] text-[var(--text-muted)] font-mono text-center">
              Dado #{idx + 1}
            </label>
            <input
              type="number"
              min={3}
              max={18}
              value={val}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder="3-18"
              className="w-full text-center py-1.5 px-1 rounded-lg bg-[var(--bg-secondary)] border border-purple-800/40 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
    </form>
  );
}
