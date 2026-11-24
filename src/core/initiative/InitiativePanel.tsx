"use client";

import { useEffect, useState, useCallback } from "react";
import { Shield, Swords } from "lucide-react";
import { useCampaignSync } from "@/core/sync/useCampaignSync";
import { CombatState, CombatParticipant, EMPTY_COMBAT, combatToTvData } from "./initiativeTypes";
import { generateId } from "@/lib/id";
import { ParticipantRow } from "./ParticipantRow";
import { InitiativeControls } from "./InitiativeControls";
import { ThreatCombatDrawer } from "./ThreatCombatDrawer";
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
  const [selectedThreat, setSelectedThreat] = useState<CombatParticipant | null>(null);

  const handleSyncEvent = useCallback((event: any) => {
    if (event.type === "INITIATIVE_UPDATE" && event.payload) {
      loadCombat();
    }
  }, [campaignId]);

  const { emit } = useCampaignSync({ campaignId, onEvent: handleSyncEvent });

  async function loadCombat(signal?: AbortSignal) {
    if (!campaignId) return;
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/combat`, { signal });
      if (res.ok) {
        const data = await res.json();
        setCombatState(data.combatState ?? EMPTY_COMBAT);
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      // Aviso leve para falhas transitórias, sem disparar overlay de erro do Next.js
      console.warn("Falha transitória ao carregar combate:", e?.message || e);
    }
  }

  async function saveCombat(updated: CombatState) {
    if (!campaignId) return;
    setCombatState(updated);
    try {
      await fetch(`/api/campaigns/${campaignId}/combat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ combatState: updated }),
      });
      // Notifica abas locais (BroadcastChannel)
      emit("INITIATIVE_UPDATE", combatToTvData(updated));
    } catch (e: any) {
      console.warn("Falha ao salvar combate:", e?.message || e);
    }
  }

  useEffect(() => {
    if (!campaignId) return;
    const controller = new AbortController();
    loadCombat(controller.signal);
    return () => {
      controller.abort();
    };
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
          id: generateId(threatId),
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
    <section className="mb-8 p-4 rounded-xl border border-[#23272F] bg-[#14161A] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-100">Tracker de Combate & Iniciativa</h2>
          {combatState.isActive ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-950/30 text-rose-300 border border-rose-500/30">
              <Swords className="w-3 h-3 text-rose-400 animate-pulse" />
              Rodada {combatState.round}
            </span>
          ) : (
            <span className="text-xs text-zinc-500 font-normal">(Inativo)</span>
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
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-500">
            Nenhum combatente ativo. Clique em <strong className="text-zinc-300">&quot;Combatente&quot;</strong> ou clone do <strong className="text-zinc-300">Bestiário</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {combatState.participants.map((p, idx) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              isCurrentTurn={combatState.isActive && idx === combatState.currentTurnIndex}
              onUpdate={updateParticipant}
              onRemove={removeParticipant}
              campaignId={campaignId}
              onOpenThreatSheet={setSelectedThreat}
            />
          ))}
        </div>
      )}

      {/* Drawer de Detalhes da Ameaça com Ataques e Ficha */}
      {selectedThreat && (
        <ThreatCombatDrawer
          campaignId={campaignId}
          isOpen={Boolean(selectedThreat)}
          onClose={() => setSelectedThreat(null)}
          participantName={selectedThreat.name}
          characterId={selectedThreat.characterId}
          character={characters.find((c) => c.id === selectedThreat.characterId)}
        />
      )}
    </section>
  );
}
