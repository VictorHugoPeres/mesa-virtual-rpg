export type SyncEventType = "PROJECTION_UPDATE" | "DICE_ROLL" | "INITIATIVE_UPDATE";

export interface ProjectionData {
  mediaUrl: string | null;
  title?: string;
  category?: string;
}

export interface DiceRollEventData {
  roller: string;
  formula: string;
  rawRoll: string;
  modifier: number;
  total: number;
  label?: string | null;
  isCritical: boolean;
  isFumble: boolean;
  mode: string; // "DIGITAL" | "PHYSICAL_INPUT"
}

export type HealthStatus = "Saudável" | "Ferido" | "Crítico" | "Gravemente Ferido" | "Derrotado";

export interface InitiativeDisplayParticipant {
  id: string;
  name: string;
  type: "PC" | "NPC" | "THREAT";
  initiative: number;
  // PCs mostram HP exato; threats/NPCs mostram apenas status
  hpPercent?: number;         // só para PCs (barra visual)
  healthStatus: HealthStatus; // todos recebem status textual
  conditions: string[];
  isCurrentTurn: boolean;
}

export interface InitiativeDisplayData {
  isActive: boolean;
  round: number;
  participants: InitiativeDisplayParticipant[];
  showOnTv: boolean;
}

export interface SyncEvent<T = unknown> {
  id: string;
  type: SyncEventType;
  campaignId: string;
  payload: T;
  timestamp: number;
}
