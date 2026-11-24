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
        <div className="p-8 rounded-2xl bg-[#14161A] border border-[#23272F] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
            <Swords className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-zinc-100">Nenhum Combate Ativo</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Aguarde o Mestre iniciar a ordem de iniciativa para visualizar os turnos ao vivo.
          </p>
        </div>
      ) : (
        <>
          {/* Banner do Turno Atual */}
          <div
            className={`p-4 rounded-2xl border text-center space-y-1 shadow-md transition-all ${
              isMyTurn
                ? "bg-emerald-950/40 border-emerald-500/60 animate-pulse"
                : "bg-[#14161A] border border-[#23272F]"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
              Rodada {combatData?.round ?? 1}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-zinc-400">Turno de:</span>
              <span className="text-base font-black text-zinc-100">
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
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Ordem de Turnos ({combatData?.participants.length ?? 0})
              </span>
              <span className="text-[10px] text-zinc-500">Modo sem spoilers</span>
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
                        ? "bg-[#1A1D24] border-emerald-500/60 shadow-md ring-1 ring-emerald-500/40"
                        : "bg-[#14161A] border border-[#23272F]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isCurrent ? "bg-emerald-600 text-white" : "bg-[#0B0C0E] text-zinc-400 border border-[#23272F]"
                        }`}
                      >
                        {p.initiative}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold text-xs ${
                              isCurrent ? "text-emerald-300 font-black" : "text-zinc-100"
                            }`}
                          >
                            {p.name}
                          </span>
                          {!isPC && (
                            <span className="text-[9px] text-rose-300 bg-rose-950/60 px-1 rounded border border-rose-900/60 font-semibold">
                              Ameaça
                            </span>
                          )}
                        </div>

                        {/* Barra de vida apenas para PCs; Ameaças mostram apenas status */}
                        {isPC && p.hpPercent !== undefined && (
                          <div className="w-24 h-1 bg-[#0B0C0E] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-rose-500 rounded-full"
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
