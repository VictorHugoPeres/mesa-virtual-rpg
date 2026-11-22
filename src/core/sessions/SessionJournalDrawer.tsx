"use client";

import { useEffect, useState, useCallback } from "react";
import { BookMarked, X, RefreshCw, Calendar, Clock, Dices, ChevronDown, ChevronUp, CheckCircle2, Play } from "lucide-react";
import { useDice } from "@/core/dice/DiceContext";
import { Portal } from "@/core/ui";

interface SessionItem {
  id: string;
  sessionNumber: number;
  number?: number;
  title: string;
  status: string;
  startedAt: string;
  endedAt?: string | null;
  notes: string;
  _count?: { diceLogs: number };
}

interface SessionJournalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

export function SessionJournalDrawer({
  isOpen,
  onClose,
  campaignId,
}: SessionJournalDrawerProps) {
  const { openHistory } = useDice();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/sessions`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Erro ao carregar diário de sessões:", err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen, fetchSessions]);

  if (!isOpen) return null;

  function formatDate(d?: string | null) {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg h-full bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col text-white animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-zinc-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Diário de Sessões</h3>
              <p className="text-[11px] text-zinc-400">Histórico de mesas, datas e resumos</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={fetchSessions}
              disabled={loading}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Atualizar diário"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Sessões */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {sessions.length === 0 ? (
            <div className="py-20 text-center text-zinc-500">
              <BookMarked className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-400" />
              <p>Nenhuma sessão registrada nesta campanha.</p>
            </div>
          ) : (
            sessions.map((s) => {
              const num = s.sessionNumber || s.number || 1;
              const isActive = s.status === "ACTIVE";
              const isExpanded = expandedId === s.id;

              return (
                <div
                  key={s.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isActive
                      ? "bg-zinc-900/90 border-emerald-500/40 shadow-sm shadow-emerald-950/30"
                      : "bg-zinc-900/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              isActive
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-700/60"
                                : "bg-zinc-800 text-zinc-400 border border-white/10"
                            }`}
                          >
                            {isActive ? <Play className="w-2.5 h-2.5 fill-current" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                            {isActive ? "Em Andamento" : "Concluída"}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {s._count?.diceLogs ?? 0} rolagens
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white">
                          Sessão #{num} — {s.title || `Sessão ${num}`}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : s.id)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title={isExpanded ? "Recolher anotações" : "Expandir anotações"}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>Início: {formatDate(s.startedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>Fim: {formatDate(s.endedAt)}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-white/10 space-y-2 animate-in fade-in duration-150">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Anotações da Sessão
                        </span>
                        <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-zinc-300 font-sans leading-relaxed whitespace-pre-line text-xs max-h-48 overflow-y-auto">
                          {s.notes?.trim() ? s.notes : <span className="text-zinc-600 italic">Nenhuma anotação nesta sessão.</span>}
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              openHistory();
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 border border-purple-700/50 text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            <Dices className="w-3 h-3" /> Ver Rolagens no Histórico
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}
