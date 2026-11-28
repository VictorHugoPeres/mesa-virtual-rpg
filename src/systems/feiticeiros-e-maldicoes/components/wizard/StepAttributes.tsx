"use client";

import { useState } from "react";
import {
  AttributeKey,
  ATTRIBUTE_KEYS,
  Origin,
  Specialization,
} from "@/systems/feiticeiros-e-maldicoes";
import { AttributeMethod } from "./wizardTypes";
import { Dices } from "lucide-react";
import { OriginBonusPicker } from "./OriginBonusPicker";
import { FixedValuesBar } from "./FixedValuesBar";
import { RollControlsBar } from "./RollControlsBar";
import { AttributeCard } from "./AttributeCard";

interface StepAttributesProps {
  origin: Origin;
  clan?: string;
  specialization: Specialization;
  method: AttributeMethod;
  setMethod: (m: AttributeMethod) => void;
  baseAttributes: Record<AttributeKey, number>;
  setBaseAttributes: (attrs: Record<AttributeKey, number>) => void;
  bonusPlus2: AttributeKey;
  setBonusPlus2: (attr: AttributeKey) => void;
  bonusPlus1: AttributeKey;
  setBonusPlus1: (attr: AttributeKey) => void;
  attributeBonuses?: Partial<Record<AttributeKey, number>>;
  setAttributeBonuses?: (bonuses: Partial<Record<AttributeKey, number>>) => void;
}

const POINT_COSTS: Record<number, number> = {
  8: -2, 9: -1, 10: 0, 11: 2, 12: 3, 13: 4, 14: 5, 15: 7,
};

const ATTR_TOOLTIPS: Record<AttributeKey, string> = {
  FOR: "Potência muscular, dano corpo a corpo bruto, atletismo e saltos.",
  DEX: "Agilidade, iniciativa, esquiva/defesa, pontaria e reflexos.",
  CON: "Vigor físico, base dos Pontos de Vida (PV) e resistência a venenos.",
  INT: "Raciocínio lógico, feitiçaria teórica, investigação e rituais.",
  SAB: "Percepção sensorial, notar mentiras, primeiros socorros e vontade mental.",
  PRE: "Presença de espírito, persuasão, intimidação e comando social.",
};

const FIXED_POOL = [15, 14, 13, 12, 10, 8];

function getSpecSlotOrder(spec: Specialization): Record<AttributeKey, number> {
  switch (spec) {
    case "Lutador": return { FOR: 0, CON: 1, DEX: 2, SAB: 3, PRE: 4, INT: 5 };
    case "Especialista em Combate": return { FOR: 0, DEX: 1, CON: 2, SAB: 3, INT: 4, PRE: 5 };
    case "Especialista em Técnica": return { INT: 0, CON: 1, SAB: 2, DEX: 3, PRE: 4, FOR: 5 };
    case "Controlador": return { PRE: 0, SAB: 1, CON: 2, DEX: 3, INT: 4, FOR: 5 };
    case "Suporte": return { SAB: 0, PRE: 1, CON: 2, DEX: 3, INT: 4, FOR: 5 };
    case "Restringido": return { FOR: 0, DEX: 1, CON: 2, SAB: 3, PRE: 4, INT: 5 };
    default: return { FOR: 0, CON: 1, DEX: 2, INT: 3, SAB: 4, PRE: 5 };
  }
}

function deriveInitialSlots(baseAttrs: Record<AttributeKey, number>, pool: number[]) {
  const result: Record<AttributeKey, number | null> = { FOR: null, DEX: null, CON: null, INT: null, SAB: null, PRE: null };
  const used = new Set<number>();
  (ATTRIBUTE_KEYS as readonly AttributeKey[]).forEach((key) => {
    const val = baseAttrs[key];
    if (val > 0) {
      const idx = pool.findIndex((pVal, pIdx) => pVal === val && !used.has(pIdx));
      if (idx !== -1) { result[key] = idx; used.add(idx); }
    }
  });
  return result;
}

export function StepAttributes({
  origin,
  clan,
  specialization,
  method,
  setMethod,
  baseAttributes,
  setBaseAttributes,
  bonusPlus2,
  setBonusPlus2,
  bonusPlus1,
  setBonusPlus1,
  attributeBonuses = {},
  setAttributeBonuses,
}: StepAttributesProps) {
  const isRestringido = origin === "Restringido";
  const [rolledPool, setRolledPool] = useState<number[]>([]);
  const currentPool = method === "roll" ? rolledPool : FIXED_POOL;

  const [slotAssignments, setSlotAssignments] = useState<Record<AttributeKey, number | null>>(() =>
    deriveInitialSlots(baseAttributes, currentPool)
  );

  const pointsSpent = Object.values(baseAttributes).reduce((acc, val) => acc + (POINT_COSTS[val] ?? 0), 0);
  const remainingPoints = 17 - pointsSpent;

  function roll4d6DropLowest(): number {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => a - b);
    return rolls[1] + rolls[2] + rolls[3];
  }

  function applySuggestedValues(pool: number[]) {
    const p = [...pool].sort((a, b) => b - a);
    const order = getSpecSlotOrder(specialization);
    const newAssignments: Record<AttributeKey, number | null> = { ...order };
    const newAttrs: Record<AttributeKey, number> = {
      FOR: p[order.FOR] || 0,
      DEX: p[order.DEX] || 0,
      CON: p[order.CON] || 0,
      INT: p[order.INT] || 0,
      SAB: p[order.SAB] || 0,
      PRE: p[order.PRE] || 0,
    };
    setSlotAssignments(newAssignments);
    setBaseAttributes(newAttrs);
  }

  function handleRollAll() {
    const rolled = Array.from({ length: 6 }, () => roll4d6DropLowest()).sort((a, b) => b - a);
    setRolledPool(rolled);
    applySuggestedValues(rolled);
  }

  function handleSelectSlot(attrKey: AttributeKey, newSlotIndex: number) {
    const nextAssignments = { ...slotAssignments };
    const nextBase = { ...baseAttributes };

    if (newSlotIndex === -1) {
      nextAssignments[attrKey] = null;
      nextBase[attrKey] = 0;
      setSlotAssignments(nextAssignments);
      setBaseAttributes(nextBase);
      return;
    }

    const currentSlotOfThis = slotAssignments[attrKey];
    const prevOwner = (ATTRIBUTE_KEYS as readonly AttributeKey[]).find(
      (k) => k !== attrKey && slotAssignments[k] === newSlotIndex
    );

    nextAssignments[attrKey] = newSlotIndex;
    nextBase[attrKey] = currentPool[newSlotIndex] || 0;

    if (prevOwner) {
      if (currentSlotOfThis !== null) {
        nextAssignments[prevOwner] = currentSlotOfThis;
        nextBase[prevOwner] = currentPool[currentSlotOfThis] || 0;
      } else {
        nextAssignments[prevOwner] = null;
        nextBase[prevOwner] = 0;
      }
    }

    setSlotAssignments(nextAssignments);
    setBaseAttributes(nextBase);
  }

  function getFinalValue(key: AttributeKey): number {
    const base = baseAttributes[key] || 0;
    if (base === 0) return 0;
    if (attributeBonuses && Object.keys(attributeBonuses).length > 0) {
      return base + (attributeBonuses[key] || 0);
    }
    let bonus = 0;
    if (isRestringido) {
      if (key === "FOR" || key === "DEX" || key === "CON") bonus += 1;
      if (key === bonusPlus2) bonus += 2;
    } else {
      if (key === bonusPlus2) bonus += 2;
      if (key === bonusPlus1) bonus += 1;
    }
    return base + bonus;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-zinc-100">Passo 3: Distribuição de Atributos</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Distribua os atributos e configure os bônus da Origem ({origin}). Inclui Presença (PRE) e tabela v2.5.
        </p>
      </div>

      <div className="flex gap-2 p-1 rounded-xl bg-[#0B0C0E] border border-[#23272F]">
        <button
          type="button"
          onClick={() => {
            setMethod("fixed");
            setSlotAssignments({ FOR: null, DEX: null, CON: null, INT: null, SAB: null, PRE: null });
            setBaseAttributes({ FOR: 0, DEX: 0, CON: 0, INT: 0, SAB: 0, PRE: 0 });
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            method === "fixed" ? "bg-rose-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Valores Fixos
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod("pointBuy");
            setSlotAssignments({ FOR: null, DEX: null, CON: null, INT: null, SAB: null, PRE: null });
            setBaseAttributes({ FOR: 10, DEX: 10, CON: 10, INT: 10, SAB: 10, PRE: 10 });
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            method === "pointBuy" ? "bg-rose-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Compra (17 pts v2.5)
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod("roll");
            handleRollAll();
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            method === "roll" ? "bg-rose-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Dices className="w-3.5 h-3.5" /> Rolar 4d6
        </button>
      </div>

      {method === "fixed" && (
        <FixedValuesBar
          specialization={specialization}
          baseAttributes={baseAttributes}
          onAssignValue={(_, val) => {
            const idx = FIXED_POOL.indexOf(val);
            if (idx !== -1) {
              const targetKey = (ATTRIBUTE_KEYS as readonly AttributeKey[]).find(
                (k) => slotAssignments[k] === null || baseAttributes[k] === 0
              );
              if (targetKey) handleSelectSlot(targetKey, idx);
            }
          }}
          onReset={() => {
            setSlotAssignments({ FOR: null, DEX: null, CON: null, INT: null, SAB: null, PRE: null });
            setBaseAttributes({ FOR: 0, DEX: 0, CON: 0, INT: 0, SAB: 0, PRE: 0 });
          }}
          onApplySuggested={() => applySuggestedValues(FIXED_POOL)}
        />
      )}

      {method === "roll" && (
        <RollControlsBar
          rolledPool={rolledPool}
          onRollAll={handleRollAll}
          onApplySuggested={() => applySuggestedValues(rolledPool)}
          onApplyPool={(pool) => {
            setRolledPool(pool);
            applySuggestedValues(pool);
          }}
        />
      )}

      {method === "pointBuy" && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-xs">
          <span className="text-zinc-300">Pontos Restantes para Comprar (17 pts):</span>
          <span className={`font-bold font-mono px-2 py-0.5 rounded ${remainingPoints < 0 ? "bg-rose-950 text-rose-300" : "bg-[#14161A] text-emerald-400 border border-emerald-900/40"}`}>
            {remainingPoints} / 17
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ATTRIBUTE_KEYS.map((key: AttributeKey) => (
          <AttributeCard
            key={key}
            attrKey={key}
            tooltip={ATTR_TOOLTIPS[key]}
            baseVal={baseAttributes[key] || 0}
            finalVal={getFinalValue(key)}
            method={method}
            currentPool={currentPool}
            assignedSlot={slotAssignments[key]}
            slotAssignments={slotAssignments}
            onSelectSlot={(slotIdx) => handleSelectSlot(key, slotIdx)}
            onPointBuyChange={(val) => setBaseAttributes({ ...baseAttributes, [key]: val })}
            remainingPoints={remainingPoints}
          />
        ))}
      </div>

      <OriginBonusPicker
        origin={origin}
        clan={clan}
        bonusPlus2={bonusPlus2}
        setBonusPlus2={setBonusPlus2}
        bonusPlus1={bonusPlus1}
        setBonusPlus1={setBonusPlus1}
        attributeBonuses={attributeBonuses}
        setAttributeBonuses={setAttributeBonuses}
      />
    </div>
  );
}
