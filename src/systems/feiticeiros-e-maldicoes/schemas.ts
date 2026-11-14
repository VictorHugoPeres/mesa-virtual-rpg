import { z } from "zod";
import { ATTRIBUTE_KEYS } from "./constants";

// ────────────────────────────────────────────
// Sub-schemas da ficha F&M v2.0
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
  damage: z.string(),
  critical: z.string().default("20"),
  damageType: z.string().default(""),
  range: z.string().default(""),
});

const DeathSavesSchema = z.object({
  successes: z.number().min(0).max(3).default(0),
  failures: z.number().min(0).max(3).default(0),
});

const SpellSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().default(0),
  peCost: z.number().default(0),
  action: z.string().default("Ação Padrão"),
  range: z.string().default("9m"),
  duration: z.string().default("Instantânea"),
  effect: z.string().default(""),
});

const AptitudesSchema = z.object({
  aura: z.number().min(0).max(5).default(0),
  control: z.number().min(0).max(5).default(0),
  domain: z.number().min(0).max(5).default(0),
  barrier: z.number().min(0).max(5).default(0),
  rct: z.number().min(0).max(5).default(0),
  special: z.number().min(0).max(5).default(0),
});

const DomainExpansionSchema = z.object({
  name: z.string().default(""),
  type: z.string().default("Letal"),
  description: z.string().default(""),
  cost: z.number().default(10),
});

const CursedProfileSchema = z.object({
  techniqueName: z.string().default(""),
  techniqueDesc: z.string().default(""),
  techniqueAttribute: z.string().default("INT"),
  techniqueDC: z.number().default(10),
  techniqueAttack: z.number().default(2),
  techniqueSkill: z.string().default("Feitiçaria"),
  aptitudes: AptitudesSchema.default({
    aura: 0,
    control: 0,
    domain: 0,
    barrier: 0,
    rct: 0,
    special: 0,
  }),
  spells: z.array(SpellSchema).default([]),
  domainExpansion: DomainExpansionSchema.default({
    name: "",
    type: "Letal",
    description: "",
    cost: 10,
  }),
});

const PersonalAspectsSchema = z.object({
  age: z.string().default(""),
  gender: z.string().default(""),
  height: z.string().default(""),
  weight: z.string().default(""),
  eyes: z.string().default(""),
  hair: z.string().default(""),
  skin: z.string().default(""),
  clothing: z.string().default(""),
  aura: z.string().default(""),
  personality: z.string().default(""),
  ideals: z.string().default(""),
  bonds: z.string().default(""),
  flaws: z.string().default(""),
  innateDomain: z.string().default(""),
  backstory: z.string().default(""),
});

const InventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().default(1),
  slots: z.number().default(1),
  cost: z.string().default(""),
  description: z.string().default(""),
});

const InvocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  grade: z.string().default("4° Grau"),
  hpCurrent: z.number().default(10),
  hpMax: z.number().default(10),
  ca: z.number().default(10),
  movement: z.number().default(9),
  attributes: z
    .record(z.enum(ATTRIBUTE_KEYS as unknown as [string, ...string[]]), z.number().min(0).max(30))
    .default({
      FOR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      SAB: 10,
      CAR: 10,
    }),
  actionsAndTraits: z.string().default(""),
});

const TrainingProgressSchema = z.object({
  stage1: z.boolean().default(false),
  stage2: z.boolean().default(false),
  stage3: z.boolean().default(false),
  stage4: z.boolean().default(false),
  completed: z.boolean().default(false),
});

const FeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  current: z.number().default(0),
  max: z.number().default(0),
  cost: z.string().default(""),
  description: z.string().default(""),
});

export const FMCharacterDataSchema = z.object({
  level: z.number().min(1).max(20).default(1),
  xp: z.number().default(0),
  origin: z.string().default("Inato"),
  specialization: z.string().default("Lutador"),
  technique: z.string().default(""),
  grade: z.string().default("4° Grau"),
  player: z.string().default(""),
  campaign: z.string().default(""),

  attributes: z
    .record(z.enum(ATTRIBUTE_KEYS as unknown as [string, ...string[]]), z.number().min(0).max(30))
    .default({
      FOR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      SAB: 10,
      CAR: 10,
    }),

  keyAttribute: z.string().default("FOR"),

  hp: ResourceBarSchema.default({ current: 10, max: 10, temp: 0 }),
  energy: ResourceBarSchema.default({ current: 4, max: 4, temp: 0 }),
  integrity: ResourceBarSchema.default({ current: 10, max: 10, temp: 0 }),

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

  attention: z.number().default(10),
  initiative: z.number().default(0),
  movement: z.number().default(9),

  deathSaves: DeathSavesSchema.default({ successes: 0, failures: 0 }),

  hitDice: z
    .object({
      die: z.string().default("d10"),
      total: z.number().default(1),
      spent: z.number().default(0),
    })
    .default({ die: "d10", total: 1, spent: 0 }),

  skills: z.record(z.string(), SkillDataSchema).default({}),
  weapons: z.array(WeaponSchema).default([]),
  features: z.array(FeatureSchema).default([]),

  cursedProfile: CursedProfileSchema.default({
    techniqueName: "",
    techniqueDesc: "",
    techniqueAttribute: "INT",
    techniqueDC: 10,
    techniqueAttack: 2,
    techniqueSkill: "Feitiçaria",
    aptitudes: { aura: 0, control: 0, domain: 0, barrier: 0, rct: 0, special: 0 },
    spells: [],
    domainExpansion: { name: "", type: "Letal", description: "", cost: 10 },
  }),

  personal: PersonalAspectsSchema.default({
    age: "",
    gender: "",
    height: "",
    weight: "",
    eyes: "",
    hair: "",
    skin: "",
    clothing: "",
    aura: "",
    personality: "",
    ideals: "",
    bonds: "",
    flaws: "",
    innateDomain: "",
    backstory: "",
  }),

  inventory: z.array(InventoryItemSchema).default([]),
  invocations: z.array(InvocationSchema).default([]),
  trainings: z.record(z.string(), TrainingProgressSchema).default({}),
  notes: z.string().default(""),
});

export type FMCharacterData = z.infer<typeof FMCharacterDataSchema>;

export function serializeCharacterData(data: FMCharacterData): string {
  return JSON.stringify(data);
}

export function parseCharacterData(raw: string): FMCharacterData {
  const json = JSON.parse(raw);
  return FMCharacterDataSchema.parse(json);
}
