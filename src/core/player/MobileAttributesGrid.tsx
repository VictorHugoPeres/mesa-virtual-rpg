"use client";

import {
  FMCharacterData,
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  AttributeKey,
  getModifier,
  calcDefense,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";

interface MobileAttributesGridProps {
  sheet: FMCharacterData;
  characterName: string;
  characterId: string;
  campaignId: string;
}

export function MobileAttributesGrid({
  sheet,
  characterName,
  characterId,
  campaignId,
}: MobileAttributesGridProps) {
  const { openRoller } = useDice();
  const def = calcDefense(sheet);

  return (
    <div className="space-y-3">
      {/* 4 Estatísticas Principais v2.5 */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-[#14161A] border border-[#23272F]">
          <span className="text-[10px] text-zinc-400 font-bold block">Defesa (CA)</span>
          <span className="text-base font-black text-zinc-100">{def}</span>
        </div>
        <button
          type="button"
          onClick={() =>
            openRoller({
              label: "Iniciativa",
              modifier: sheet.initiative ?? 0,
              defaultDice: "1d20",
              roller: characterName,
              characterId,
              campaignId,
            })
          }
          className="p-2 rounded-xl bg-[#14161A] border border-[#23272F] hover:border-amber-400/50 hover:bg-[#1A1D24] transition-colors cursor-pointer"
        >
          <span className="text-[10px] text-zinc-400 font-bold block">Iniciativa</span>
          <span className="text-base font-black text-amber-400">
            {sheet.initiative >= 0 ? `+${sheet.initiative}` : sheet.initiative}
          </span>
        </button>
        <div className="p-2 rounded-xl bg-[#14161A] border border-[#23272F]">
          <span className="text-[10px] text-zinc-400 font-bold block">Desloc.</span>
          <span className="text-base font-black text-sky-400">{sheet.movement ?? 9}m</span>
        </div>
        <div className="p-2 rounded-xl bg-[#14161A] border border-[#23272F]">
          <span className="text-[10px] text-zinc-400 font-bold block">Atenção</span>
          <span className="text-base font-black text-purple-400">{sheet.attention ?? 10}</span>
        </div>
      </div>

      {/* Grid de Atributos (PRE incluído) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Atributos Base (Toque para Rolar)
        </span>
        <div className="grid grid-cols-3 gap-2">
          {ATTRIBUTE_KEYS.map((k: AttributeKey) => {
            const val = sheet.attributes[k] ?? 10;
            const mod = getModifier(val);
            const modStr = mod >= 0 ? `+${mod}` : `${mod}`;

            return (
              <button
                key={k}
                type="button"
                onClick={() =>
                  openRoller({
                    label: `Teste de ${ATTRIBUTE_LABELS[k]} (${k})`,
                    modifier: mod,
                    defaultDice: "1d20",
                    roller: characterName,
                    characterId,
                    campaignId,
                  })
                }
                className="p-2.5 rounded-xl bg-[#14161A] border border-[#23272F] hover:border-white/20 hover:bg-[#1A1D24] text-center transition-colors cursor-pointer shadow-xs"
              >
                <span className="text-[11px] font-bold text-zinc-400 block">{k}</span>
                <span className="text-sm font-black text-zinc-100 block leading-tight">{val}</span>
                <span className={`text-xs font-bold block ${mod >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {modStr}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
