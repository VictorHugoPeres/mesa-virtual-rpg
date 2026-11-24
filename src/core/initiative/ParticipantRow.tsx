"use client";

import { useState } from "react";
import { CombatParticipant, CONDITION_LIST } from "./initiativeTypes";
import { Shield, Heart, Zap, Trash2, Plus, X, ChevronRight, Skull, Swords, ExternalLink, Dices } from "lucide-react";

interface ParticipantRowProps {
  participant: CombatParticipant;
  isCurrentTurn: boolean;
  onUpdate: (updated: CombatParticipant) => void;
  onRemove: (id: string) => void;
  campaignId?: string;
  onOpenThreatSheet?: (participant: CombatParticipant) => void;
}

export function ParticipantRow({
  participant,
  isCurrentTurn,
  onUpdate,
  onRemove,
  campaignId,
  onOpenThreatSheet,
}: ParticipantRowProps) {
  const [showConditionPicker, setShowConditionPicker] = useState(false);

  function handleRollIndividualInitiative() {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + (participant.initiativeBonus || 0);
    onUpdate({
      ...participant,
      initiative: total,
      initiativeRolled: true,
    });
  }

  function adjustHp(amount: number) {
    const newHp = Math.max(0, Math.min(participant.maxHp * 2, participant.currentHp + amount));
    onUpdate({ ...participant, currentHp: newHp });
  }

  function adjustEnergy(amount: number) {
    if (participant.currentEnergy === undefined || participant.maxEnergy === undefined) return;
    const newPe = Math.max(0, Math.min(participant.maxEnergy, participant.currentEnergy + amount));
    onUpdate({ ...participant, currentEnergy: newPe });
  }

  function addCondition(cond: string) {
    if (participant.conditions.includes(cond)) return;
    onUpdate({ ...participant, conditions: [...participant.conditions, cond] });
    setShowConditionPicker(false);
  }

  function removeCondition(cond: string) {
    onUpdate({
      ...participant,
      conditions: participant.conditions.filter((c) => c !== cond),
    });
  }

  const isDead = participant.currentHp <= 0;

  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        isCurrentTurn
          ? "border-emerald-500/50 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/30"
          : isDead
          ? "border-rose-950/40 bg-rose-950/10 opacity-60"
          : "border-[#23272F] bg-[#14161A] hover:border-white/15 hover:bg-[#1A1D24]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Esquerda: Indicador de turno + Iniciativa + Nome */}
        <div className="flex items-center gap-2.5 min-w-[200px] flex-1">
          {isCurrentTurn ? (
            <div className="p-1 rounded bg-emerald-500 text-black font-bold animate-pulse" title="Vez deste combatente">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-5" />
          )}

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-zinc-500 font-mono">INI</span>
            <input
              type="number"
              value={participant.initiative}
              onChange={(e) =>
                onUpdate({
                  ...participant,
                  initiative: Number(e.target.value) || 0,
                  initiativeRolled: true,
                })
              }
              className={`w-12 text-center bg-[#0B0C0E] border rounded px-1.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-zinc-500 ${
                participant.initiativeRolled ? "border-emerald-500/40 text-emerald-300" : "border-[#23272F]"
              }`}
              title={participant.initiativeRolled ? "Iniciativa rolada/definida" : "Iniciativa pendente"}
            />
            <button
              type="button"
              onClick={handleRollIndividualInitiative}
              className="p-1 rounded bg-[#14161A] border border-[#23272F] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              title={`Rolar iniciativa individual (1d20+${participant.initiativeBonus || 0})`}
            >
              <Dices className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              {participant.type === "THREAT" && onOpenThreatSheet ? (
                <button
                  type="button"
                  onClick={() => onOpenThreatSheet(participant)}
                  className={`text-sm font-semibold text-left hover:underline flex items-center gap-1 cursor-pointer ${
                    isDead ? "line-through text-rose-400" : "text-rose-300 hover:text-white"
                  }`}
                  title="Abrir ficha e ataques da ameaça"
                >
                  <Skull className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{participant.name}</span>
                </button>
              ) : (
                <span className={`text-sm font-semibold ${isDead ? "line-through text-rose-400" : "text-zinc-100"}`}>
                  {participant.name}
                </span>
              )}

              <span
                className={`text-[9px] uppercase font-semibold px-1.5 py-0.2 rounded border ${
                  participant.type === "PC"
                    ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {participant.type === "PC" ? "Jogador" : "Ameaça"}
              </span>

              {/* Botão Ameaça: Ficha / Ataques */}
              {participant.type === "THREAT" && onOpenThreatSheet && (
                <button
                  type="button"
                  onClick={() => onOpenThreatSheet(participant)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  title="Abrir ficha e rolar ataques"
                >
                  <Swords className="w-3 h-3 text-rose-400" />
                  <span>Ficha / Ataques</span>
                </button>
              )}

              {/* Botão Jogador: Abrir ficha em nova aba */}
              {participant.type === "PC" && participant.characterId && campaignId && (
                <a
                  href={`/mestre/${campaignId}/fichas/${participant.characterId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 border border-[#23272F] transition-colors"
                  title="Abrir ficha completa em nova aba"
                >
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                  <span>Ficha</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span className="flex items-center gap-1 text-[11px] text-zinc-300">
                <Shield className="w-3 h-3 text-zinc-400" /> Def {participant.defense}
              </span>
            </div>
          </div>
        </div>

        {/* Centro: Controle de HP e PE */}
        <div className="flex items-center gap-3">
          {/* Pontos de Vida (HP) */}
          <div className="flex items-center gap-1 bg-[#0B0C0E] px-2 py-1 rounded-lg border border-[#23272F]">
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <button type="button" onClick={() => adjustHp(-5)} className="px-1 text-[11px] font-bold text-rose-400 hover:text-rose-300">-5</button>
            <button type="button" onClick={() => adjustHp(-1)} className="px-1 text-xs font-bold text-rose-400 hover:text-rose-300">-1</button>
            <input
              type="number"
              value={participant.currentHp}
              onChange={(e) => onUpdate({ ...participant, currentHp: Number(e.target.value) || 0 })}
              className="w-11 text-center bg-transparent text-xs font-bold text-white focus:outline-none"
            />
            <span className="text-[10px] text-zinc-500">/{participant.maxHp}</span>
            <button type="button" onClick={() => adjustHp(1)} className="px-1 text-xs font-bold text-emerald-400 hover:text-emerald-300">+1</button>
            <button type="button" onClick={() => adjustHp(5)} className="px-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300">+5</button>
          </div>

          {/* PE */}
          {participant.maxEnergy !== undefined && participant.currentEnergy !== undefined && (
            <div className="flex items-center gap-1 bg-[#0B0C0E] px-2 py-1 rounded-lg border border-[#23272F]">
              <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <button type="button" onClick={() => adjustEnergy(-1)} className="px-1 text-xs font-bold text-sky-400 hover:text-sky-300">-1</button>
              <span className="text-xs font-bold text-white min-w-[18px] text-center">{participant.currentEnergy}</span>
              <span className="text-[10px] text-zinc-500">/{participant.maxEnergy}</span>
              <button type="button" onClick={() => adjustEnergy(1)} className="px-1 text-xs font-bold text-sky-400 hover:text-sky-300">+1</button>
            </div>
          )}
        </div>

        {/* Direita: Condições e Remover */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 flex-wrap max-w-[180px]">
            {participant.conditions.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {c}
                <button type="button" onClick={() => removeCondition(c)} className="hover:text-white cursor-pointer"><X className="w-2.5 h-2.5" /></button>
              </span>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowConditionPicker(!showConditionPicker)}
                className="p-1 rounded text-[10px] text-zinc-400 hover:text-white hover:bg-[#1A1D24] border border-[#23272F] cursor-pointer"
                title="Adicionar Condição"
              >
                <Plus className="w-3 h-3" />
              </button>

              {showConditionPicker && (
                <div className="absolute right-0 top-full mt-1 z-30 w-36 bg-[#14161A] border border-[#23272F] rounded-lg shadow-xl p-1 max-h-48 overflow-y-auto">
                  {CONDITION_LIST.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => addCondition(cond)}
                      className="w-full text-left px-2 py-1 text-xs rounded hover:bg-[#1A1D24] text-zinc-300 hover:text-white"
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(participant.id)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
            title="Remover do combate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
