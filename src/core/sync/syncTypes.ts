export type SyncEventType =
  | "PROJECTION_UPDATE"
  | "DICE_ROLL"
  | "INITIATIVE_UPDATE"
  | "AUDIO_UPDATE"
  | "AUDIO_SFX_PLAY"
  | "MAP_UPDATE";

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

export type AudioOutputTarget = "MASTER_PC" | "TV_TELAO";

export interface AudioBGMEventData {
  trackUrl: string | null;
  trackTitle: string | null;
  trackCategory?: string | null;
  isPlaying: boolean;
  volume: number; // 0 a 1
  loop: boolean;
  outputTarget: AudioOutputTarget;
  currentTime?: number;
}

export interface AudioSFXEventData {
  id: string;
  url: string; // url ou identificador de som sintetizado (ex: "synth:sword", etc)
  title: string;
  volume: number; // 0 a 1
  timestamp: number;
}

export interface CameraState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface TacticalMapSyncData {
  id: string;
  title: string;
  imageUrl: string;
  gridEnabled: boolean;
  gridSize: number; // tamanho da célula em pixels
  gridColor: string;
  gridOpacity: number; // 0 a 1
  metersPerGrid: number;
  cameraState: CameraState;
  isProjected: boolean;
}

export interface SyncEvent<T = unknown> {
  id: string;
  type: SyncEventType;
  campaignId: string;
  payload: T;
  timestamp: number;
}
