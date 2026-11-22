"use client";

import { useState } from "react";
import { useDice } from "@/core/dice/DiceContext";
import { useCompendium } from "@/core/compendium/CompendiumContext";
import { ProjectionToolbar } from "@/core/projection/ProjectionToolbar";
import { LanQrCodeModal } from "@/core/player/LanQrCodeModal";
import { SessionJournalDrawer } from "@/core/sessions/SessionJournalDrawer";
import { Dices, History, BookOpen, Skull, Music, Map as MapIcon, Smartphone, BookMarked } from "lucide-react";

interface CampaignMasterToolbarProps {
  campaignId: string;
}

export function CampaignMasterToolbar({ campaignId }: CampaignMasterToolbarProps) {
  const { openRoller, openHistory } = useDice();
  const { openCompendium } = useCompendium();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
        {/* Botão Bestiário */}
        <button
          type="button"
          onClick={() => {
            const ev = new CustomEvent('open-bestiary');
            window.dispatchEvent(ev);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                     bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30
                     transition-all cursor-pointer shadow-xs"
          title="Abrir Bestiário de Ameaças"
        >
          <Skull className="w-3.5 h-3.5 text-red-400" />
          Bestiário
        </button>

        {/* Botão Mesa de Som */}
        <button
          type="button"
          onClick={() => {
            const ev = new CustomEvent('open-audio-desk');
            window.dispatchEvent(ev);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                     bg-pink-600/20 text-pink-300 border border-pink-500/30 hover:bg-pink-600/30
                     transition-all cursor-pointer shadow-xs"
          title="Abrir Mesa de Som (BGM & Soundboard SFX)"
        >
          <Music className="w-3.5 h-3.5 text-pink-400" />
          Mesa de Som
        </button>

        {/* Botão Tabuleiro Tático */}
        <button
          type="button"
          onClick={() => {
            const ev = new CustomEvent('open-tactical-map');
            window.dispatchEvent(ev);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                     bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30
                     transition-all cursor-pointer shadow-xs"
          title="Abrir Tabuleiro Tático (Grid & Mapas)"
        >
          <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
          Mapa Tático
        </button>

      <ProjectionToolbar campaignId={campaignId} />

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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30
                   transition-all cursor-pointer shadow-xs"
        title="Abrir rolador livre de dados (Digital / Físico)"
      >
        <Dices className="w-3.5 h-3.5 text-blue-400" />
        Rolar Dado
      </button>

      <button
        type="button"
        onClick={openHistory}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30
                   transition-all cursor-pointer shadow-xs"
        title="Abrir histórico de rolagens"
      >
        <History className="w-3.5 h-3.5 text-purple-400" />
        Histórico
      </button>

      <button
        type="button"
        onClick={openCompendium}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30
                   transition-all cursor-pointer shadow-xs"
        title="Abrir compêndio de regras de Feiticeiros e Maldições"
      >
        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
        Compêndio
      </button>

      {/* Botão Acesso Mobile / Celulares */}
      <button
        type="button"
        onClick={() => setIsQrModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30
                   transition-all cursor-pointer shadow-xs"
        title="Abrir QR Code e link para celulares na rede Wi-Fi"
      >
        <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
        📱 Celulares
      </button>

      {/* Botão Diário / Sessões */}
      <button
        type="button"
        onClick={() => setIsJournalOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30
                   transition-all cursor-pointer shadow-xs"
        title="Abrir Diário de Sessões e histórico de mesas"
      >
        <BookMarked className="w-3.5 h-3.5 text-amber-400" />
        📜 Diário / Sessões
      </button>

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
    </div>
  );
}
