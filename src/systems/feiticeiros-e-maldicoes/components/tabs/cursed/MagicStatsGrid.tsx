"use client";

import { Dices } from "lucide-react";
import { AttributeKey } from "@/systems/feiticeiros-e-maldicoes";

interface MagicStatsGridProps {
  level: number;
  calcDC: number;
  calcAttack: number;
  halfLevel: number;
  prof: number;
  techAttr: AttributeKey;
  techAttrMod: number;
  techAttrValue: number;
  isRestringido: boolean;
  onRollSpellAttack: () => void;
}

export function MagicStatsGrid({
  level,
  calcDC,
  calcAttack,
  halfLevel,
  prof,
  techAttr,
  techAttrMod,
  techAttrValue,
  isRestringido,
  onRollSpellAttack,
}: MagicStatsGridProps) {
  if (isRestringido) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-[#0B0C0E] border border-[#23272F] mb-4">
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-amber-400">
            Estilo do Restringido
          </p>
          <p className="text-lg font-bold text-amber-300">Físico Puro</p>
          <p className="text-[10px] text-zinc-500 font-mono">0 PE • Alimentado por Estamina</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-zinc-400">
            Bônus de Treino (BT)
          </p>
          <p className="text-2xl font-bold text-zinc-200">+{prof}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Nível {level}</p>
        </div>
        <div className="text-center col-span-2 sm:col-span-1">
          <p className="text-[10px] uppercase font-bold text-zinc-400">
            Metade do Nível ⌊N/2⌋
          </p>
          <p className="text-2xl font-bold text-zinc-200">+{halfLevel}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Aplica em Ataques & Manobras</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-[#0B0C0E] border border-[#23272F] mb-4">
      <div className="text-center">
        <p className="text-[10px] uppercase font-bold text-zinc-400">
          CD de Resistência (v2.5)
        </p>
        <p className="text-2xl font-bold text-sky-400">{calcDC}</p>
        <p className="text-[10px] text-zinc-500 font-mono">
          10 + ⌊N/2⌋ (+{halfLevel}) + BT (+{prof}) + Mod ({techAttrMod >= 0 ? `+${techAttrMod}` : techAttrMod})
        </p>
      </div>

      <button
        type="button"
        onClick={onRollSpellAttack}
        className="text-center p-1.5 rounded-lg border border-transparent hover:border-emerald-500/50 hover:bg-[#14161A] transition-all cursor-pointer group"
        title="Clique para rolar Acerto Mágico (1d20 + bônus)"
      >
        <div className="flex items-center justify-center gap-1">
          <p className="text-[10px] uppercase font-bold text-zinc-400 group-hover:text-emerald-300">
            Acerto de Feitiço
          </p>
          <Dices className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100" />
        </div>
        <p className="text-2xl font-bold text-emerald-400">
          {calcAttack >= 0 ? `+${calcAttack}` : calcAttack}
        </p>
        <p className="text-[10px] text-zinc-500 font-mono">
          Mod ({techAttrMod >= 0 ? `+${techAttrMod}` : techAttrMod}) + ⌊N/2⌋ (+{halfLevel}) + BT (+{prof})
        </p>
      </button>

      <div className="text-center">
        <p className="text-[10px] uppercase font-bold text-zinc-400">
          Bônus de Treino (BT)
        </p>
        <p className="text-2xl font-bold text-zinc-200">+{prof}</p>
        <p className="text-[10px] text-zinc-500 font-mono">Nível {level}</p>
      </div>

      <div className="text-center">
        <p className="text-[10px] uppercase font-bold text-zinc-400">
          Modificador ({techAttr})
        </p>
        <p className="text-2xl font-bold text-zinc-200">
          {techAttrMod >= 0 ? `+${techAttrMod}` : techAttrMod}
        </p>
        <p className="text-[10px] text-zinc-500 font-mono">Valor {techAttrValue}</p>
      </div>
    </div>
  );
}
