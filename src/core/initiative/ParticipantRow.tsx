"use client";

import { useState } from "react";
import { CombatParticipant, CONDITION_LIST } from "./initiativeTypes";
import { Shield, Heart, Zap, Trash2, Plus, X, ChevronRight } from "lucide-react";

interface ParticipantRowProps {
  participant: CombatParticipant;
  isCurrentTurn: boolean;
  onUpdate: (updated: CombatParticipant) => void;
  onRemove: (id: string) => void;
}

export function ParticipantRow({
  participant,
  isCurrentTurn,
  onUpdate,
  onRemove,
}: ParticipantRowProps) {
  const [showConditionPicker, setShowConditionPicker] = useState(false);

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
          ? "border-[var(--accent-blue)] bg-blue-950/20 shadow-md ring-1 ring-blue-500/50"
          : isDead
          ? "border-red-950/40 bg-red-950/10 opacity-60"
          : "border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--border-hover,#3f3f4e)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Esquerda: Indicador de turno + Iniciativa + Nome */}
        <div className="flex items-center gap-2.5 min-w-[200px] flex-1">
          {isCurrentTurn ? (
            <div className="p-1 rounded bg-blue-500 text-white animate-pulse" title="Vez deste combatente">
              <ChevronRight className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-6" />
          )}

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[var(--text-muted)] font-mono">INI</span>
            <input
              type="number"
              value={participant.initiative}
              onChange={(e) =>
                onUpdate({ ...participant, initiative: Number(e.target.value) || 0 })
              }
              className="w-12 text-center bg-[var(--bg-input,#121218)] border border-[var(--border-default)] rounded px-1.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isDead ? "line-through text-red-400" : "text-white"}`}>
                {participant.name}
              </span>
              <span
                className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                  participant.type === "PC"
                    ? "bg-blue-950/60 text-blue-400 border-blue-800/60"
                    : "bg-red-950/60 text-red-400 border-red-800/60"
                }`}
              >
                {participant.type === "PC" ? "Jogador" : "Ameaça"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5">
              <span className="flex items-center gap-0.5">
                <Shield className="w-3 h-3 text-blue-400" /> Def {participant.defense}
              </span>
            </div>
          </div>
        </div>

        {/* Centro: Controle de HP e PE */}
        <div className="flex items-center gap-4">
          {/* Pontos de Vida (HP) */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-2.5 py-1 rounded-lg border border-[var(--border-default)]">
            <Heart className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <button
              type="button"
              onClick={() => adjustHp(-5)}
              className="px-1 text-[11px] font-bold text-red-400 hover:text-red-300"
              title="-5 PV"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => adjustHp(-1)}
              className="px-1 text-xs font-bold text-red-400 hover:text-red-300"
              title="-1 PV"
            >
              -1
            </button>
            <input
              type="number"
              value={participant.currentHp}
              onChange={(e) =>
                onUpdate({ ...participant, currentHp: Number(e.target.value) || 0 })
              }
              className="w-12 text-center bg-transparent text-xs font-bold text-white focus:outline-none"
            />
            <span className="text-[10px] text-[var(--text-muted)]">/{participant.maxHp}</span>
            <button
              type="button"
              onClick={() => adjustHp(1)}
              className="px-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              title="+1 PV"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => adjustHp(5)}
              className="px-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
              title="+5 PV"
            >
              +5
            </button>
          </div>

          {/* PE (se existir) */}
          {participant.maxEnergy !== undefined && participant.currentEnergy !== undefined && (
            <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-2.5 py-1 rounded-lg border border-[var(--border-default)]">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <button
                type="button"
                onClick={() => adjustEnergy(-1)}
                className="px-1 text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                -1
              </button>
              <span className="text-xs font-bold text-white min-w-[20px] text-center">
                {participant.currentEnergy}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">/{participant.maxEnergy}</span>
              <button
                type="button"
                onClick={() => adjustEnergy(1)}
                className="px-1 text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                +1
              </button>
            </div>
          )}
        </div>

        {/* Direita: Condições e Remover */}
        <div className="flex items-center gap-2">
          {/* Condições ativas */}
          <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
            {participant.conditions.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/60"
              >
                {c}
                <button
                  type="button"
                  onClick={() => removeCondition(c)}
                  className="hover:text-white"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowConditionPicker(!showConditionPicker)}
                className="p-1 rounded text-[10px] text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-secondary)] border border-[var(--border-default)] cursor-pointer"
                title="Adicionar Condição"
              >
                <Plus className="w-3 h-3" />
              </button>

              {showConditionPicker && (
                <div className="absolute right-0 top-full mt-1 z-30 w-36 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg shadow-xl p-1 max-h-48 overflow-y-auto">
                  {CONDITION_LIST.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => addCondition(cond)}
                      className="w-full text-left px-2 py-1 text-xs rounded hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white"
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Remover do Combate */}
          <button
            type="button"
            onClick={() => onRemove(participant.id)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
            title="Remover do combate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
