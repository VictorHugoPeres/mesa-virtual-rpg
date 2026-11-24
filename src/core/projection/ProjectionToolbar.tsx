"use client";

import { useState, useEffect } from "react";
import { Tv, EyeOff, Film, ExternalLink } from "lucide-react";
import { ProjectionData } from "../sync/syncTypes";
import { postBroadcastEvent } from "../sync/broadcast";
import { ProjectionManagerModal } from "./ProjectionManagerModal";

interface ProjectionToolbarProps {
  campaignId: string;
}

export function ProjectionToolbar({ campaignId }: ProjectionToolbarProps) {
  const [activeProjection, setActiveProjection] = useState<ProjectionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadCurrent() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/projection`);
        if (res.ok) {
          const data = await res.json();
          if (data.activeProjection) {
            setActiveProjection(data.activeProjection);
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar projeção:", err);
      }
    }
    loadCurrent();
  }, [campaignId]);

  async function handleClearQuick() {
    setActiveProjection(null);

    postBroadcastEvent(campaignId, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "PROJECTION_UPDATE",
      campaignId,
      payload: null,
      timestamp: Date.now(),
    });

    try {
      await fetch(`/api/campaigns/${campaignId}/projection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projection: null }),
      });
    } catch (err) {
      console.error("Erro ao limpar projeção:", err);
    }
  }

  const btnStyle =
    "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all shadow-xs cursor-pointer select-none active:scale-95 group";

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Botão de abrir o Telão em nova janela */}
        <button
          type="button"
          onClick={() => window.open(`/telao/${campaignId}`, "_blank")}
          className={`${btnStyle} ${
            activeProjection ? "border-emerald-500/50 bg-[#14161A] text-emerald-300 shadow-sm" : ""
          }`}
          title="Abrir a tela da TV em nova janela separada (ideal para colocar na segunda tela)"
        >
          <Tv
            className={`w-3.5 h-3.5 transition-colors ${
              activeProjection ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-200"
            }`}
          />
          <span>Telão (TV)</span>
          {activeProjection && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          )}
          <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
        </button>

        {/* Botão de Gerenciador de Cenas */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={btnStyle}
          title="Abrir biblioteca de cenas e imagens para projetar na TV"
        >
          <Film className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-300 transition-colors" />
          <span>Cenas</span>
          {activeProjection && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          )}
        </button>

        {/* Botão rápido para ocultar caso esteja projetando */}
        {activeProjection && (
          <button
            type="button"
            onClick={handleClearQuick}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer active:scale-95"
            title={`Ocultar "${activeProjection.title || "imagem"}" da TV`}
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <ProjectionManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaignId={campaignId}
        activeProjection={activeProjection}
        onProjectionChange={setActiveProjection}
      />
    </>
  );
}
