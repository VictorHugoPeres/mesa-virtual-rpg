"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "./MediaCard";
import { MediaUploadTab } from "./MediaUploadTab";
import { MediaUrlTab } from "./MediaUrlTab";
import { MediaGalleryTab } from "./MediaGalleryTab";
import { ProjectionData } from "../sync/syncTypes";
import { postBroadcastEvent } from "../sync/broadcast";
import { useDialog, Portal } from "@/core/ui";
import {
  Tv,
  EyeOff,
  X,
  Upload,
  Link2,
  FolderOpen,
  ExternalLink,
} from "lucide-react";

interface ProjectionManagerModalProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  activeProjection: ProjectionData | null;
  onProjectionChange: (p: ProjectionData | null) => void;
}

export function ProjectionManagerModal({
  campaignId,
  isOpen,
  onClose,
  activeProjection,
  onProjectionChange,
}: ProjectionManagerModalProps) {
  const { confirm, toast } = useDialog();
  const [activeTab, setActiveTab] = useState<"gallery" | "upload" | "url">("gallery");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?campaignId=${campaignId}&type=image`);
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error("Erro ao carregar mídias:", err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, fetchMedia]);

  if (!isOpen) return null;

  async function handleProject(item: MediaItem) {
    const projection: ProjectionData = {
      mediaUrl: item.url,
      title: item.title,
      category: item.category,
    };
    onProjectionChange(projection);
    postBroadcastEvent(campaignId, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "PROJECTION_UPDATE",
      campaignId,
      payload: projection,
      timestamp: Date.now(),
    });
    try {
      await fetch(`/api/campaigns/${campaignId}/projection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projection }),
      });
    } catch (err) {
      console.error("Erro ao salvar projeção:", err);
    }
  }

  async function handleClear() {
    onProjectionChange(null);
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

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: "Excluir Mídia",
      message: "Deseja realmente remover esta mídia da campanha?",
      variant: "danger",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        toast.success("Mídia excluída com sucesso.");
      }
    } catch (err) {
      console.error("Erro ao deletar mídia:", err);
      toast.error("Erro ao deletar mídia.");
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-[#14161A] border border-[#23272F] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23272F] bg-[#0B0C0E]">
          <div className="flex items-center gap-2.5">
            <Tv className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Projeção no Telão & Cenas
              </h3>
              <p className="text-xs text-zinc-400">
                {activeProjection?.title ? (
                  <span className="text-emerald-400 font-medium">
                    Projetando no momento: {activeProjection.title}
                  </span>
                ) : (
                  "Nenhuma imagem projetada no momento (Standby)"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.open(`/telao/${campaignId}`, "_blank")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Abrir a tela da TV em nova janela (F11 para tela cheia)"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir Telão TV
            </button>

            {activeProjection && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 text-red-300 hover:bg-red-900/60 border border-red-700/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Ocultar imagem e voltar ao modo de espera na TV"
              >
                <EyeOff className="w-3.5 h-3.5" /> Limpar Telão
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-secondary)] px-6">
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`py-2.5 px-4 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === "gallery"
                ? "border-emerald-500 text-emerald-400 bg-[var(--bg-card)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <FolderOpen className="w-4 h-4" /> Galeria ({mediaList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`py-2.5 px-4 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === "upload"
                ? "border-blue-500 text-blue-400 bg-[var(--bg-card)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Upload className="w-4 h-4" /> Upload de Imagem
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`py-2.5 px-4 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === "url"
                ? "border-purple-500 text-purple-400 bg-[var(--bg-card)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Link2 className="w-4 h-4" /> Adicionar por Link
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "upload" && (
            <MediaUploadTab
              campaignId={campaignId}
              onSuccess={() => {
                fetchMedia();
                setActiveTab("gallery");
              }}
            />
          )}

          {activeTab === "url" && (
            <MediaUrlTab
              campaignId={campaignId}
              onSuccess={() => {
                fetchMedia();
                setActiveTab("gallery");
              }}
            />
          )}

          {activeTab === "gallery" && (
            <MediaGalleryTab
              mediaList={mediaList}
              loading={loading}
              activeProjection={activeProjection}
              onProject={handleProject}
              onClear={handleClear}
              onDelete={handleDelete}
              onRefresh={fetchMedia}
            />
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}
