"use client";

import { useEffect, useState, useCallback } from "react";
import { useCampaignSync } from "../sync/useCampaignSync";
import { SyncEvent, ProjectionData, DiceRollEventData } from "../sync/syncTypes";
import { TelaoStandby } from "./TelaoStandby";
import { TelaoProjection } from "./TelaoProjection";
import { TelaoDiceBanner } from "./TelaoDiceBanner";
import { Maximize2, Minimize2 } from "lucide-react";

interface TelaoViewProps {
  campaignId: string;
  campaignName: string;
  initialProjection: ProjectionData | null;
}

export function TelaoView({
  campaignId,
  campaignName,
  initialProjection,
}: TelaoViewProps) {
  const [projection, setProjection] = useState<ProjectionData | null>(initialProjection);
  const [currentDiceRoll, setCurrentDiceRoll] = useState<DiceRollEventData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Escuta os eventos em tempo real (BroadcastChannel + SSE)
  const handleSyncEvent = useCallback((event: SyncEvent) => {
    if (event.type === "PROJECTION_UPDATE") {
      setProjection(event.payload as ProjectionData | null);
    } else if (event.type === "DICE_ROLL") {
      setCurrentDiceRoll(event.payload as DiceRollEventData);
    }
  }, []);

  useCampaignSync({ campaignId, onEvent: handleSyncEvent });

  // Busca a projeção ativa inicial caso a página tenha sido aberta após o mestre projetar
  useEffect(() => {
    async function fetchInitial() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/projection`);
        if (res.ok) {
          const data = await res.json();
          if (data.activeProjection) {
            setProjection(data.activeProjection);
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar projeção inicial:", err);
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
      {/* Botão de Tela Cheia flutuante (some após inatividade) */}
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
      {projection && projection.mediaUrl ? (
        <TelaoProjection projection={projection} />
      ) : (
        <TelaoStandby campaignName={campaignName} />
      )}
    </div>
  );
}
