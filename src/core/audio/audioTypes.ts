import { AudioOutputTarget, AudioBGMEventData } from "../sync/syncTypes";

export type { AudioOutputTarget, AudioBGMEventData };

export interface AudioTrack {
  id: string;
  title: string;
  url: string;
  category: string; // "COMBATE" | "TENSÃO" | "EXPLORAÇÃO" | "AMBIENTE" | "OUTROS"
  notes?: string | null;
}

export interface BGMState {
  track: AudioTrack | null;
  isPlaying: boolean;
  volume: number; // 0 a 1
  loop: boolean;
  currentTime: number;
  duration: number;
  outputTarget: AudioOutputTarget;
}

export interface SFXItem {
  id: string;
  title: string;
  url: string; // url real ou "synth:..."
  category?: string;
  colorTheme: "red" | "purple" | "blue" | "amber" | "emerald" | "zinc";
}

export const BGM_CATEGORIES = [
  "TODOS",
  "COMBATE",
  "TENSÃO",
  "EXPLORAÇÃO",
  "AMBIENTE",
  "OUTROS",
] as const;

export type BGMCategoryType = (typeof BGM_CATEGORIES)[number];

export const DEFAULT_SFX_PRESETS: SFXItem[] = [
  {
    id: "preset-sword",
    title: "Golpe de Espada",
    url: "synth:sword",
    colorTheme: "red",
  },
  {
    id: "preset-domain",
    title: "Expansão de Domínio",
    url: "synth:domain",
    colorTheme: "purple",
  },
  {
    id: "preset-thunder",
    title: "Trovão",
    url: "synth:thunder",
    colorTheme: "blue",
  },
  {
    id: "preset-impact",
    title: "Impacto Pesado",
    url: "synth:impact",
    colorTheme: "amber",
  },
  {
    id: "preset-curse",
    title: "Feitiço / Maldição",
    url: "synth:curse",
    colorTheme: "emerald",
  },
  {
    id: "preset-suspense",
    title: "Suspense / Tensão",
    url: "synth:suspense",
    colorTheme: "zinc",
  },
];

export const INITIAL_BGM_STATE: BGMState = {
  track: null,
  isPlaying: false,
  volume: 0.7,
  loop: true,
  currentTime: 0,
  duration: 0,
  outputTarget: "MASTER_PC",
};
