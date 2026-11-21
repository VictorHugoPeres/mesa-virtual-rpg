"use client";

import { useState, useEffect } from "react";
import { useDice } from "@/core/dice/DiceContext";
import { useCampaignSync } from "@/core/sync/useCampaignSync";
import { SyncEvent, DiceRollEventData } from "@/core/sync/syncTypes";
import { Dices, Sparkles, AlertTriangle, Clock } from "lucide-react";

interface RollLogItem {
  id: string;
  roller: string;
  formula: string;
  total: number;
  label?: string | null;
  isCritical: boolean;
  isFumble: boolean;
  createdAt?: string;
}

interface MobileTabDadosProps {
  campaignId: string;
  characterId: string;
  characterName: string;
}

const COMMON_DICE = ["1d4", "1d6", "1d8", "1d10", "1d12", "1d20", "1d100"];

export function MobileTabDados({
  campaignId,
  characterId,
  characterName,
}: MobileTabDadosProps) {
  const { openRoller } = useDice();
  const [logs, setLogs] = useState<RollLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega histórico inicial de rolagens
  useEffect(() => {
    fetch(`/api/rolls?campaignId=${campaignId}&limit=25`)
      .then((res) => res.json())
      .then((data) => {
        if (data.rolls) setLogs(data.rolls);
      })
      .catch((err) => console.error("Erro ao carregar rolagens:", err))
      .finally(() => setLoading(false));
  }, [campaignId]);

  // Escuta novas rolagens em tempo real via SSE
  useCampaignSync({
    campaignId,
    onEvent: (event: SyncEvent) => {
      if (event.type === "DICE_ROLL") {
        const payload = event.payload as DiceRollEventData;
        const newLog: RollLogItem = {
          id: event.id,
          roller: payload.roller,
          formula: payload.formula,
          total: payload.total,
          label: payload.label,
          isCritical: payload.isCritical,
          isFumble: payload.isFumble,
        };
        setLogs((prev) => [newLog, ...prev.slice(0, 30)]);
      }
    },
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Botões rápidos de dados */}
      <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-3">
        <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block">
          Rolagem Rápida de Dados
        </span>
        <div className="grid grid-cols-4 gap-2">
          {COMMON_DICE.map((dice) => (
            <button
              key={dice}
              type="button"
              onClick={() =>
                openRoller({
                  label: `Rolagem ${dice}`,
                  modifier: 0,
                  defaultDice: dice,
                  roller: characterName,
                  characterId,
                  campaignId,
                })
              }
              className="py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-blue-500 font-black text-sm text-blue-400 active:scale-95 transition-all shadow-xs touch-manipulation select-none cursor-pointer"
            >
              {dice}
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              openRoller({
                label: "Rolagem com Modificador",
                modifier: 0,
                defaultDice: "1d20",
                roller: characterName,
                characterId,
                campaignId,
              })
            }
            className="col-span-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1 shadow-xs touch-manipulation select-none cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5" /> Mais
          </button>
        </div>
      </div>

      {/* Histórico Recente de Rolagens */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Histórico Recente (Ao Vivo)
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">Sincronizado com o Telão</span>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-[var(--text-muted)]">
            Carregando rolagens...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-center text-xs text-[var(--text-muted)]">
            Nenhuma rolagem recente ainda.
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[var(--text-primary)]">
                      {log.roller}
                    </span>
                    {log.isCritical && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 rounded border border-emerald-800 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> CRÍTICO!
                      </span>
                    )}
                    {log.isFumble && (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 rounded border border-rose-800 flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" /> FALHA!
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {log.label || "Rolagem"} ({log.formula})
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black text-lg ${
                      log.isCritical
                        ? "text-emerald-400"
                        : log.isFumble
                        ? "text-rose-400"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {log.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
