export type SyncEventType = "PROJECTION_UPDATE" | "DICE_ROLL";

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

export interface SyncEvent<T = unknown> {
  id: string;
  type: SyncEventType;
  campaignId: string;
  payload: T;
  timestamp: number;
}
