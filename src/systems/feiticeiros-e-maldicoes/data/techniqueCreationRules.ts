/**
 * Regras e tabelas oficiais para criação guiada de Técnicas e Feitiços
 * F&M v2.0 / v2.5 (Livro Base, Enciclopédia Amaldiçoada e Grimório 2.5)
 */

export type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type SpellType = "DANO" | "AUXILIAR" | "CURA" | "ESPECIAL" | "PASSIVA";
export type SpellActionType = "ACAO_COMUM" | "ACAO_BONUS" | "REACAO" | "ACAO_COMPLETA" | "PASSIVA";
export type SpellDurationType = "INSTANTANEA" | "IMEDIATA" | "DURADOURA" | "SUSTENTADA";
export type SpellTargetType = "UNICO" | "MULTIPLO" | "AREA" | "PESSOAL";

export interface SpellLevelRule {
  level: SpellLevel;
  costPE: number;
  minCharacterLevel: number;
  minTrainingBonus: number;
  maxDamageAttack: string;
  maxDamageSave: string;
  maxAreaDamage: string;
  maxRangeMeters: number;
  maxHealingSingle: string;
  maxHealingArea: string;
  maxBuffACImmediate: number;
  maxBuffACDuration: number;
  maxRollBonusImmediate: number;
}

export const SPELL_LEVEL_RULES: Record<SpellLevel, SpellLevelRule> = {
  0: {
    level: 0,
    costPE: 0,
    minCharacterLevel: 1,
    minTrainingBonus: 2,
    maxDamageAttack: "1d10",
    maxDamageSave: "1d10",
    maxAreaDamage: "0",
    maxRangeMeters: 9,
    maxHealingSingle: "0",
    maxHealingArea: "0",
    maxBuffACImmediate: 3,
    maxBuffACDuration: 2,
    maxRollBonusImmediate: 3,
  },
  1: {
    level: 1,
    costPE: 2,
    minCharacterLevel: 1,
    minTrainingBonus: 2,
    maxDamageAttack: "4d8",
    maxDamageSave: "3d8",
    maxAreaDamage: "2d8",
    maxRangeMeters: 12,
    maxHealingSingle: "3d6",
    maxHealingArea: "2d6",
    maxBuffACImmediate: 5,
    maxBuffACDuration: 4,
    maxRollBonusImmediate: 5,
  },
  2: {
    level: 2,
    costPE: 5,
    minCharacterLevel: 5,
    minTrainingBonus: 3,
    maxDamageAttack: "8d8",
    maxDamageSave: "7d8",
    maxAreaDamage: "4d8",
    maxRangeMeters: 18,
    maxHealingSingle: "6d6",
    maxHealingArea: "4d6",
    maxBuffACImmediate: 10,
    maxBuffACDuration: 8,
    maxRollBonusImmediate: 10,
  },
  3: {
    level: 3,
    costPE: 8,
    minCharacterLevel: 9,
    minTrainingBonus: 4,
    maxDamageAttack: "14d8",
    maxDamageSave: "12d8",
    maxAreaDamage: "5d12",
    maxRangeMeters: 24,
    maxHealingSingle: "5d12",
    maxHealingArea: "4d10",
    maxBuffACImmediate: 14,
    maxBuffACDuration: 11,
    maxRollBonusImmediate: 14,
  },
  4: {
    level: 4,
    costPE: 12,
    minCharacterLevel: 13,
    minTrainingBonus: 5,
    maxDamageAttack: "16d10",
    maxDamageSave: "14d10",
    maxAreaDamage: "10d10",
    maxRangeMeters: 30,
    maxHealingSingle: "8d12",
    maxHealingArea: "6d12",
    maxBuffACImmediate: 18,
    maxBuffACDuration: 14,
    maxRollBonusImmediate: 18,
  },
  5: {
    level: 5,
    costPE: 20,
    minCharacterLevel: 17,
    minTrainingBonus: 6,
    maxDamageAttack: "20d12",
    maxDamageSave: "18d12",
    maxAreaDamage: "12d12",
    maxRangeMeters: 48,
    maxHealingSingle: "16d10",
    maxHealingArea: "12d10",
    maxBuffACImmediate: 24,
    maxBuffACDuration: 18,
    maxRollBonusImmediate: 24,
  },
};

/**
 * Quantidade máxima de feitiços conhecidos que um personagem pode possuir por nível
 */
export function getMaxSpellsByCharacterLevel(characterLevel: number): number {
  if (characterLevel < 1) return 2;
  // 2 no Nv 1, +1 a cada nível par, +1 extra no 10 e 20
  const evenCount = Math.floor(characterLevel / 2);
  const bonus10 = characterLevel >= 10 ? 1 : 0;
  const bonus20 = characterLevel >= 20 ? 1 : 0;
  return 2 + evenCount + bonus10 + bonus20;
}

/**
 * Níveis de feitiço liberados para o personagem
 */
export function getUnlockedSpellLevels(characterLevel: number): SpellLevel[] {
  if (characterLevel >= 17) return [0, 1, 2, 3, 4, 5];
  if (characterLevel >= 13) return [0, 1, 2, 3, 4];
  if (characterLevel >= 9) return [0, 1, 2, 3];
  if (characterLevel >= 5) return [0, 1, 2];
  return [0, 1];
}

export type ConditionSeverity = "FRACA" | "MEDIA" | "FORTE" | "EXTREMA";

export interface ConditionRule {
  name: string;
  severity: ConditionSeverity;
  minSpellLevel: SpellLevel;
  damagePenaltyDice: number;
}

export const CONDITIONS_RULES: ConditionRule[] = [
  // Fracas (Permitidas N1+)
  { name: "Abalado", severity: "FRACA", minSpellLevel: 1, damagePenaltyDice: 1 },
  { name: "Caído", severity: "FRACA", minSpellLevel: 1, damagePenaltyDice: 1 },
  { name: "Desorientado", severity: "FRACA", minSpellLevel: 1, damagePenaltyDice: 1 },
  { name: "Desprevenido", severity: "FRACA", minSpellLevel: 1, damagePenaltyDice: 2 },
  { name: "Sangramento Leve", severity: "FRACA", minSpellLevel: 1, damagePenaltyDice: 1 },

  // Médias (Permitidas N2+)
  { name: "Agarrado", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 3 },
  { name: "Amedrontado", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 3 },
  { name: "Condenado", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 4 },
  { name: "Confuso", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 3 },
  { name: "Enfeitiçado", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 3 },
  { name: "Enjoado", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 3 },
  { name: "Enredado", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 3 },
  { name: "Envenenado", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 3 },
  { name: "Imóvel", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 3 },
  { name: "Lento", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 3 },
  { name: "Surdo", severity: "MEDIA", minSpellLevel: 2, damagePenaltyDice: 2 },

  // Fortes (Permitidas N3+)
  { name: "Cego", severity: "FORTE", minSpellLevel: 3, damagePenaltyDice: 5 },
  { name: "Exposto", severity: "FORTE", minSpellLevel: 3, damagePenaltyDice: 5 },
  { name: "Fragilizado", severity: "FORTE", minSpellLevel: 3, damagePenaltyDice: 5 },
  { name: "Incapacitado", severity: "FORTE", minSpellLevel: 3, damagePenaltyDice: 6 },

  // Extremas (Permitidas N4+)
  { name: "Atordoado", severity: "EXTREMA", minSpellLevel: 4, damagePenaltyDice: 8 },
  { name: "Inconsciente", severity: "EXTREMA", minSpellLevel: 4, damagePenaltyDice: 10 },
  { name: "Paralisado", severity: "EXTREMA", minSpellLevel: 4, damagePenaltyDice: 10 },
  { name: "Desmembramento", severity: "EXTREMA", minSpellLevel: 5, damagePenaltyDice: 12 },
];

/**
 * Melhorias de Versatilidade / Rituais (F&M 2.5)
 */
export const RITUAL_ENHANCEMENTS = [
  { id: "ajuste_alvos", name: "Ajuste de Alvos", desc: "Escolhe 2 + BT criaturas para passarem automaticamente no TR em área." },
  { id: "alcance", name: "Aumento de Alcance", desc: "Aumenta o alcance em +1,5m × BT." },
  { id: "dano", name: "Aumento de Dano", desc: "Causa dano adicional de +4 × BT." },
  { id: "precisao", name: "Aumento de Precisão", desc: "+2 em rolagens de ataque do feitiço." },
  { id: "conversao_sustento", name: "Conversão de Sustento", desc: "Deixa de ser Sustentado e passa a exigir Concentração." },
  { id: "expansao_area", name: "Expansão de Área", desc: "Expande a área em +1,5m × BT (ou +4,5m se for linha)." },
  { id: "potencializar_cd", name: "Potencialização de Dificuldade", desc: "+2 na CD de teste de resistência do feitiço." },
] as const;

/**
 * Validação de restrições de regras para construtor de feitiços
 */
export function validateSpellCreation(spell: {
  level: SpellLevel;
  type: SpellType;
  action: SpellActionType;
  targetType: SpellTargetType;
  conditions?: string[];
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (spell.level === 0 && spell.targetType === "AREA") {
    errors.push("Feitiços de Nível 0 não podem afetar alvos em área.");
  }

  if (spell.conditions && spell.conditions.length > 0) {
    for (const condName of spell.conditions) {
      const rule = CONDITIONS_RULES.find((c) => c.name.toLowerCase() === condName.toLowerCase());
      if (rule && spell.level < rule.minSpellLevel) {
        errors.push(`A condição '${rule.name}' exige feitiço de Nível ${rule.minSpellLevel} ou superior.`);
      }
    }
  }

  if (spell.action === "REACAO" && spell.targetType === "AREA" && spell.level <= 2) {
    errors.push("Reações não podem causar dano massivo em área nos primeiros níveis.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
