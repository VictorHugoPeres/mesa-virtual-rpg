"use client";

import { useState } from "react";
import {
  Plus,
  RefreshCw,
  Play,
  Pause,
  XCircle,
  Eye,
  EyeOff,
  ArrowUpDown,
  Dices,
} from "lucide-react";
import { CombatState, CombatParticipant, EMPTY_COMBAT } from "./initiativeTypes";
import { AddCombatantModal } from "./AddCombatantModal";

interface CampaignCharItem {
  id: string;
  name: string;
  type: string;
  data: string;
}

interface InitiativeControlsProps {
  campaignId: string;
  combatState: CombatState;
  setCombatState: (state: CombatState) => void;
  characters: CampaignCharItem[];
}

export function InitiativeControls({
  campaignId: _campaignId,
  combatState,
  setCombatState,
  characters,
}: InitiativeControlsProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  function startOrPauseCombat() {
    if (combatState.participants.length === 0) return;
    setCombatState({
      ...combatState,
      isActive: !combatState.isActive,
      round: combatState.isActive ? combatState.round : Math.max(1, combatState.round),
      currentTurnIndex: combatState.currentTurnIndex || 0,
    });
  }

  function nextTurn() {
    if (!combatState.participants.length) return;
    const nextIdx = (combatState.currentTurnIndex + 1) % combatState.participants.length;
    const newRound = nextIdx === 0 ? combatState.round + 1 : combatState.round;
    setCombatState({ ...combatState, currentTurnIndex: nextIdx, round: newRound, isActive: true });
  }

  function rollAllInitiatives() {
    if (!combatState.participants.length) return;
    const updated = combatState.participants.map((p) => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      return {
        ...p,
        initiative: d20 + (p.initiativeBonus || 0),
      };
    });
    // Ordena do maior para o menor
    updated.sort((a, b) => b.initiative - a.initiative);
    setCombatState({
      ...combatState,
      participants: updated,
      currentTurnIndex: 0,
    });
  }

  function sortByInitiative() {
    if (!combatState.participants.length) return;
    const updated = [...combatState.participants].sort((a, b) => b.initiative - a.initiative);
    setCombatState({
      ...combatState,
      participants: updated,
      currentTurnIndex: 0,
    });
  }

  function toggleShowOnTv() {
    setCombatState({ ...combatState, showOnTv: !combatState.showOnTv });
  }

  function resetCombat() {
    if (!window.confirm("Deseja realmente resetar o combate ativo?")) return;
    setCombatState({ ...EMPTY_COMBAT });
  }

  function handleAddParticipant(newPart: CombatParticipant) {
    const list = [...combatState.participants, newPart];
    setCombatState({
      ...combatState,
      participants: list,
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Adicionar */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors cursor-pointer"
          title="Adicionar jogador, ameaça ou combatente rápido"
        >
          <Plus className="w-3.5 h-3.5" /> Combatente
        </button>

        {/* Rolar Iniciativas */}
        <button
          type="button"
          onClick={rollAllInitiatives}
          disabled={!combatState.participants.length}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 disabled:opacity-40 transition-colors cursor-pointer"
          title="Rolar d20 + bônus para todos e ordenar"
        >
          <Dices className="w-3.5 h-3.5 text-indigo-400" /> Rolar Inic.
        </button>

        {/* Ordenar */}
        <button
          type="button"
          onClick={sortByInitiative}
          disabled={!combatState.participants.length}
          className="p-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
          title="Ordenar turnos por iniciativa (maior → menor)"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>

        {/* Iniciar / Pausar */}
        <button
          type="button"
          onClick={startOrPauseCombat}
          disabled={!combatState.participants.length}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer ${
            combatState.isActive
              ? "bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30"
              : "bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30"
          }`}
          title={combatState.isActive ? "Pausar Combate" : "Iniciar Combate"}
        >
          {combatState.isActive ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Pausar
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> Iniciar
            </>
          )}
        </button>

        {/* Próximo Turno */}
        <button
          type="button"
          onClick={nextTurn}
          disabled={!combatState.participants.length}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 disabled:opacity-40 transition-colors cursor-pointer"
          title="Avançar para o próximo combatente"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Próx. Turno
        </button>

        {/* Exibir no Telão */}
        <button
          type="button"
          onClick={toggleShowOnTv}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            combatState.showOnTv
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-xs"
              : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-default)] hover:text-white"
          }`}
          title={combatState.showOnTv ? "Iniciativa visível no Telão da TV" : "Iniciativa oculta no Telão"}
        >
          {combatState.showOnTv ? (
            <>
              <Eye className="w-3.5 h-3.5 text-emerald-400" /> TV ON
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" /> TV OFF
            </>
          )}
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={resetCombat}
          className="p-1.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
          title="Resetar combate"
        >
          <XCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      <AddCombatantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        characters={characters}
        existingParticipants={combatState.participants}
        onAddParticipant={handleAddParticipant}
      />
    </>
  );
}
