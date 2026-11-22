"use client";

import { useState, useEffect } from "react";
import { CombatState } from "../initiative/initiativeTypes";

export interface CombatTarget {
  id: string;
  name: string;
  type: "PC" | "NPC" | "THREAT";
  defense: number;
  currentHp: number;
  maxHp: number;
  characterId?: string;
}

export function useCombatTargets(campaignId?: string, excludeName?: string) {
  const [targets, setTargets] = useState<CombatTarget[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [hasCombat, setHasCombat] = useState(false);

  useEffect(() => {
    if (!campaignId) {
      setTargets([]);
      setHasCombat(false);
      return;
    }

    fetch(`/api/campaigns/${campaignId}/combat`)
      .then((res) => res.json())
      .then((data) => {
        if (data.combatState) {
          const cs: CombatState = data.combatState;
          if (cs.participants && cs.participants.length > 0) {
            setHasCombat(true);
            const filtered = cs.participants
              .filter((p) => p.isVisible && (!excludeName || p.name.toLowerCase() !== excludeName.toLowerCase()))
              .map((p) => ({
                id: p.id,
                name: p.name,
                type: p.type,
                defense: p.defense ?? 10,
                currentHp: p.currentHp,
                maxHp: p.maxHp,
                characterId: p.characterId,
              }));
            setTargets(filtered);
          } else {
            setHasCombat(false);
            setTargets([]);
          }
        }
      })
      .catch((err) => console.warn("Erro ao buscar alvos de combate:", err));
  }, [campaignId, excludeName]);

  const selectedTarget = targets.find((t) => t.id === selectedTargetId) || null;

  return {
    targets,
    selectedTargetId,
    setSelectedTargetId,
    selectedTarget,
    hasCombat,
  };
}
