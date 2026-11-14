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

interface AttributesGridProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function AttributesGrid({ data, onChange }: AttributesGridProps) {
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

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
        Atributos Base
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
                className="w-16 text-center text-2xl font-bold py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] mx-auto mb-1"
              />
              <div
                className={`text-sm font-bold py-0.5 rounded ${
                  mod >= 0
                    ? "text-green-400 bg-green-950/30"
                    : "text-red-400 bg-red-950/30"
                }`}
              >
                {mod >= 0 ? `+${mod}` : mod}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
