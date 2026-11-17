"use client";

import { useEffect, useState, useCallback } from "react";
import { useCampaignSync } from "../sync/useCampaignSync";
import {
  SyncEvent,
  ProjectionData,
  DiceRollEventData,
  InitiativeDisplayData,
  AudioBGMEventData,
} from "../sync/syncTypes";
import { TelaoStandby } from "./TelaoStandby";
import { TelaoProjection } from "./TelaoProjection";
import { TelaoDiceBanner } from "./TelaoDiceBanner";
import { TelaoInitiativePanel } from "./TelaoInitiativePanel";
import { TelaoAudioReceiver } from "./TelaoAudioReceiver";
import { Maximize2, Minimize2 } from "lucide-react";
import { combatToTvData } from "../initiative/initiativeTypes";

interface TelaoViewProps {
  campaignId: string;
  campaignName: string;
  initialProjection: ProjectionData | null;
  initialCombat?: InitiativeDisplayData | null;
  initialAudio?: AudioBGMEventData | null;
}

export function TelaoView({
  campaignId,
  campaignName,
  initialProjection,
  initialCombat = null,
  initialAudio = null,
}: TelaoViewProps) {
  const [projection, setProjection] = useState<ProjectionData | null>(initialProjection);
  const [currentDiceRoll, setCurrentDiceRoll] = useState<DiceRollEventData | null>(null);
  const [initiativeData, setInitiativeData] = useState<InitiativeDisplayData | null>(
    initialCombat
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Escuta os eventos em tempo real (BroadcastChannel + SSE)
  const handleSyncEvent = useCallback((event: SyncEvent) => {
    if (event.type === "PROJECTION_UPDATE") {
      setProjection(event.payload as ProjectionData | null);
    } else if (event.type === "DICE_ROLL") {
      setCurrentDiceRoll(event.payload as DiceRollEventData);
    } else if (event.type === "INITIATIVE_UPDATE") {
      setInitiativeData(event.payload as InitiativeDisplayData | null);
    }
  }, []);

  useCampaignSync({ campaignId, onEvent: handleSyncEvent });

  // Busca dados iniciais de projeção e combate caso a janela abra depois
  useEffect(() => {
    async function fetchInitial() {
      try {
        const [projRes, combatRes] = await Promise.all([
          fetch(`/api/campaigns/${campaignId}/projection`),
          fetch(`/api/campaigns/${campaignId}/combat`),
        ]);

        if (projRes.ok) {
          const data = await projRes.json();
          if (data.activeProjection) {
            setProjection(data.activeProjection);
          }
        }

        if (combatRes.ok) {
          const data = await combatRes.json();
          if (data.combatState) {
            setInitiativeData(combatToTvData(data.combatState));
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar dados iniciais do Telão:", err);
      }
    }
    fetchInitial();
  }, [campaignId]);

  // Controle de Tela Cheia
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }

  return (
    <div
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="relative w-screen h-screen bg-[#050508] text-white flex flex-col overflow-hidden select-none"
    >
      {/* Botão de Tela Cheia flutuante */}
      <div
        className={`fixed top-4 right-4 z-40 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white/80 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
          title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia (TV / F11)"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Banner de Rolagem de Dados (Overlay) */}
      <TelaoDiceBanner
        roll={currentDiceRoll}
        onDismiss={() => setCurrentDiceRoll(null)}
      />

      {/* Conteúdo Central: Mídia Projetada OU Standby Elegante */}
      <div className={`relative flex-1 ${initiativeData?.showOnTv ? "pb-36" : ""}`}>
        {projection && projection.mediaUrl ? (
          <TelaoProjection projection={projection} />
        ) : (
          <TelaoStandby campaignName={campaignName} />
        )}
      </div>

      {/* Painel de Ordem de Iniciativa na TV */}
      <TelaoInitiativePanel initiative={initiativeData} />

      {/* Receptor de Áudio da TV (BGM & SFX) */}
      <TelaoAudioReceiver
        campaignId={campaignId}
        initialAudio={initialAudio}
      />
    </div>
  );
}
