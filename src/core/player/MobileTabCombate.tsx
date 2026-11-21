"use client";

import { useState, useEffect } from "react";
import { useCampaignSync } from "@/core/sync/useCampaignSync";
import {
  SyncEvent,
  InitiativeDisplayData,
  InitiativeDisplayParticipant,
  HealthStatus,
} from "@/core/sync/syncTypes";
import { combatToTvData, CombatState } from "@/core/initiative/initiativeTypes";
import { Swords, ShieldAlert, Award, Skull, AlertCircle } from "lucide-react";

interface MobileTabCombateProps {
  campaignId: string;
  characterId: string;
  characterName: string;
}

export function MobileTabCombate({
  campaignId,
  characterId,
  characterName,
}: MobileTabCombateProps) {
  const [combatData, setCombatData] = useState<InitiativeDisplayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/campaigns/${campaignId}/combat`)
      .then((res) => res.json())
      .then((data) => {
        if (data.combatState) {
          const tvData = combatToTvData(data.combatState as CombatState);
          setCombatData(tvData);
        }
      })
      .catch((err) => console.error("Erro ao buscar combate:", err))
      .finally(() => setLoading(false));
  }, [campaignId]);

  useCampaignSync({
    campaignId,
    onEvent: (event: SyncEvent) => {
      if (event.type === "INITIATIVE_UPDATE") {
        setCombatData(event.payload as InitiativeDisplayData);
      }
    },
  });

  const isActive = combatData?.isActive ?? false;
  const currentParticipant = combatData?.participants.find((p) => p.isCurrentTurn);
  const isMyTurn = currentParticipant?.name.toLowerCase() === characterName.toLowerCase();

  function getStatusColor(status: HealthStatus) {
    switch (status) {
      case "Saudável":
        return "text-emerald-400 bg-emerald-950/60 border-emerald-800";
      case "Ferido":
        return "text-amber-400 bg-amber-950/60 border-amber-800";
      case "Crítico":
      case "Gravemente Ferido":
        return "text-rose-400 bg-rose-950/60 border-rose-800";
      case "Derrotado":
        return "text-gray-400 bg-gray-900 border-gray-700";
      default:
        return "text-blue-400 bg-blue-950/60 border-blue-800";
    }
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Status do Combate */}
      {!isActive ? (
        <div className="p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
            <Swords className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-[var(--text-primary)]">Nenhum Combate Ativo</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
            Aguarde o Mestre iniciar a ordem de iniciativa para visualizar os turnos ao vivo.
          </p>
        </div>
      ) : (
        <>
          {/* Banner do Turno Atual */}
          <div
            className={`p-4 rounded-2xl border text-center space-y-1 shadow-md transition-all ${
              isMyTurn
                ? "bg-emerald-950/40 border-emerald-500 animate-pulse"
                : "bg-blue-950/30 border-blue-900/50"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
              Rodada {combatData?.round ?? 1}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">Turno de:</span>
              <span className="text-base font-black text-[var(--text-primary)]">
                {currentParticipant?.name || "Aguardando..."}
              </span>
            </div>
            {isMyTurn && (
              <span className="text-xs font-bold text-emerald-300 block pt-1">
                ⚔️ É O SEU TURNO! Realize suas ações.
              </span>
            )}
          </div>

          {/* Ordem de Iniciativa */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Ordem de Turnos ({combatData?.participants.length ?? 0})
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">Modo sem spoilers</span>
            </div>

            <div className="space-y-2">
              {combatData?.participants.map((p) => {
                const isCurrent = p.isCurrentTurn;
                const isPC = p.type === "PC";

                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isCurrent
                        ? "bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                        : "bg-[var(--bg-secondary)] border-[var(--border-default)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isCurrent ? "bg-blue-600 text-white" : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                        }`}
                      >
                        {p.initiative}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold text-xs ${
                              isCurrent ? "text-blue-300" : "text-[var(--text-primary)]"
                            }`}
                          >
                            {p.name}
                          </span>
                          {!isPC && (
                            <span className="text-[9px] text-red-400 bg-red-950/60 px-1 rounded border border-red-900/60 font-semibold">
                              Ameaça
                            </span>
                          )}
                        </div>

                        {/* Barra de vida apenas para PCs; Ameaças mostram apenas status */}
                        {isPC && p.hpPercent !== undefined && (
                          <div className="w-24 h-1 bg-[var(--bg-primary)] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${p.hpPercent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status de Saúde Sem Spoiler */}
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                          p.healthStatus
                        )}`}
                      >
                        {p.healthStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
