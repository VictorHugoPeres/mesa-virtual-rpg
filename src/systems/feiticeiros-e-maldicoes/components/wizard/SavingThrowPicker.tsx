"use client";

import { Specialization } from "@/systems/feiticeiros-e-maldicoes";
import { Shield, Check } from "lucide-react";

interface SavingThrowPickerProps {
  specialization: Specialization;
  chosenTR?: string;
  onSelectTR: (tr: string) => void;
}

const TR_OPTIONS: Record<Specialization, { auto?: string[]; choices?: string[] }> = {
  Lutador: { choices: ["Fortitude", "Reflexos"] },
  "Especialista em Combate": { choices: ["Fortitude", "Reflexos"] },
  "Especialista em Técnica": { choices: ["Astúcia", "Vontade"] },
  Controlador: { choices: ["Astúcia", "Vontade"] },
  Suporte: { choices: ["Astúcia", "Vontade"] },
  Restringido: { auto: ["Fortitude", "Reflexos"] },
};

export function SavingThrowPicker({
  specialization,
  chosenTR,
  onSelectTR,
}: SavingThrowPickerProps) {
  const config = TR_OPTIONS[specialization] || { choices: ["Fortitude", "Reflexos"] };

  if (config.auto) {
    return (
      <div className="p-3 rounded-xl bg-[#0B0C0E] border border-amber-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-zinc-200 block">
              Testes de Resistência Automáticos (Voto Celestial)
            </span>
            <span className="text-[11px] text-zinc-400">
              {config.auto.join(" E ")} (Ambos treinados no 1º Nível)
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300">
          Automático
        </span>
      </div>
    );
  }

  const choices = config.choices || ["Fortitude", "Reflexos"];
  const current = chosenTR || choices[0];

  return (
    <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#23272F] space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 block">
              Teste de Resistência (TR da Especialização)
            </span>
            <span className="text-[11px] text-zinc-400">
              Escolha qual Teste de Resistência primário sua especialização concede:
            </span>
          </div>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">1 Obrigatório</span>
      </div>

      <div className="flex gap-2">
        {choices.map((tr) => {
          const isSelected = current === tr;
          return (
            <button
              key={tr}
              type="button"
              onClick={() => onSelectTR(tr)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                isSelected
                  ? "bg-sky-950/60 border-sky-500 text-sky-300 ring-1 ring-sky-500/50"
                  : "bg-[#14161A] border-[#23272F] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
              }`}
            >
              {isSelected && <Check className="w-3 h-3" />}
              <span>TR de {tr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
