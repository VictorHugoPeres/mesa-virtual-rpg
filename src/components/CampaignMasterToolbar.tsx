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

  // Estilo padronizado e coeso para botões da toolbar (Superfície Neutra + Ícones Sutis)
  const btnStyle =
    "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all shadow-xs cursor-pointer select-none active:scale-95";

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0B0C0E] border border-[#23272F] shadow-xs">
        {/* Grupo 1: Ferramentas da Mesa (Mapa, Áudio, Ameaças) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-tactical-map"))}
            className={`${btnStyle} group`}
            title="Abrir Tabuleiro Tático (Grid & Tokens)"
          >
            <MapIcon className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            <span>Mapa</span>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-audio-desk"))}
            className={`${btnStyle} group`}
            title="Abrir Mesa de Som (Música Ambiente & Efeitos Sonoros)"
          >
            <Music className="w-3.5 h-3.5 text-pink-400 group-hover:text-pink-300 transition-colors" />
            <span>Som</span>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-bestiary"))}
            className={`${btnStyle} group`}
            title="Abrir Bestiário de Ameaças"
          >
            <Skull className="w-3.5 h-3.5 text-rose-400 group-hover:text-rose-300 transition-colors" />
            <span>Bestiário</span>
          </button>
        </div>

        <div className="h-4 w-px bg-[#23272F] mx-0.5 hidden sm:block" />

        {/* Grupo 2: Projeção no Telão */}
        <div className="flex items-center">
          <ProjectionToolbar campaignId={campaignId} />
        </div>

        <div className="h-4 w-px bg-[#23272F] mx-0.5 hidden sm:block" />

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
            className={`${btnStyle} group`}
            title="Abrir Rolador Livre de Dados"
          >
            <Dices className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-300 transition-colors" />
            <span>Rolar</span>
          </button>

          <button
            type="button"
            onClick={openHistory}
            className={`${btnStyle} group`}
            title="Abrir Histórico de Rolagens"
          >
            <History className="w-3.5 h-3.5 text-violet-400 group-hover:text-violet-300 transition-colors" />
            <span>Histórico</span>
          </button>

          <button
            type="button"
            onClick={openCompendium}
            className={`${btnStyle} group`}
            title="Abrir Compêndio de Regras"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 transition-colors" />
            <span>Compêndio</span>
          </button>
        </div>

        <div className="h-4 w-px bg-[#23272F] mx-0.5 hidden sm:block" />

        {/* Grupo 4: Gestão da Sessão & Jogadores */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsJournalOpen(true)}
            className={`${btnStyle} group`}
            title="Abrir Diário de Sessões e Histórico de Mesas"
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 transition-colors" />
            <span>Diário</span>
          </button>

          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className={`${btnStyle} group`}
            title="Abrir QR Code e Link de Acesso Mobile (Wi-Fi)"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span>Celulares</span>
          </button>
        </div>
      </div>

      {/* Modais & Drawers */}
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
