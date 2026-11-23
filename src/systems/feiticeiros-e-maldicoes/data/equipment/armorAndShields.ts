export interface UniformItem {
  id: string;
  name: string;
  cost: number;
  caBonus: number;
  penalty: number;
  slots: number;
  minStrength?: number;
  properties: string[];
  description: string;
}

export interface ShieldItem {
  id: string;
  name: string;
  cost: number;
  caBonus: number;
  rdBonus: number;
  damage: string;
  penalty: number;
  slots: number;
  minStrength?: number;
  shieldType: string;
  properties: string[];
  description: string;
}

export const UNIFORMS_CATALOG: UniformItem[] = [
  {
    id: "uniforme-comum",
    name: "Uniforme Comum de Feiticeiro",
    cost: 0,
    caBonus: 0,
    penalty: 0,
    slots: 1,
    properties: ["Uniforme Padrão", "Custo 0"],
    description: "Vestimenta fornecida pela Escola Jujutsu. Leve, flexível e resistente a rasgos comuns. Mantém sua Defesa padrão de 10 + Destreza.",
  },
  {
    id: "revestimento-leve",
    name: "Revestimento Leve",
    cost: 1,
    caBonus: 2,
    penalty: 0,
    slots: 1,
    properties: ["Defesa +2", "Sem Penalidade"],
    description: "Inserções de kevlar e polímeros internos no uniforme que aumentam a proteção sem limitar movimentos.",
  },
  {
    id: "revestimento-medio",
    name: "Revestimento Médio",
    cost: 2,
    caBonus: 4,
    penalty: -2,
    slots: 2,
    minStrength: 12,
    properties: ["Defesa +4", "Penalidade -2", "Requer Força 12"],
    description: "Placas rígidas reforçadas no tórax e flancos. Concede defesa excelente com leve impacto na mobilidade.",
  },
  {
    id: "revestimento-robusto",
    name: "Revestimento Robusto",
    cost: 3,
    caBonus: 6,
    penalty: -4,
    slots: 3,
    minStrength: 14,
    properties: ["Defesa +6", "Penalidade -4", "Requer Força 14"],
    description: "Colete pesado de cerâmica balística e blindagem corporal. Proteção máxima ao custo de agilidade.",
  },
  {
    id: "uniforme-sob-medida",
    name: "Uniforme Sob Medida",
    cost: 2,
    caBonus: 1,
    penalty: 0,
    slots: 1,
    properties: ["Defesa +1", "+2 Acrobacia/Furtividade"],
    description: "Alfaiataria personalizada de elite adaptada às medidas exatas do feiticeiro, otimizando velocidade e furtividade.",
  },
];

export const SHIELDS_CATALOG: ShieldItem[] = [
  {
    id: "escudo-leve",
    name: "Escudo Leve (Broquel)",
    cost: 1,
    caBonus: 1,
    rdBonus: 2,
    damage: "1d4",
    penalty: -1,
    slots: 1,
    shieldType: "Escudo Leve",
    properties: ["Defesa +1", "RD 2 (Reação)", "Dano 1d4", "Penalidade -1"],
    description: "Pequeno escudo circular preso no antebraço que pode ser usado tanto para amortecer golpes quanto para atacar.",
  },
  {
    id: "escudo-pequeno",
    name: "Escudo Tático Pequeno",
    cost: 2,
    caBonus: 1,
    rdBonus: 2,
    damage: "1d3",
    penalty: 0,
    slots: 1,
    shieldType: "Escudo Pequeno",
    properties: ["Defesa +1", "RD 2", "Sem Penalidade"],
    description: "Escudo compacto de liga leve com desenho moderno de fácil empunhadura sem penalidades acrobáticas.",
  },
  {
    id: "escudo-medio",
    name: "Escudo Médio de Confronto",
    cost: 2,
    caBonus: 2,
    rdBonus: 4,
    damage: "1d6",
    penalty: -2,
    slots: 2,
    shieldType: "Escudo Médio",
    properties: ["Defesa +2", "RD 4 (Reação)", "Dano 1d6", "Penalidade -2"],
    description: "Escudo militar ou de contenção que cobre metade do corpo, garantindo grande estabilidade defensiva.",
  },
  {
    id: "escudo-pesado",
    name: "Escudo Pesado (Torre)",
    cost: 3,
    caBonus: 3,
    rdBonus: 6,
    damage: "1d8",
    penalty: -4,
    slots: 3,
    minStrength: 14,
    shieldType: "Escudo Pesado",
    properties: ["Defesa +3", "RD 6 (Reação)", "Dano 1d8", "Penalidade -4", "Requer Força 14"],
    description: "Grande escudo retangular capaz de proteger o usuário inteiro e aliados adjacentes contra impactos brutais.",
  },
];
