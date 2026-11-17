"use client";

import { useEffect, useState, useCallback } from "react";
import { Shield, Swords } from "lucide-react";
import { useCampaignSync } from "@/core/sync/useCampaignSync";
import { CombatState, CombatParticipant, EMPTY_COMBAT, combatToTvData } from "./initiativeTypes";
import { ParticipantRow } from "./ParticipantRow";
import { InitiativeControls } from "./InitiativeControls";
import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes/schemas";

interface CampaignCharItem {
  id: string;
  name: string;
  type: string;
  data: string;
}

interface InitiativePanelProps {
  campaignId: string;
  characters: CampaignCharItem[];
}

export function InitiativePanel({ campaignId, characters }: InitiativePanelProps) {
  const [combatState, setCombatState] = useState<CombatState>(EMPTY_COMBAT);

  const handleSyncEvent = useCallback((event: any) => {
    if (event.type === "INITIATIVE_UPDATE" && event.payload) {
      loadCombat();
    }
  }, []);

  const { emit } = useCampaignSync({ campaignId, onEvent: handleSyncEvent });

  async function loadCombat() {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/combat`);
      if (res.ok) {
        const data = await res.json();
        setCombatState(data.combatState ?? EMPTY_COMBAT);
      }
    } catch (e) {
      console.error("Failed to load combat state", e);
    }
  }

  async function saveCombat(updated: CombatState) {
    setCombatState(updated);
    try {
      await fetch(`/api/campaigns/${campaignId}/combat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ combatState: updated }),
      });
      // Notifica abas locais (BroadcastChannel)
      emit("INITIATIVE_UPDATE", combatToTvData(updated));
    } catch (e) {
      console.error("Failed to save combat", e);
    }
  }

  useEffect(() => {
    loadCombat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  // Listener para evento customizado de clonar ameaça do Bestiário
  useEffect(() => {
    function handleCloneEvent(e: Event) {
      const customEv = e as CustomEvent<{
        threatName: string;
        threatId: string;
        charData: FMCharacterData;
      }>;
      if (!customEv.detail) return;
      const { threatName, threatId, charData } = customEv.detail;

      setCombatState((prev) => {
        const existingCount = prev.participants.filter(
          (p) => p.characterId === threatId || p.name.startsWith(threatName)
        ).length;

        const cloneName =
          existingCount === 0 ? `${threatName} #1` : `${threatName} #${existingCount + 1}`;

        const newParticipant: CombatParticipant = {
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: cloneName,
          type: "THREAT",
          characterId: threatId,
          initiative: 0,
          initiativeBonus: charData.initiative || 0,
          maxHp: charData.hp?.max || 20,
          currentHp: charData.hp?.max || 20,
          maxEnergy: charData.energy?.max,
          currentEnergy: charData.energy?.max,
          defense: charData.defense?.total ?? 10,
          conditions: [],
          isVisible: true,
        };

        const updated: CombatState = {
          ...prev,
          participants: [...prev.participants, newParticipant],
        };
        saveCombat(updated);
        return updated;
      });
    }

    window.addEventListener("clone-threat-to-combat", handleCloneEvent);
    return () => window.removeEventListener("clone-threat-to-combat", handleCloneEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const updateParticipant = (updated: CombatParticipant) => {
    const newList = combatState.participants.map((p) =>
      p.id === updated.id ? updated : p
    );
    saveCombat({ ...combatState, participants: newList });
  };

  const removeParticipant = (id: string) => {
    const newList = combatState.participants.filter((p) => p.id !== id);
    saveCombat({ ...combatState, participants: newList });
  };

  return (
    <section className="mb-8 p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">Tracker de Combate & Iniciativa</h2>
          {combatState.isActive ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60">
              <Swords className="w-3 h-3 text-purple-400 animate-pulse" />
              Rodada {combatState.round}
            </span>
          ) : (
            <span className="text-xs text-[var(--text-muted)]">(Inativo)</span>
          )}
        </div>

        <InitiativeControls
          campaignId={campaignId}
          combatState={combatState}
          setCombatState={saveCombat}
          characters={characters}
        />
      </div>

      {combatState.participants.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[var(--border-default)] rounded-lg">
          <p className="text-xs text-[var(--text-muted)]">
            Nenhum combatente ativo. Clique em <strong>&quot;+ Combatente&quot;</strong> ou clone do <strong>Bestiário</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {combatState.participants.map((p, idx) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              isCurrentTurn={
                combatState.isActive &&
                idx === combatState.currentTurnIndex
              }
              onUpdate={updateParticipant}
              onRemove={removeParticipant}
            />
          ))}
        </div>
      )}
    </section>
  );
}
