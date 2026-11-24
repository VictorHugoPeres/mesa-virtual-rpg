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
  RotateCcw,
} from "lucide-react";
import { CombatState, CombatParticipant, EMPTY_COMBAT } from "./initiativeTypes";
import { AddCombatantModal } from "./AddCombatantModal";
import { useDialog } from "@/core/ui";

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
  const { confirm } = useDialog();
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

  const pendingCount = combatState.participants.filter(
    (p) => !p.initiativeRolled && p.initiative === 0
  ).length;

  function rollPendingInitiatives() {
    if (!combatState.participants.length) return;
    const updated = combatState.participants.map((p) => {
      // Preserva quem já teve iniciativa rolada ou definida manualmente
      if (p.initiativeRolled || p.initiative !== 0) {
        return { ...p, initiativeRolled: true };
      }
      const d20 = Math.floor(Math.random() * 20) + 1;
      return {
        ...p,
        initiative: d20 + (p.initiativeBonus || 0),
        initiativeRolled: true,
      };
    });
    // Ordena do maior para o menor
    updated.sort((a, b) => {
      if (b.initiative !== a.initiative) {
        return b.initiative - a.initiative;
      }
      return (b.initiativeBonus || 0) - (a.initiativeBonus || 0);
    });
    setCombatState({
      ...combatState,
      participants: updated,
      currentTurnIndex: 0,
    });
  }

  async function resetInitiatives() {
    if (!combatState.participants.length) return;
    const ok = await confirm({
      title: "Zerar Iniciativa",
      message: "Deseja zerar a iniciativa de todos os participantes para uma nova cena?",
      variant: "warning",
    });
    if (!ok) return;
    const updated = combatState.participants.map((p) => ({
      ...p,
      initiative: 0,
      initiativeRolled: false,
    }));
    setCombatState({
      ...combatState,
      participants: updated,
      currentTurnIndex: 0,
      round: 1,
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

  async function resetCombat() {
    const ok = await confirm({
      title: "Resetar Combate",
      message: "Deseja realmente resetar o combate ativo? Todos os participantes serão removidos.",
      variant: "danger",
    });
    if (!ok) return;
    setCombatState({ ...EMPTY_COMBAT });
  }

  function handleAddParticipant(newPart: CombatParticipant) {
    const list = [...combatState.participants, newPart];
    setCombatState({
      ...combatState,
      participants: list,
    });
  }

  const btnNeutro =
    "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all shadow-xs cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed";

  const hasCombatants = combatState.participants.length > 0;

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Adicionar */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className={
            hasCombatants
              ? btnNeutro
              : "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-zinc-100 transition-all shadow-xs cursor-pointer select-none active:scale-95"
          }
          title="Adicionar jogador, ameaça ou combatente rápido"
        >
          <Plus className={`w-3.5 h-3.5 ${hasCombatants ? "text-zinc-400" : "text-rose-400"}`} />
          <span>Combatente</span>
        </button>

        {/* Rolar Iniciativas Pendentes */}
        <button
          type="button"
          onClick={rollPendingInitiatives}
          disabled={!hasCombatants}
          className={btnNeutro}
          title="Rolar iniciativa apenas para quem está pendente (preserva iniciativas já roladas)"
        >
          <Dices className="w-3.5 h-3.5 text-sky-400" />
          <span>{pendingCount > 0 ? `Rolar Inic. (${pendingCount})` : "Rolar Inic."}</span>
        </button>

        {/* Zerar Iniciativas */}
        <button
          type="button"
          onClick={resetInitiatives}
          disabled={!hasCombatants}
          className={btnNeutro}
          title="Zerar iniciativas de todos os participantes para nova cena"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          <span>Zerar Inic.</span>
        </button>

        {/* Ordenar */}
        <button
          type="button"
          onClick={sortByInitiative}
          disabled={!hasCombatants}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-xs font-medium bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] text-zinc-400 hover:text-white transition-all shadow-xs cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Ordenar turnos por iniciativa (maior → menor)"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>

        {/* Iniciar / Pausar */}
        <button
          type="button"
          onClick={startOrPauseCombat}
          disabled={!hasCombatants}
          className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all shadow-xs select-none ${
            !hasCombatants
              ? "bg-zinc-800/60 text-zinc-500 cursor-not-allowed border border-white/5 opacity-60"
              : !combatState.isActive
              ? "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40 cursor-pointer active:scale-95"
              : "bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] text-zinc-200 hover:text-white cursor-pointer active:scale-95"
          }`}
          title={
            !hasCombatants
              ? "Adicione combatentes para iniciar o combate"
              : combatState.isActive
              ? "Pausar Combate"
              : "Iniciar Combate"
          }
        >
          {combatState.isActive ? (
            <>
              <Pause className="w-3.5 h-3.5 text-zinc-400" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play
                className={`w-3.5 h-3.5 ${
                  hasCombatants ? "text-white fill-white" : "text-zinc-500 fill-zinc-500"
                }`}
              />
              <span>Iniciar</span>
            </>
          )}
        </button>

        {/* Próximo Turno */}
        <button
          type="button"
          onClick={nextTurn}
          disabled={!hasCombatants}
          className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all shadow-xs select-none ${
            hasCombatants && combatState.isActive
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer active:scale-95"
              : "bg-[#14161A] border border-[#23272F] text-zinc-600 cursor-not-allowed opacity-60"
          }`}
          title="Avançar para o próximo combatente"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${hasCombatants && combatState.isActive ? "text-white" : "text-zinc-600"}`} />
          <span>Próx. Turno</span>
        </button>

        {/* Exibir no Telão */}
        <button
          type="button"
          onClick={toggleShowOnTv}
          className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer select-none active:scale-95 ${
            combatState.showOnTv
              ? "bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/30"
              : "bg-[#14161A] border border-[#23272F] text-zinc-400 hover:text-zinc-200 hover:bg-[#1A1D24]"
          }`}
          title={combatState.showOnTv ? "Iniciativa visível no Telão da TV" : "Iniciativa oculta no Telão"}
        >
          {combatState.showOnTv ? (
            <>
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>TV ON</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
              <span>TV OFF</span>
            </>
          )}
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={resetCombat}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer select-none active:scale-95"
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
