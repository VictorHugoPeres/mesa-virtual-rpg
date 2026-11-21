import { CameraState, TacticalMapSyncData, MapDisplayMode } from "../sync/syncTypes";

export type { CameraState, TacticalMapSyncData, MapDisplayMode };

export interface TacticalMapData {
  id: string;
  campaignId: string;
  title: string;
  imageUrl: string;
  gridEnabled: boolean;
  gridSize: number; // tamanho da célula em pixels
  gridColor: string;
  gridOpacity: number; // 0 a 1
  metersPerGrid: number;
  cameraState: CameraState;
  elementsData?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_CAMERA: CameraState = {
  zoom: 1,
  panX: 0,
  panY: 0,
};

export const GRID_COLOR_PRESETS = [
  { name: "Branco", value: "#ffffff" },
  { name: "Preto", value: "#000000" },
  { name: "Cinza", value: "#9ca3af" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Âmbar", value: "#f59e0b" },
];
