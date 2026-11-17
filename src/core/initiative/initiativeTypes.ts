import type { HealthStatus, InitiativeDisplayParticipant, InitiativeDisplayData } from "../sync/syncTypes";

// ────────────────────────────────────────────
// Tipos internos do Tracker de Iniciativa
// ────────────────────────────────────────────

export interface CombatParticipant {
  id: string;               // uuid único no combate
  name: string;
  type: "PC" | "NPC" | "THREAT";
  characterId?: string;     // ID do Character no banco (para PCs/NPCs com ficha)
  initiative: number;
  initiativeBonus: number;
  maxHp: number;
  currentHp: number;
  maxEnergy?: number;
  currentEnergy?: number;
  defense: number;
  conditions: string[];
  isVisible: boolean;       // visível no telão?
  notes?: string;
}

export interface CombatState {
  isActive: boolean;
  round: number;
  currentTurnIndex: number;
  participants: CombatParticipant[];
  showOnTv: boolean;
}

export const EMPTY_COMBAT: CombatState = {
  isActive: false,
  round: 1,
  currentTurnIndex: 0,
  participants: [],
  showOnTv: false,
};

export const CONDITION_LIST = [
  "Agarrado",
  "Atordoado",
  "Cego",
  "Caído",
  "Enfeitiçado",
  "Envenenado",
  "Exausto",
  "Incapacitado",
  "Inconsciente",
  "Invisível",
  "Paralisado",
  "Petrificado",
  "Restringido",
  "Surdo",
] as const;

/** Calcula o status de saúde com base na % de HP */
export function getHealthStatus(currentHp: number, maxHp: number): HealthStatus {
  if (maxHp <= 0 || currentHp <= 0) return "Derrotado";
  const pct = currentHp / maxHp;
  if (pct >= 0.75) return "Saudável";
  if (pct >= 0.50) return "Ferido";
  if (pct >= 0.25) return "Crítico";
  return "Gravemente Ferido";
}

/** Converte CombatState → InitiativeDisplayData (sanitizado para TV) */
export function combatToTvData(state: CombatState): InitiativeDisplayData {
  const participants: InitiativeDisplayParticipant[] = state.participants
    .filter((p) => p.isVisible)
    .map((p, _idx) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      initiative: p.initiative,
      hpPercent: p.type === "PC" ? Math.max(0, Math.round((p.currentHp / p.maxHp) * 100)) : undefined,
      healthStatus: getHealthStatus(p.currentHp, p.maxHp),
      conditions: p.conditions,
      isCurrentTurn: false, // será marcado abaixo
    }));

  // Marca o turno atual (baseado no index do estado original, ajustado para visíveis)
  const currentParticipant = state.participants[state.currentTurnIndex];
  if (currentParticipant) {
    const tvMatch = participants.find((p) => p.id === currentParticipant.id);
    if (tvMatch) tvMatch.isCurrentTurn = true;
  }

  return {
    isActive: state.isActive,
    round: state.round,
    participants,
    showOnTv: state.showOnTv,
  };
}
