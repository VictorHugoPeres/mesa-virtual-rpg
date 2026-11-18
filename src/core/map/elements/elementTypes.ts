import { HealthStatus } from "../../sync/syncTypes";

export type MapElementType = "TOKEN" | "PROP";

export interface MapElement {
  id: string; // uuid
  type: MapElementType;
  name: string;
  imageUrl?: string;
  x: number; // posição em pixels na imagem
  y: number; // posição em pixels na imagem
  widthCells: number; // largura em células do grid (1, 2, 3, etc)
  heightCells: number; // altura em células do grid
  rotation: number; // rotação em graus (0, 45, 90, 180, etc)

  // Dados exclusivos de Tokens
  characterId?: string;
  participantId?: string;
  tokenType?: "PC" | "NPC" | "THREAT";
  currentHp?: number;
  maxHp?: number;
  healthStatus?: HealthStatus;
  conditions?: string[];

  // Dados exclusivos de Props
  propShape?: "rect" | "circle";
  propIcon?: string;
  propColor?: string;
  isLocked?: boolean;
}

export interface PresetProp {
  id: string;
  name: string;
  widthCells: number;
  heightCells: number;
  propShape: "rect" | "circle";
  propIcon: string;
  propColor: string;
  description: string;
}

export const PRESET_PROPS: PresetProp[] = [
  {
    id: "prop-table",
    name: "Mesa de Madeira",
    widthCells: 2,
    heightCells: 1,
    propShape: "rect",
    propIcon: "table",
    propColor: "#854d0e",
    description: "Mesa retangular comum (2x1)",
  },
  {
    id: "prop-chair",
    name: "Banco / Cadeira",
    widthCells: 1,
    heightCells: 1,
    propShape: "rect",
    propIcon: "chair",
    propColor: "#a16207",
    description: "Assento simples (1x1)",
  },
  {
    id: "prop-crate",
    name: "Caixa / Baú",
    widthCells: 1,
    heightCells: 1,
    propShape: "rect",
    propIcon: "box",
    propColor: "#78350f",
    description: "Caixa de suprimentos ou baú (1x1)",
  },
  {
    id: "prop-pillar",
    name: "Pilar de Pedra",
    widthCells: 1,
    heightCells: 1,
    propShape: "circle",
    propIcon: "pillar",
    propColor: "#52525b",
    description: "Coluna sólida de pedra (1x1)",
  },
  {
    id: "prop-barricade",
    name: "Barricada",
    widthCells: 2,
    heightCells: 1,
    propShape: "rect",
    propIcon: "shield",
    propColor: "#475569",
    description: "Barricada de cobertura (2x1)",
  },
  {
    id: "prop-car",
    name: "Carro / Veículo",
    widthCells: 2,
    heightCells: 3,
    propShape: "rect",
    propIcon: "car",
    propColor: "#1e3a8a",
    description: "Veículo urbano (2x3)",
  },
];

export function getHealthColor(status?: HealthStatus): { ring: string; bg: string } {
  switch (status) {
    case "Saudável":
      return { ring: "border-emerald-500", bg: "bg-emerald-500" };
    case "Ferido":
      return { ring: "border-amber-500", bg: "bg-amber-500" };
    case "Crítico":
      return { ring: "border-orange-500", bg: "bg-orange-500" };
    case "Gravemente Ferido":
      return { ring: "border-red-600", bg: "bg-red-600" };
    case "Derrotado":
      return { ring: "border-zinc-600", bg: "bg-zinc-600" };
    default:
      return { ring: "border-blue-500", bg: "bg-blue-500" };
  }
}
