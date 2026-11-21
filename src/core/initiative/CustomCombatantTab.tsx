"use client";

import { useState } from "react";
import { CombatParticipant } from "./initiativeTypes";
import { generateId } from "@/lib/id";

interface CustomCombatantTabProps {
  onAddParticipant: (participant: CombatParticipant) => void;
  onClose: () => void;
}

export function CustomCombatantTab({ onAddParticipant, onClose }: CustomCombatantTabProps) {
  const [customName, setCustomName] = useState("");
  const [customType, setCustomType] = useState<"PC" | "THREAT">("THREAT");
  const [customHp, setCustomHp] = useState(20);
  const [customDefense, setCustomDefense] = useState(10);
  const [customInitBonus, setCustomInitBonus] = useState(0);

  function handleAddCustom() {
    if (!customName.trim()) return;

    const participant: CombatParticipant = {
      id: generateId("custom"),
      name: customName.trim(),
      type: customType,
      initiative: 0,
      initiativeBonus: customInitBonus,
      maxHp: customHp,
      currentHp: customHp,
      defense: customDefense,
      conditions: [],
      isVisible: true,
    };

    onAddParticipant(participant);
    setCustomName("");
    onClose();
  }

  return (
    <div className="space-y-3 text-xs">
      <div>
        <label className="block text-[var(--text-secondary)] font-medium mb-1">
          Nome do Combatente
        </label>
        <input
          type="text"
          placeholder="Ex: Maldição Furtiva, Guarda, Cão Amaldiçoado"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[var(--text-secondary)] font-medium mb-1">Tipo</label>
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value as "PC" | "THREAT")}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg px-2.5 py-2 text-white focus:outline-none"
          >
            <option value="THREAT">Ameaça / Inimigo</option>
            <option value="PC">Jogador / Aliado</option>
          </select>
        </div>
        <div>
          <label className="block text-[var(--text-secondary)] font-medium mb-1">
            Pontos de Vida (PV)
          </label>
          <input
            type="number"
            value={customHp}
            onChange={(e) => setCustomHp(Number(e.target.value) || 1)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[var(--text-secondary)] font-medium mb-1">Defesa / CA</label>
          <input
            type="number"
            value={customDefense}
            onChange={(e) => setCustomDefense(Number(e.target.value) || 10)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[var(--text-secondary)] font-medium mb-1">
            Bônus de Iniciativa
          </label>
          <input
            type="number"
            value={customInitBonus}
            onChange={(e) => setCustomInitBonus(Number(e.target.value) || 0)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-white focus:outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddCustom}
        disabled={!customName.trim()}
        className="w-full py-2.5 mt-2 rounded-lg font-bold text-xs bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-40 cursor-pointer transition-colors"
      >
        Adicionar Combatente Customizado
      </button>
    </div>
  );
}
