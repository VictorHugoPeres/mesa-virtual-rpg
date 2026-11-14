import { z } from "zod";

// ────────────────────────────────────────────
// Constantes do sistema F&M v2.0
// ────────────────────────────────────────────

export const ATTRIBUTE_KEYS = [
  "FOR",
  "DEX",
  "CON",
  "INT",
  "SAB",
  "CAR",
] as const;
export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  FOR: "Força",
  DEX: "Destreza",
  CON: "Constituição",
  INT: "Inteligência",
  SAB: "Sabedoria",
  CAR: "Carisma",
};

// ────────────────────────────────────────────
// Perícias (ficha Setsugiri v2.0)
// ────────────────────────────────────────────

export interface SkillDef {
  name: string;
  attribute: AttributeKey;
  requiresTraining: boolean;
}

export const SKILLS_LIST: SkillDef[] = [
  // FOR
  { name: "Atletismo", attribute: "FOR", requiresTraining: false },
  { name: "Luta", attribute: "FOR", requiresTraining: false },
  // DEX
  { name: "Acrobacia", attribute: "DEX", requiresTraining: false },
  { name: "Furtividade", attribute: "DEX", requiresTraining: false },
  { name: "Pontaria", attribute: "DEX", requiresTraining: false },
  { name: "Prestidigitação", attribute: "DEX", requiresTraining: true },
  { name: "Reflexos", attribute: "DEX", requiresTraining: false },
  // CON
  { name: "Fortitude", attribute: "CON", requiresTraining: false },
  { name: "Integridade", attribute: "CON", requiresTraining: false },
  // INT
  { name: "Astúcia", attribute: "INT", requiresTraining: false },
  { name: "Feitiçaria", attribute: "INT", requiresTraining: true },
  { name: "Investigação", attribute: "INT", requiresTraining: false },
  { name: "História", attribute: "INT", requiresTraining: false },
  { name: "Ofício 1", attribute: "INT", requiresTraining: true },
  { name: "Ofício 2", attribute: "INT", requiresTraining: true },
  { name: "Ofício 3", attribute: "INT", requiresTraining: true },
  { name: "Ofício 4", attribute: "INT", requiresTraining: true },
  { name: "Religião", attribute: "INT", requiresTraining: false },
  { name: "Tecnologia", attribute: "INT", requiresTraining: false },
  // SAB
  { name: "Intuição", attribute: "SAB", requiresTraining: false },
  { name: "Medicina", attribute: "SAB", requiresTraining: true },
  { name: "Percepção", attribute: "SAB", requiresTraining: false },
  { name: "Ocultismo", attribute: "SAB", requiresTraining: false },
  { name: "Vontade", attribute: "SAB", requiresTraining: false },
  // CAR
  { name: "Persuasão", attribute: "CAR", requiresTraining: false },
  { name: "Enganação", attribute: "CAR", requiresTraining: false },
  { name: "Intimidação", attribute: "CAR", requiresTraining: false },
  { name: "Performance", attribute: "CAR", requiresTraining: false },
];

// ────────────────────────────────────────────
// Especializações
// ────────────────────────────────────────────

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
    keyAttributes: ["CAR", "SAB"],
  },
  Suporte: {
    hpBase: 10,
    hpPerLevel: 6,
    hitDie: "d8",
    pePerLevel: 5,
    addsAttributeToPE: true,
    keyAttributes: ["CAR", "SAB"],
  },
  Restringido: {
    hpBase: 16,
    hpPerLevel: 9,
    hitDie: "d12",
    pePerLevel: 0,
    addsAttributeToPE: false,
    keyAttributes: ["FOR", "DEX", "CON", "INT", "SAB", "CAR"],
  },
};

// ────────────────────────────────────────────
// Origens
// ────────────────────────────────────────────

export const ORIGINS = [
  "Inato",
  "Herdado",
  "Derivado",
  "Restringido",
  "Feto Amaldiçoado Híbrido",
  "Sem Técnica",
  "Corpo Amaldiçoado Mutante",
] as const;
export type Origin = (typeof ORIGINS)[number];

// ────────────────────────────────────────────
// Tabela de XP e Maestria (Bônus de Treinamento)
// ────────────────────────────────────────────

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

// ────────────────────────────────────────────
// Zod Schema — dados JSON da ficha de personagem
// Serializado como String no SQLite, parseado e
// validado em runtime com z.parse()
// ────────────────────────────────────────────

const SkillDataSchema = z.object({
  trained: z.boolean().default(false),
  expert: z.boolean().default(false),
  otherBonus: z.number().default(0),
});

const ResourceBarSchema = z.object({
  current: z.number(),
  max: z.number(),
  temp: z.number().default(0),
});

const WeaponSchema = z.object({
  name: z.string(),
  attackBonus: z.number().default(0),
  damage: z.string(), // Ex: "1d10+4"
  critical: z.string().default("20"),
  damageType: z.string().default(""),
  range: z.string().default(""),
});

const DeathSavesSchema = z.object({
  successes: z.number().min(0).max(3).default(0),
  failures: z.number().min(0).max(3).default(0),
});

export const FMCharacterDataSchema = z.object({
  // Cabeçalho
  level: z.number().min(1).max(20).default(1),
  xp: z.number().default(0),
  origin: z.string().default(""),
  specialization: z.string().default(""),
  technique: z.string().default(""),
  grade: z.string().default("4° Grau"),
  player: z.string().default(""),
  campaign: z.string().default(""),

  // Atributos { FOR: 10, DEX: 12, ... }
  attributes: z
    .record(z.enum(ATTRIBUTE_KEYS as unknown as [string, ...string[]]), z.number().min(0).max(30))
    .default({}),

  // Atributo Chave da Especialização (para CD)
  keyAttribute: z.string().default(""),

  // Recursos
  hp: ResourceBarSchema.default({ current: 10, max: 10, temp: 0 }),
  energy: ResourceBarSchema.default({ current: 4, max: 4, temp: 0 }),
  integrity: ResourceBarSchema.default({ current: 10, max: 10, temp: 0 }),

  // Defesa
  defense: z
    .object({
      natural: z.number().default(10),
      uniform: z.number().default(0),
      shield: z.number().default(0),
      dexMod: z.number().default(0),
      other: z.number().default(0),
      total: z.number().default(10),
    })
    .default({
      natural: 10,
      uniform: 0,
      shield: 0,
      dexMod: 0,
      other: 0,
      total: 10,
    }),

  // Derivados
  attention: z.number().default(10),
  initiative: z.number().default(0),
  movement: z.number().default(9),

  // Testes de Morte
  deathSaves: DeathSavesSchema.default({
    successes: 0,
    failures: 0,
  }),

  // Dados de Vida
  hitDice: z
    .object({
      die: z.string().default("d10"),
      total: z.number().default(1),
      spent: z.number().default(0),
    })
    .default({
      die: "d10",
      total: 1,
      spent: 0,
    }),

  // Perícias { "Atletismo": { trained: true, expert: false, otherBonus: 0 }, ... }
  skills: z.record(z.string(), SkillDataSchema).default({}),

  // Armas
  weapons: z.array(WeaponSchema).default([]),

  // Notas / texto livre
  notes: z.string().default(""),
});

export type FMCharacterData = z.infer<typeof FMCharacterDataSchema>;

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

/** Serializa dados da ficha para armazenar no campo `data` (String) do SQLite */
export function serializeCharacterData(data: FMCharacterData): string {
  return JSON.stringify(data);
}

/** Desserializa e valida o campo `data` (String) do SQLite → FMCharacterData */
export function parseCharacterData(raw: string): FMCharacterData {
  const json = JSON.parse(raw);
  return FMCharacterDataSchema.parse(json);
}
