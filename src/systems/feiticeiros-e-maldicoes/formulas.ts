import { XP_TABLE, SPEC_TABLE } from "./constants";
import type { AttributeKey, Specialization, Origin } from "./constants";
import type { FMCharacterData } from "./schemas";

// ────────────────────────────────────────────
// Funções puras de cálculo — F&M v2.5 Oficial
// ────────────────────────────────────────────

/**
 * Calcula o modificador de um atributo.
 * Fórmula: floor((valor - 10) / 2)
 */
export function getModifier(value: number): number {
  return Math.floor((value - 10) / 2);
}

/**
 * Retorna o Bônus de Treinamento (BT) dado o nível do personagem.
 */
export function getProficiencyBonus(level: number): number {
  const entry = XP_TABLE.find((e) => e.level === level);
  return entry?.proficiency ?? 2;
}

export interface SkillBonusOptions {
  attributeKey?: AttributeKey;
  origin?: Origin | string;
  isRestrictedLvl10?: boolean;
}

/**
 * Calcula o bônus total de uma perícia ou Teste de Resistência (TR) v2.5:
 *   = Mod. Atributo
 *   + floor(nível / 2)
 *   + (se Mestre: BT + floor(BT / 2) [ou 2 * BT para Restringido Nv 10+ em FOR/DES/CON])
 *   + (se Treinado: BT)
 *   + Outros Bônus
 */
export function getSkillBonus(
  attributeValue: number,
  level: number,
  trained: boolean,
  expert: boolean,
  otherBonus: number = 0,
  options?: SkillBonusOptions
): number {
  const mod = getModifier(attributeValue);
  const halfLevel = Math.floor(level / 2);
  const bt = getProficiencyBonus(level);

  let trainBonus = 0;
  if (expert) {
    const isPhysical = options?.attributeKey && ["FOR", "DEX", "CON"].includes(options.attributeKey);
    const isRestricted10 = options?.isRestrictedLvl10 || (options?.origin === "Restringido" && level >= 10);
    if (isRestricted10 && isPhysical) {
      trainBonus = 2 * bt;
    } else {
      trainBonus = bt + Math.floor(bt / 2);
    }
  } else if (trained) {
    trainBonus = bt;
  }

  return mod + halfLevel + trainBonus + otherBonus;
}

/**
 * Calcula a Defesa total v2.5:
 *   = 10 + Mod DES + floor(nível / 2) + Uniforme + Escudo + Outros
 */
export function calcDefense(data: FMCharacterData): number {
  const dexMod = getModifier(data.attributes["DEX"] ?? 10);
  const halfLevel = Math.floor(data.level / 2);
  return (
    10 +
    dexMod +
    halfLevel +
    (data.defense?.uniform ?? 0) +
    (data.defense?.shield ?? 0) +
    (data.defense?.other ?? 0)
  );
}

/**
 * Calcula a Atenção (percepção passiva) v2.5:
 *   = 10 + bônus total em Percepção
 */
export function calcAttention(data: FMCharacterData): number {
  const sabValue = data.attributes["SAB"] ?? 10;
  const percSkill = data.skills["Percepção"];
  const bonus = getSkillBonus(
    sabValue,
    data.level,
    percSkill?.trained ?? false,
    percSkill?.expert ?? false,
    percSkill?.otherBonus ?? 0,
    { attributeKey: "SAB", origin: data.origin }
  );
  return 10 + bonus;
}

/**
 * Calcula a Iniciativa:
 *   = Mod DES + Outros Bônus
 */
export function calcInitiative(data: FMCharacterData): number {
  return getModifier(data.attributes["DEX"] ?? 10);
}

/**
 * Calcula a CD (Classe de Dificuldade) de feitiços e especializações v2.5:
 *   = 10 + floor(nível / 2) + Mod. Atributo Chave + BT + Outros
 */
export function calcSpellDC(
  level: number,
  keyAttributeValue: number,
  otherBonus: number = 0
): number {
  const mod = getModifier(keyAttributeValue);
  const halfLevel = Math.floor(level / 2);
  const bt = getProficiencyBonus(level);
  return 10 + halfLevel + mod + bt + otherBonus;
}

/**
 * Calcula a Jogada de Ataque v2.5:
 *   = Mod. Atributo + floor(nível / 2) + (se proficiente: BT) + Outros
 */
export function calcAttackBonus(
  attributeValue: number,
  level: number,
  proficient: boolean,
  otherBonus: number = 0
): number {
  const mod = getModifier(attributeValue);
  const halfLevel = Math.floor(level / 2);
  const bt = proficient ? getProficiencyBonus(level) : 0;
  return mod + halfLevel + bt + otherBonus;
}

/**
 * Retorna o Grau Jujutsu típico para um dado nível.
 */
export function getGradeForLevel(level: number): string {
  if (level <= 4) return "4° Grau";
  if (level <= 7) return "3° Grau";
  if (level <= 13) return "2° Grau";
  if (level <= 18) return "1° Grau";
  return "Grau Especial";
}

/**
 * Calcula o PV Máximo sugerido pelas regras oficiais v2.5:
 * Nível 1: hpBase + CON mod
 * Níveis subsequentes: (nível - 1) * (hpPerLevel + CON mod)
 * Clã Kamo: +1 PV/nível após o 1º nível.
 */
export function calcSuggestedHP(
  specialization: Specialization,
  level: number,
  conMod: number,
  clan?: string
): number {
  const spec = SPEC_TABLE[specialization] || SPEC_TABLE["Lutador"];
  const lvl1 = spec.hpBase + conMod;
  let total = lvl1;
  if (level > 1) {
    total += (level - 1) * (spec.hpPerLevel + conMod);
    if (clan === "Kamo") {
      total += level - 1;
    }
  }
  return Math.max(1, total);
}

export interface PESuggestionOptions {
  origin?: Origin | string;
  clan?: string;
}

/**
 * Calcula o PE Máximo / Estamina sugerido pelas regras oficiais v2.5:
 * - Técnica: (level * 6) + Mod
 * - Controlador/Suporte: (level * 5) + Mod
 * - Lutador/Combate: level * 4
 * - Restringido: level * 4 (Estamina)
 * - Maldição: +1 PE/nível
 * - Clã Gojo: +1 PE em níveis pares (floor(level / 2))
 */
export function calcSuggestedPE(
  specialization: Specialization,
  level: number,
  keyAttrMod: number,
  options?: PESuggestionOptions
): number {
  const spec = SPEC_TABLE[specialization] || SPEC_TABLE["Lutador"];
  let total = level * spec.pePerLevel;
  if (spec.addsAttributeToPE) {
    total += keyAttrMod;
  }
  if (options?.origin === "Maldição") {
    total += level;
  }
  if (options?.clan === "Gojo") {
    total += Math.floor(level / 2);
  }
  return Math.max(0, total);
}

export type SoulStateType = "Estável" | "Danificado" | "Instável" | "Crítico" | "Morto";

export interface SoulStateResult {
  state: SoulStateType;
  percentage: number;
  rollPenalty: number;
  extraEnergyCost: number;
  hasDisadvantage: boolean;
  conditions: string[];
  description: string;
}

/**
 * Helper dos Estados da Alma v2.5 conforme a Integridade:
 * - Estável (> 75%): sem penalidades
 * - Danificado (< 75%): -3 em testes e rolagens, +2 PE/estamina no custo de habilidades
 * - Instável (< 50%): -6 em testes e rolagens, +3 PE/estamina, condição Exposto
 * - Crítico (< 25%): -8 e desvantagem em testes, +5 PE/estamina, condições Exposto e Fragilizado
 * - Morto (0%): alma destruída, morte imediata
 */
export function getSoulState(currentIntegrity: number, maxIntegrity: number): SoulStateResult {
  if (maxIntegrity <= 0) {
    return {
      state: "Morto",
      percentage: 0,
      rollPenalty: -8,
      extraEnergyCost: 5,
      hasDisadvantage: true,
      conditions: ["Exposto", "Fragilizado", "Derrotado"],
      description: "Alma destruída.",
    };
  }

  const pct = (currentIntegrity / maxIntegrity) * 100;

  if (currentIntegrity <= 0) {
    return {
      state: "Morto",
      percentage: 0,
      rollPenalty: -8,
      extraEnergyCost: 5,
      hasDisadvantage: true,
      conditions: ["Exposto", "Fragilizado", "Derrotado"],
      description: "Alma distorcida por completo; morte imediata.",
    };
  }

  if (pct < 25) {
    return {
      state: "Crítico",
      percentage: Math.round(pct),
      rollPenalty: -8,
      extraEnergyCost: 5,
      hasDisadvantage: true,
      conditions: ["Exposto", "Fragilizado"],
      description: "-8 e desvantagem em testes; +5 PE no custo de habilidades; Exposto e Fragilizado.",
    };
  }

  if (pct < 50) {
    return {
      state: "Instável",
      percentage: Math.round(pct),
      rollPenalty: -6,
      extraEnergyCost: 3,
      hasDisadvantage: false,
      conditions: ["Exposto"],
      description: "-6 em todos os testes e rolagens; +3 PE no custo de habilidades; Exposto.",
    };
  }

  if (pct < 75) {
    return {
      state: "Danificado",
      percentage: Math.round(pct),
      rollPenalty: -3,
      extraEnergyCost: 2,
      hasDisadvantage: false,
      conditions: [],
      description: "-3 em todos os testes e rolagens; +2 PE no custo de habilidades.",
    };
  }

  return {
    state: "Estável",
    percentage: Math.round(pct),
    rollPenalty: 0,
    extraEnergyCost: 0,
    hasDisadvantage: false,
    conditions: [],
    description: "Alma em harmonia e estável.",
  };
}
