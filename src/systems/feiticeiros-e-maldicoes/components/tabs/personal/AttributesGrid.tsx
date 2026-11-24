"use client";

import {
  FMCharacterData,
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  AttributeKey,
  getModifier,
  calcDefense,
  calcInitiative,
  calcAttention,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { Dices } from "lucide-react";

interface AttributesGridProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
  characterName?: string;
  characterId?: string;
  campaignId?: string;
}

export function AttributesGrid({
  data,
  onChange,
  characterName,
  characterId,
  campaignId,
}: AttributesGridProps) {
  const { openRoller } = useDice();

  function handleAttributeChange(key: AttributeKey, val: number) {
    const clamped = Math.max(0, Math.min(30, val || 0));
    onChange((prev) => {
      const updatedAttrs = { ...prev.attributes, [key]: clamped };
      const next: FMCharacterData = { ...prev, attributes: updatedAttrs };
      next.defense = {
        ...next.defense,
        dexMod: getModifier(updatedAttrs["DEX"] ?? 10),
        total: calcDefense(next),
      };
      next.initiative = calcInitiative(next);
      next.attention = calcAttention(next);
      return next;
    });
  }

  function handleRollAttribute(key: AttributeKey, mod: number) {
    openRoller({
      label: `Teste de ${ATTRIBUTE_LABELS[key]} (${key})`,
      modifier: mod,
      defaultDice: "1d20",
      roller: characterName || "Personagem",
      characterId,
      campaignId,
    });
  }

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
        Atributos Base (Clique no modificador para rolar)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {ATTRIBUTE_KEYS.map((key) => {
          const val = data.attributes[key] ?? 10;
          const mod = getModifier(val);
          return (
            <div
              key={key}
              className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] text-center transition-all hover:border-[var(--border-accent)]"
            >
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                {ATTRIBUTE_LABELS[key]} ({key})
              </p>
              <input
                type="number"
                min={0}
                max={30}
                value={val}
                onChange={(e) =>
                  handleAttributeChange(key, parseInt(e.target.value) || 0)
                }
                className="w-16 text-center text-2xl font-bold py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] mx-auto mb-1.5"
              />

              {/* Botão de rolagem com o modificador */}
              <button
                type="button"
                onClick={() => handleRollAttribute(key, mod)}
                className={`w-full flex items-center justify-center gap-1 text-sm font-bold py-1 px-2 rounded cursor-pointer transition-all ${
                  mod > 0
                    ? "text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/50 hover:text-emerald-300"
                    : mod < 0
                    ? "text-rose-400 bg-rose-950/30 hover:bg-rose-900/50 hover:text-rose-300"
                    : "text-zinc-400 bg-[#0B0C0E] hover:bg-zinc-800 hover:text-white"
                }`}
                title={`Rolar 1d20 ${mod >= 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`}`}
              >
                <Dices className="w-3.5 h-3.5" />
                <span>{mod >= 0 ? `+${mod}` : mod}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
