import {
  SKILLS_LIST,
  TRAININGS_LIST,
  SPEC_TABLE,
  Specialization,
  Origin,
} from "./constants";
import type { FMCharacterData } from "./schemas";

export function createDefaultCharacter(
  name: string,
  type: "PC" | "NPC" = "PC",
  specialization: Specialization = "Lutador",
  origin: Origin = "Inato"
): FMCharacterData {
  const spec = SPEC_TABLE[specialization] || SPEC_TABLE["Lutador"];
  const hpBase = spec.hpBase;
  const peBase = spec.pePerLevel;

  const initialSkills: Record<string, { trained: boolean; expert: boolean; otherBonus: number }> = {};
  for (const s of SKILLS_LIST) {
    initialSkills[s.name] = { trained: false, expert: false, otherBonus: 0 };
  }

  const initialTrainings: Record<string, { stage1: boolean; stage2: boolean; stage3: boolean; stage4: boolean; completed: boolean }> = {};
  for (const t of TRAININGS_LIST) {
    initialTrainings[t.id] = { stage1: false, stage2: false, stage3: false, stage4: false, completed: false };
  }

  return {
    level: 1,
    xp: 0,
    origin,
    specialization,
    technique: "",
    grade: "4° Grau",
    player: type === "PC" ? "Jogador" : "Mestre (NPC)",
    campaign: "",
    attributes: {
      FOR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      SAB: 10,
      CAR: 10,
    },
    keyAttribute: spec.keyAttributes[0] || "FOR",
    hp: { current: hpBase, max: hpBase, temp: 0 },
    energy: { current: peBase, max: peBase, temp: 0 },
    integrity: { current: hpBase, max: hpBase, temp: 0 },
    defense: {
      natural: 10,
      uniform: 0,
      shield: 0,
      dexMod: 0,
      other: 0,
      total: 10,
    },
    attention: 10,
    initiative: 0,
    movement: 9,
    deathSaves: { successes: 0, failures: 0 },
    hitDice: { die: spec.hitDie, total: 1, spent: 0 },
    skills: initialSkills,
    weapons: [],
    features: [],
    cursedProfile: {
      techniqueName: "",
      techniqueDesc: "",
      techniqueAttribute: "INT",
      techniqueDC: 10,
      techniqueAttack: 2,
      techniqueSkill: "Feitiçaria",
      aptitudes: { aura: 0, control: 0, domain: 0, barrier: 0, rct: 0, special: 0 },
      spells: [],
      domainExpansion: { name: "", type: "Letal", description: "", cost: 10 },
    },
    personal: {
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
    },
    inventory: [],
    invocations: [],
    trainings: initialTrainings,
    notes: "",
  };
}
