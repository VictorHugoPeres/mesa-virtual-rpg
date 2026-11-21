"use client";

import {
  FMCharacterData,
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  AttributeKey,
  getModifier,
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

  return (
    <div className="space-y-3">
      {/* 4 Estatísticas Principais */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
          <span className="text-[10px] text-[var(--text-muted)] font-bold block">Defesa</span>
          <span className="text-base font-black text-emerald-400">{sheet.defense?.total ?? 10}</span>
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
          className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-amber-400 active:scale-95 transition-all cursor-pointer touch-manipulation select-none"
        >
          <span className="text-[10px] text-[var(--text-muted)] font-bold block">Iniciativa</span>
          <span className="text-base font-black text-amber-400">
            {sheet.initiative >= 0 ? `+${sheet.initiative}` : sheet.initiative}
          </span>
        </button>
        <div className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
          <span className="text-[10px] text-[var(--text-muted)] font-bold block">Desloc.</span>
          <span className="text-base font-black text-blue-400">{sheet.movement ?? 9}m</span>
        </div>
        <div className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
          <span className="text-[10px] text-[var(--text-muted)] font-bold block">Atenção</span>
          <span className="text-base font-black text-purple-400">{sheet.attention ?? 10}</span>
        </div>
      </div>

      {/* Grid de Atributos */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
          Atributos (Toque para Rolar)
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
                    label: `Teste de ${ATTRIBUTE_LABELS[k]}`,
                    modifier: mod,
                    defaultDice: "1d20",
                    roller: characterName,
                    characterId,
                    campaignId,
                  })
                }
                className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-blue-500 active:scale-95 text-center transition-all cursor-pointer shadow-xs touch-manipulation select-none"
              >
                <span className="text-[11px] font-bold text-[var(--text-secondary)] block">{k}</span>
                <span className="text-sm font-black text-[var(--text-primary)] block leading-tight">{val}</span>
                <span className="text-xs font-bold text-emerald-400 block">{modStr}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
