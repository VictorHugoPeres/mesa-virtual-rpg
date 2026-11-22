"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollText, Globe, Check, Loader2, AlertCircle } from "lucide-react";
import { FinishSessionModal } from "../sessions/FinishSessionModal";
import { SessionTabContent } from "./SessionTabContent";
import { GeneralTabContent } from "./GeneralTabContent";

interface CampaignNotesPanelProps {
  campaignId: string;
  initialGeneralNotes: string;
  activeSession: {
    id: string;
    sessionNumber: number;
    title: string;
    notes: string;
    startedAt?: string | Date;
  };
}

export function CampaignNotesPanel({
  campaignId,
  initialGeneralNotes,
  activeSession: initialActiveSession,
}: CampaignNotesPanelProps) {
  const [activeTab, setActiveTab] = useState<"session" | "general">("session");

  // Estado da Sessão Ativa
  const [session, setSession] = useState(initialActiveSession);
  const [sessionNotes, setSessionNotes] = useState(initialActiveSession.notes || "");
  const [sessionTitle, setSessionTitle] = useState(initialActiveSession.title || `Sessão ${initialActiveSession.sessionNumber}`);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sessionSaveStatus, setSessionSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Estado das Notas Gerais
  const [generalNotes, setGeneralNotes] = useState(initialGeneralNotes || "");
  const [generalSaveStatus, setGeneralSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Modal de Finalizar Sessão
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const sessionDebounce = useRef<NodeJS.Timeout | null>(null);
  const sessionMounted = useRef(false);

  const generalDebounce = useRef<NodeJS.Timeout | null>(null);
  const generalMounted = useRef(false);

  // Autosave da Sessão Ativa (Notas e Título)
  useEffect(() => {
    if (!sessionMounted.current) {
      sessionMounted.current = true;
      return;
    }

    setSessionSaveStatus("saving");
    if (sessionDebounce.current) clearTimeout(sessionDebounce.current);

    sessionDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sessions/${session.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: sessionNotes, title: sessionTitle }),
        });

        if (res.ok) {
          setSessionSaveStatus("saved");
          setTimeout(() => setSessionSaveStatus("idle"), 2500);
        } else {
          setSessionSaveStatus("error");
        }
      } catch (err) {
        console.error("Erro ao salvar notas da sessão:", err);
        setSessionSaveStatus("error");
      }
    }, 700);

    return () => {
      if (sessionDebounce.current) clearTimeout(sessionDebounce.current);
    };
  }, [sessionNotes, sessionTitle, session.id]);

  // Autosave das Notas Gerais da Campanha
  useEffect(() => {
    if (!generalMounted.current) {
      generalMounted.current = true;
      return;
    }

    setGeneralSaveStatus("saving");
    if (generalDebounce.current) clearTimeout(generalDebounce.current);

    generalDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ generalNotes }),
        });

        if (res.ok) {
          setGeneralSaveStatus("saved");
          setTimeout(() => setGeneralSaveStatus("idle"), 2500);
        } else {
          setGeneralSaveStatus("error");
        }
      } catch (err) {
        console.error("Erro ao salvar notas gerais:", err);
        setGeneralSaveStatus("error");
      }
    }, 700);

    return () => {
      if (generalDebounce.current) clearTimeout(generalDebounce.current);
    };
  }, [generalNotes, campaignId]);

  function handleSessionFinished(newSession: any) {
    if (!newSession) return;
    setSession({
      id: newSession.id,
      sessionNumber: newSession.sessionNumber ?? (session.sessionNumber + 1),
      title: newSession.title || `Sessão ${newSession.sessionNumber ?? (session.sessionNumber + 1)}`,
      notes: newSession.notes || "",
      startedAt: newSession.startedAt || new Date(),
    });
    setSessionNotes(newSession.notes || "");
    setSessionTitle(newSession.title || `Sessão ${newSession.sessionNumber ?? (session.sessionNumber + 1)}`);
  }

  const startDateStr = session.startedAt
    ? new Date(session.startedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const currentStatus = activeTab === "session" ? sessionSaveStatus : generalSaveStatus;

  return (
    <section className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-xs overflow-hidden flex flex-col">
      {/* Abas e Status */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 pt-3 pb-2 bg-[var(--bg-secondary)]/40">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("session")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "session"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Sessão #{session.sessionNumber}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "general"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Notas Gerais</span>
          </button>
        </div>

        {/* Indicador de Salvamento */}
        <div className="text-[11px] font-medium">
          {currentStatus === "saving" && (
            <span className="text-amber-400 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Salvando...
            </span>
          )}
          {currentStatus === "saved" && (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Salvo
            </span>
          )}
          {currentStatus === "error" && (
            <span className="text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Erro ao salvar
            </span>
          )}
          {currentStatus === "idle" && (
            <span className="text-[var(--text-muted)] hidden sm:inline">Auto-save</span>
          )}
        </div>
      </div>

      {/* Conteúdo da Aba */}
      <div className="p-4 flex-1 space-y-3">
        {activeTab === "session" ? (
          <SessionTabContent
            sessionTitle={sessionTitle}
            setSessionTitle={setSessionTitle}
            isEditingTitle={isEditingTitle}
            setIsEditingTitle={setIsEditingTitle}
            startDateStr={startDateStr}
            sessionNumber={session.sessionNumber}
            sessionNotes={sessionNotes}
            setSessionNotes={setSessionNotes}
            onOpenFinishModal={() => setIsFinishModalOpen(true)}
          />
        ) : (
          <GeneralTabContent
            generalNotes={generalNotes}
            setGeneralNotes={setGeneralNotes}
          />
        )}
      </div>

      <FinishSessionModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        campaignId={campaignId}
        sessionNumber={session.sessionNumber}
        initialTitle={sessionTitle}
        initialNotes={sessionNotes}
        startedAt={session.startedAt}
        onSuccess={handleSessionFinished}
      />
    </section>
  );
}
