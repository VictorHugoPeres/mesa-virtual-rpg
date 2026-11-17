"use client";

import { ATTRIBUTE_KEYS, AttributeKey } from "../../constants";
import { getModifier } from "../../formulas";

interface ThreatAttributesFormProps {
  attributes: Record<AttributeKey, number>;
  onChange: (key: AttributeKey, val: number) => void;
}

export function ThreatAttributesForm({ attributes, onChange }: ThreatAttributesFormProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">
        Atributos
      </label>
      <div className="grid grid-cols-6 gap-2">
        {ATTRIBUTE_KEYS.map((key) => {
          const mod = getModifier(attributes[key]);
          return (
            <div
              key={key}
              className="text-center bg-[var(--bg-secondary)] p-2 rounded border border-[var(--border-default)]"
            >
              <span className="block text-[10px] text-[var(--text-muted)] font-bold">{key}</span>
              <input
                type="number"
                value={attributes[key]}
                onChange={(e) => onChange(key, Number(e.target.value))}
                className="w-full text-center bg-transparent text-sm font-semibold focus:outline-none text-[var(--text-primary)]"
              />
              <span className="text-[10px] text-red-400 font-medium">
                {mod >= 0 ? `+${mod}` : mod}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
