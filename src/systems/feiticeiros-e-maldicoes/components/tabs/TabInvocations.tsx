"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { InvocationCard, InvocationItem } from "./invocations/InvocationCard";
import { Ghost, Plus } from "lucide-react";

interface TabInvocationsProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function TabInvocations({ data, onChange }: TabInvocationsProps) {
  const invocations = data.invocations || [];

  function handleAddInvocation() {
    onChange((prev) => ({
      ...prev,
      invocations: [
        ...prev.invocations,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: `Invocação ${prev.invocations.length + 1}`,
          grade: "4° Grau",
          hpCurrent: 12,
          hpMax: 12,
          ca: 12,
          movement: 9,
          attributes: {
            FOR: 12,
            DEX: 12,
            CON: 10,
            INT: 6,
            SAB: 10,
            CAR: 6,
          },
          actionsAndTraits: "Ataque Básico (Garras/Mordida): 1d6+1 físico",
        },
      ],
    }));
  }

  function handleUpdateInvocation(
    idx: number,
    updater: (prev: InvocationItem) => InvocationItem
  ) {
    onChange((prev) => {
      const list = [...prev.invocations];
      list[idx] = updater(list[idx] as unknown as InvocationItem);
      return { ...prev, invocations: list };
    });
  }

  function handleRemoveInvocation(idx: number) {
    onChange((prev) => ({
      ...prev,
      invocations: prev.invocations.filter((_, i) => i !== idx),
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Ghost className="w-5 h-5 text-indigo-400" />
            Shikigamis & Invocações ({invocations.length} / 5)
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Entidades invocadas através de técnicas amaldiçoadas, contratos de marionetes ou corpos mutantes.
          </p>
        </div>

        {invocations.length < 5 && (
          <button
            type="button"
            onClick={handleAddInvocation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nova Invocação
          </button>
        )}
      </div>

      {invocations.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
          <Ghost className="w-10 h-10 mx-auto mb-2 text-[var(--text-muted)] opacity-40" />
          <p className="text-sm text-[var(--text-muted)]">
            Nenhuma invocação ou shikigami cadastrado.
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Clique em &quot;Nova Invocação&quot; para cadastrar até 5 shikigamis controlados pelo personagem.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {invocations.map((inv, idx) => (
            <InvocationCard
              key={inv.id || idx}
              inv={inv as unknown as InvocationItem}
              idx={idx}
              onUpdate={handleUpdateInvocation}
              onRemove={handleRemoveInvocation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
