"use client";

import { AttributeKey, ATTRIBUTE_KEYS, ATTRIBUTE_LABELS, Origin } from "@/systems/feiticeiros-e-maldicoes";
import { ArrowUpRight } from "lucide-react";

interface OriginBonusPickerProps {
  origin: Origin;
  bonusPlus2: AttributeKey;
  setBonusPlus2: (attr: AttributeKey) => void;
  bonusPlus1: AttributeKey;
  setBonusPlus1: (attr: AttributeKey) => void;
}

export function OriginBonusPicker({
  origin,
  bonusPlus2,
  setBonusPlus2,
  bonusPlus1,
  setBonusPlus1,
}: OriginBonusPickerProps) {
  const isRestringido = origin === "Restringido";

  return (
    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] space-y-2">
      <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
        <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
        Bônus da Origem ({origin})
      </h4>

      {isRestringido ? (
        <div className="flex items-center gap-4 text-xs">
          <span className="text-[var(--text-secondary)] font-medium">FOR (+2 fixo) e escolha +2 em:</span>
          <select
            value={bonusPlus2}
            onChange={(e) => setBonusPlus2(e.target.value as AttributeKey)}
            className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs font-semibold"
          >
            <option value="DEX">Destreza (+2)</option>
            <option value="CON">Constituição (+2)</option>
          </select>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-[var(--text-muted)] mb-1">Bônus Primário (+2):</label>
            <select
              value={bonusPlus2}
              onChange={(e) => {
                const val = e.target.value as AttributeKey;
                setBonusPlus2(val);
                if (val === bonusPlus1) {
                  const fallback = ATTRIBUTE_KEYS.find((k: AttributeKey) => k !== val) || "CON";
                  setBonusPlus1(fallback);
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs font-semibold"
            >
              {ATTRIBUTE_KEYS.map((k: AttributeKey) => (
                <option key={k} value={k}>{ATTRIBUTE_LABELS[k]} (+2)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-[var(--text-muted)] mb-1">Bônus Secundário (+1):</label>
            <select
              value={bonusPlus1}
              onChange={(e) => setBonusPlus1(e.target.value as AttributeKey)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs font-semibold"
            >
              {ATTRIBUTE_KEYS.filter((k: AttributeKey) => k !== bonusPlus2).map((k: AttributeKey) => (
                <option key={k} value={k}>{ATTRIBUTE_LABELS[k]} (+1)</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
