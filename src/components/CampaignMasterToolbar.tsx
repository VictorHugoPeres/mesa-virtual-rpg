"use client";

import { useState } from "react";
import { useDice } from "@/core/dice/DiceContext";
import { useCompendium } from "@/core/compendium/CompendiumContext";
import { ProjectionToolbar } from "@/core/projection/ProjectionToolbar";
import { LanQrCodeModal } from "@/core/player/LanQrCodeModal";
import { SessionJournalDrawer } from "@/core/sessions/SessionJournalDrawer";
import {
  Dices,
  History,
  BookOpen,
  Skull,
  Music,
  Map as MapIcon,
  Smartphone,
  BookMarked,
} from "lucide-react";

interface CampaignMasterToolbarProps {
  campaignId: string;
}

export function CampaignMasterToolbar({ campaignId }: CampaignMasterToolbarProps) {
  const { openRoller, openHistory } = useDice();
  const { openCompendium } = useCompendium();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  // Estilo padronizado e coeso para botões da toolbar
  const btnStyle =
    "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white transition-all shadow-xs cursor-pointer select-none";

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-white/10 shadow-xs">
        {/* Grupo 1: Ferramentas da Mesa (Mapa, Áudio, Ameaças) */}
        <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-tactical-map"))}
          className={btnStyle}
          title="Abrir Tabuleiro Tático (Grid & Tokens)"
        >
          <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mapa</span>
        </button>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-audio-desk"))}
          className={btnStyle}
          title="Abrir Mesa de Som (Música Ambiente & Efeitos Sonoros)"
        >
          <Music className="w-3.5 h-3.5 text-pink-400" />
          <span>Som</span>
        </button>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-bestiary"))}
          className={btnStyle}
          title="Abrir Bestiário de Ameaças"
        >
          <Skull className="w-3.5 h-3.5 text-rose-400" />
          <span>Bestiário</span>
        </button>
      </div>

      <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

      {/* Grupo 2: Projeção no Telão */}
      <div className="flex items-center">
        <ProjectionToolbar campaignId={campaignId} />
      </div>

      <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

      {/* Grupo 3: Dados & Regras */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() =>
            openRoller({
              label: "Rolagem do Mestre",
              modifier: 0,
              defaultDice: "1d20",
              roller: "Mestre",
              campaignId,
            })
          }
          className={btnStyle}
          title="Abrir Rolador Livre de Dados"
        >
          <Dices className="w-3.5 h-3.5 text-blue-400" />
          <span>Rolar</span>
        </button>

        <button
          type="button"
          onClick={openHistory}
          className={btnStyle}
          title="Abrir Histórico de Rolagens"
        >
          <History className="w-3.5 h-3.5 text-purple-400" />
          <span>Histórico</span>
        </button>

        <button
          type="button"
          onClick={openCompendium}
          className={btnStyle}
          title="Abrir Compêndio de Regras"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Compêndio</span>
        </button>
      </div>

      <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

      {/* Grupo 4: Gestão da Sessão & Jogadores */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsJournalOpen(true)}
          className={`${btnStyle} border-amber-500/20 text-amber-200/90 hover:border-amber-500/40`}
          title="Abrir Diário de Sessões e Histórico de Mesas"
        >
          <BookMarked className="w-3.5 h-3.5 text-amber-400" />
          <span>Diário</span>
        </button>

        <button
          type="button"
          onClick={() => setIsQrModalOpen(true)}
          className={`${btnStyle} border-indigo-500/20 text-indigo-200/90 hover:border-indigo-500/40`}
          title="Abrir QR Code e Link de Acesso Mobile (Wi-Fi)"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Celulares</span>
        </button>
      </div>
    </div>

    <LanQrCodeModal
      isOpen={isQrModalOpen}
      onClose={() => setIsQrModalOpen(false)}
      campaignId={campaignId}
    />

    <SessionJournalDrawer
      isOpen={isJournalOpen}
      onClose={() => setIsJournalOpen(false)}
      campaignId={campaignId}
    />
  </>
  );
}
