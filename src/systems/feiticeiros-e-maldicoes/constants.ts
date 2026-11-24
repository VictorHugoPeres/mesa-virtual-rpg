// ────────────────────────────────────────────
// Constantes do sistema Feiticeiros & Maldições (F&M v2.5)
// ────────────────────────────────────────────

export const ATTRIBUTE_KEYS = [
  "FOR",
  "DEX",
  "CON",
  "INT",
  "SAB",
  "PRE",
] as const;

export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  FOR: "Força",
  DEX: "Destreza",
  CON: "Constituição",
  INT: "Inteligência",
  SAB: "Sabedoria",
  PRE: "Presença",
};

export interface SkillDef {
  name: string;
  attribute: AttributeKey;
  requiresTraining: boolean;
  isSavingThrow?: boolean;
}

// 20 Perícias Canônicas v2.5 (sem Luta/Pontaria) + 5 Testes de Resistência (TR)
export const SKILLS_LIST: SkillDef[] = [
  // FOR
  { name: "Atletismo", attribute: "FOR", requiresTraining: false },

  // DEX
  { name: "Acrobacia", attribute: "DEX", requiresTraining: false },
  { name: "Furtividade", attribute: "DEX", requiresTraining: false },
  { name: "Prestidigitação", attribute: "DEX", requiresTraining: true },
  { name: "Reflexos", attribute: "DEX", requiresTraining: false, isSavingThrow: true },

  // CON (TRs)
  { name: "Fortitude", attribute: "CON", requiresTraining: false, isSavingThrow: true },
  { name: "Integridade", attribute: "CON", requiresTraining: false, isSavingThrow: true },

  // INT
  { name: "Astúcia", attribute: "INT", requiresTraining: false, isSavingThrow: true },
  { name: "Feitiçaria", attribute: "INT", requiresTraining: true },
  { name: "História", attribute: "INT", requiresTraining: false },
  { name: "Investigação", attribute: "INT", requiresTraining: false },
  { name: "Ofício", attribute: "INT", requiresTraining: true },
  { name: "Tecnologia", attribute: "INT", requiresTraining: false },
  { name: "Teologia", attribute: "INT", requiresTraining: false },

  // SAB
  { name: "Direção", attribute: "SAB", requiresTraining: false },
  { name: "Intuição", attribute: "SAB", requiresTraining: false },
  { name: "Medicina", attribute: "SAB", requiresTraining: true },
  { name: "Ocultismo", attribute: "SAB", requiresTraining: false },
  { name: "Percepção", attribute: "SAB", requiresTraining: false },
  { name: "Sobrevivência", attribute: "SAB", requiresTraining: false },
  { name: "Vontade", attribute: "SAB", requiresTraining: false, isSavingThrow: true },

  // PRE
  { name: "Enganação", attribute: "PRE", requiresTraining: false },
  { name: "Intimidação", attribute: "PRE", requiresTraining: false },
  { name: "Performance", attribute: "PRE", requiresTraining: false },
  { name: "Persuasão", attribute: "PRE", requiresTraining: false },
];

export const SAVING_THROWS: SkillDef[] = SKILLS_LIST.filter((s) => s.isSavingThrow);

export const CRAFT_CATEGORIES = [
  "Alfaiate",
  "Alquimia",
  "Canalizador",
  "Cozinheiro",
  "Entalhador",
  "Farmacêutico",
  "Ferreiro",
] as const;

export type CraftCategory = (typeof CRAFT_CATEGORIES)[number];

// Tabela de Compra por Pontos v2.5 (10 em todos, 17 pontos disponíveis)
export const POINT_BUY_TABLE: Record<number, number> = {
  8: 2,   // Ganha +2 pts
  9: 1,   // Ganha +1 pt
  10: 0,  // Base
  11: -2, // Custo 2 pts
  12: -3, // Custo 3 pts
  13: -4, // Custo 4 pts
  14: -5, // Custo 5 pts
  15: -7, // Custo 7 pts
};

export const SPECIALIZATIONS = [
  "Lutador",
  "Especialista em Combate",
  "Especialista em Técnica",
  "Controlador",
  "Suporte",
  "Restringido",
] as const;

export type Specialization = (typeof SPECIALIZATIONS)[number];

export interface SpecInfo {
  hpBase: number;
  hpPerLevel: number;
  hitDie: string;
  pePerLevel: number;
  addsAttributeToPE: boolean;
  keyAttributes: AttributeKey[];
}

export const SPEC_TABLE: Record<Specialization, SpecInfo> = {
  Lutador: {
    hpBase: 12,
    hpPerLevel: 7,
    hitDie: "d10",
    pePerLevel: 4,
    addsAttributeToPE: false,
    keyAttributes: ["FOR", "DEX"],
  },
  "Especialista em Combate": {
    hpBase: 12,
    hpPerLevel: 7,
    hitDie: "d10",
    pePerLevel: 4,
    addsAttributeToPE: false,
    keyAttributes: ["FOR", "DEX", "SAB"],
  },
  "Especialista em Técnica": {
    hpBase: 10,
    hpPerLevel: 6,
    hitDie: "d8",
    pePerLevel: 6,
    addsAttributeToPE: true,
    keyAttributes: ["INT", "SAB"],
  },
  Controlador: {
    hpBase: 10,
    hpPerLevel: 6,
    hitDie: "d8",
    pePerLevel: 5,
    addsAttributeToPE: true,
    keyAttributes: ["PRE", "SAB"],
  },
  Suporte: {
    hpBase: 10,
    hpPerLevel: 6,
    hitDie: "d8",
    pePerLevel: 5,
    addsAttributeToPE: true,
    keyAttributes: ["PRE", "SAB"],
  },
  Restringido: {
    hpBase: 16,
    hpPerLevel: 9,
    hitDie: "d12",
    pePerLevel: 0,
    addsAttributeToPE: false,
    keyAttributes: ["FOR", "DEX", "CON", "INT", "SAB", "PRE"],
  },
};

export const ORIGINS = [
  "Inato",
  "Herdado",
  "Derivado",
  "Restringido",
  "Feto Amaldiçoado Híbrido",
  "Sem Técnica",
  "Corpo Amaldiçoado Mutante",
  "Feiticeiro Reencarnado",
  "Maldição",
  "Fantoche Definitivo",
] as const;

export type Origin = (typeof ORIGINS)[number];

export const XP_TABLE: { level: number; xp: number; proficiency: number }[] = [
  { level: 1, xp: 0, proficiency: 2 },
  { level: 2, xp: 1000, proficiency: 2 },
  { level: 3, xp: 3000, proficiency: 2 },
  { level: 4, xp: 6000, proficiency: 2 },
  { level: 5, xp: 10000, proficiency: 3 },
  { level: 6, xp: 15000, proficiency: 3 },
  { level: 7, xp: 21000, proficiency: 3 },
  { level: 8, xp: 28000, proficiency: 3 },
  { level: 9, xp: 36000, proficiency: 4 },
  { level: 10, xp: 45000, proficiency: 4 },
  { level: 11, xp: 55000, proficiency: 4 },
  { level: 12, xp: 66000, proficiency: 4 },
  { level: 13, xp: 78000, proficiency: 5 },
  { level: 14, xp: 91000, proficiency: 5 },
  { level: 15, xp: 105000, proficiency: 5 },
  { level: 16, xp: 120000, proficiency: 5 },
  { level: 17, xp: 136000, proficiency: 6 },
  { level: 18, xp: 153000, proficiency: 6 },
  { level: 19, xp: 171000, proficiency: 6 },
  { level: 20, xp: 190000, proficiency: 6 },
];

export const TRAININGS_LIST = [
  {
    id: "agilidade",
    name: "Treino de Agilidade",
    benefit: "Margem de crítico em TR de Reflexos reduz em 2. Máx. Destreza +5 e Movimento +3m.",
  },
  {
    id: "barreiras",
    name: "Treino de Barreiras",
    benefit: "Paredes de Barreira recebem RD igual ao Nível de Aptidão em Barreiras.",
  },
  {
    id: "compreensao",
    name: "Treino de Compreensão",
    benefit: "Aumenta um nível de aptidão amaldiçoada a sua escolha em 1.",
  },
  {
    id: "controle_energia",
    name: "Controle de Energia",
    benefit: "Em combate, início da rodada: recupera PE igual a metade da Maestria.",
  },
  {
    id: "dominios",
    name: "Treino de Domínios",
    benefit: "Recebe a aptidão Modificação Completa para moldar expansões perfeitamente.",
  },
  {
    id: "energia_reversa",
    name: "Energia Reversa",
    benefit: "Pode curar exaustão de técnica pós-expansão (1 turno a cada 2 PE reversos).",
  },
  {
    id: "luta",
    name: "Treino de Luta",
    benefit: "Acesso a crítico em ataques desarmados (pugilato) e 1x/rodada vantagem em golpes corporais.",
  },
  {
    id: "manejo_arma",
    name: "Manejo de Arma",
    benefit: "Arma escolhida recebe 1 propriedade de ferramenta amaldiçoada adicional.",
  },
  {
    id: "pericia",
    name: "Treino de Perícia",
    benefit: "Se tirar menos de 5 no d20 na perícia escolhida, rola de novo e mantém o maior.",
  },
  {
    id: "potencial_fisico",
    name: "Potencial Físico",
    benefit: "Em combate, início da rodada: recupera vigor igual a metade da Maestria.",
  },
  {
    id: "resistencia",
    name: "Treino de Resistência",
    benefit: "Margem de crítico em Fortitude -2. Ignora 1ª falha em morte por cena. PV máx +10.",
  },
];
