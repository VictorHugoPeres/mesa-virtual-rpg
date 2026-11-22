"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDice } from "./DiceContext";
import { History, X, RefreshCw, Dices, Dice5, Sparkles, AlertTriangle, Filter } from "lucide-react";

interface RollLogItem {
  id: string;
  mode: string;
  campaignId: string | null;
  characterId: string | null;
  roller: string;
  formula: string;
  rawRoll: string;
  modifier: number;
  total: number;
  label: string | null;
  isCritical: boolean;
  isFumble: boolean;
  createdAt: string;
}

export function RollHistoryDrawer({ campaignId: propCampaignId }: { campaignId?: string }) {
  const routeParams = useParams();
  const routeCampaignId = typeof routeParams?.campaignId === "string" ? routeParams.campaignId : undefined;
  const campaignId = propCampaignId || routeCampaignId;

  const { isHistoryOpen, closeHistory, historyVersion } = useDice();
  const [logs, setLogs] = useState<RollLogItem[]>([]);
  const [sessions, setSessions] = useState<{ id: string; sessionNumber: number; title: string; status: string }[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!campaignId) return;
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/sessions`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.warn("Erro ao buscar sessões para filtro:", err);
    }
  }, [campaignId]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (campaignId) params.append("campaignId", campaignId);
      if (selectedSessionId) params.append("sessionId", selectedSessionId);

      const res = await fetch(`/api/rolls?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.rolls || []);
      }
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setLoading(false);
    }
  }, [campaignId, selectedSessionId]);

  useEffect(() => {
    if (isHistoryOpen) {
      fetchSessions();
      fetchLogs();
    }
  }, [isHistoryOpen, historyVersion, fetchSessions, fetchLogs]);

  if (!isHistoryOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md h-full bg-[var(--bg-card)] border-l border-[var(--border-default)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header da gaveta */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base">Histórico de Rolagens</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLogs}
              disabled={loading}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
              title="Atualizar histórico"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
            </button>
            <button
              type="button"
              onClick={closeHistory}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filtro por Sessão */}
        {campaignId && sessions.length > 0 && (
          <div className="px-5 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-default)] flex items-center justify-between gap-2">
            <span className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-purple-400" /> Sessão:
            </span>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="text-xs bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg px-2.5 py-1 text-[var(--text-primary)] font-medium cursor-pointer max-w-[240px] truncate focus:outline-none focus:border-purple-500"
            >
              <option value="">Sessão Ativa (Padrão)</option>
              <option value="all">Todas as Sessões</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  Sessão #{s.sessionNumber || 1} {s.title ? `— ${s.title}` : ""} {s.status === "ACTIVE" ? "(Ativa)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lista de rolagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.length === 0 ? (
            <div className="py-16 text-center text-xs text-[var(--text-muted)]">
              <Dices className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Nenhuma rolagem registrada ainda.</p>
              <p className="mt-1">Role dados na ficha ou pelo painel do mestre.</p>
            </div>
          ) : (
            logs.map((log) => {
              const date = new Date(log.createdAt);
              const timeStr = date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              return (
                <div
                  key={log.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    log.isCritical
                      ? "bg-amber-950/20 border-amber-600/60 shadow-xs"
                      : log.isFumble
                      ? "bg-red-950/20 border-red-600/60 shadow-xs"
                      : "bg-[var(--bg-secondary)] border-[var(--border-default)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="font-bold text-sm text-[var(--text-primary)]">
                        {log.roller}
                      </span>
                      {log.label && (
                        <p className="text-xs text-[var(--text-secondary)] font-medium">
                          {log.label}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${
                          log.mode === "DIGITAL"
                            ? "bg-blue-900/50 text-blue-300 border border-blue-800"
                            : "bg-emerald-900/50 text-emerald-300 border border-emerald-800"
                        }`}
                      >
                        {log.mode === "DIGITAL" ? (
                          <>
                            <Dices className="w-3 h-3" /> Digital
                          </>
                        ) : (
                          <>
                            <Dice5 className="w-3 h-3" /> Físico
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border-default)]/60 text-xs">
                    <span className="text-[var(--text-muted)] font-mono">
                      {log.formula} &rarr; {log.rawRoll}
                    </span>

                    <div className="flex items-center gap-2">
                      {log.isCritical && (
                        <span className="text-amber-400 font-bold flex items-center gap-0.5 text-[11px]">
                          <Sparkles className="w-3 h-3" /> Crítico!
                        </span>
                      )}
                      {log.isFumble && (
                        <span className="text-red-400 font-bold flex items-center gap-0.5 text-[11px]">
                          <AlertTriangle className="w-3 h-3" /> Falha!
                        </span>
                      )}
                      <span className="text-lg font-black text-white">
                        {log.total}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-[var(--text-muted)] text-right mt-1">
                    {timeStr}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
