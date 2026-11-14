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

  return (
    <>
      <div className="flex items-center gap-1.5">
        {/* Botão de abrir o Telão em nova janela */}
        <button
          type="button"
          onClick={() => window.open(`/telao/${campaignId}`, "_blank")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                     bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30
                     transition-all cursor-pointer shadow-xs"
          title="Abrir a tela da TV em nova janela separada (ideal para colocar na segunda tela)"
        >
          <Tv className="w-3.5 h-3.5 text-emerald-400" />
          <span>Telão (TV)</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </button>

        {/* Botão de Gerenciador de Cenas */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
            activeProjection
              ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-300"
              : "bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-white"
          }`}
          title="Abrir biblioteca de cenas e imagens para projetar na TV"
        >
          <Film className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cenas</span>
          {activeProjection && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>

        {/* Botão rápido para ocultar caso esteja projetando */}
        {activeProjection && (
          <button
            type="button"
            onClick={handleClearQuick}
            className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-700/60 text-red-300 transition-colors cursor-pointer"
            title={`Ocultar "${activeProjection.title || "imagem"}" da TV`}
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <ProjectionManagerModal
        campaignId={campaignId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeProjection={activeProjection}
        onProjectionChange={setActiveProjection}
      />
    </>
  );
}
