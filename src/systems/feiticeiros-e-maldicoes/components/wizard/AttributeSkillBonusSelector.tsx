"use client";

import { AttributeKey, getModifier } from "@/systems/feiticeiros-e-maldicoes";
import { Sparkles } from "lucide-react";

interface AttributeSkillBonusSelectorProps {
  attributes: Record<AttributeKey, number>;
  selectedAttribute: "INT" | "SAB";
  onSelectAttribute: (attr: "INT" | "SAB") => void;
}

export function AttributeSkillBonusSelector({
  attributes,
  selectedAttribute,
  onSelectAttribute,
}: AttributeSkillBonusSelectorProps) {
  const intVal = attributes.INT || 10;
  const sabVal = attributes.SAB || 10;
  const intMod = getModifier(intVal);
  const sabMod = getModifier(sabVal);

  const activeMod = selectedAttribute === "INT" ? intMod : sabMod;
  const extraPicks = Math.max(0, activeMod);

  return (
    <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-rose-950/40 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 block">
              Bônus por Atributo Cognitivo (Regra p. 283)
            </span>
            <span className="text-[11px] text-zinc-400">
              Escolha INT ou SAB para somar perícias extras iguais ao modificador ({extraPicks > 0 ? `+${extraPicks} perícias` : "0 bônus"}).
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
          +{extraPicks} Extra{extraPicks !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelectAttribute("INT")}
          className={`p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${
            selectedAttribute === "INT"
              ? "bg-[#14161A] border-rose-600 ring-1 ring-rose-600/50 text-rose-300 font-bold"
              : "bg-[#14161A]/60 border-[#23272F] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
          }`}
        >
          <div>
            <span className="block font-bold">Inteligência (INT)</span>
            <span className="text-[10px] text-zinc-500 font-mono">Valor: {intVal}</span>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">
            {intMod >= 0 ? `+${intMod}` : intMod}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAttribute("SAB")}
          className={`p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${
            selectedAttribute === "SAB"
              ? "bg-[#14161A] border-rose-600 ring-1 ring-rose-600/50 text-rose-300 font-bold"
              : "bg-[#14161A]/60 border-[#23272F] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
          }`}
        >
          <div>
            <span className="block font-bold">Sabedoria (SAB)</span>
            <span className="text-[10px] text-zinc-500 font-mono">Valor: {sabVal}</span>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">
            {sabMod >= 0 ? `+${sabMod}` : sabMod}
          </span>
        </button>
      </div>
    </div>
  );
}
