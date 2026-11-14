import { XP_TABLE } from "./types";
import type { AttributeKey, FMCharacterData } from "./types";

// ────────────────────────────────────────────
// Funções puras de cálculo — F&M v2.0
// ────────────────────────────────────────────

/**
 * Calcula o modificador de um atributo.
 * Fórmula: floor((valor - 10) / 2)
 */
export function getModifier(value: number): number {
  return Math.floor((value - 10) / 2);
}

/**
 * Retorna o bônus de treinamento / maestria dado o nível do personagem.
 */
export function getProficiencyBonus(level: number): number {
  const entry = XP_TABLE.find((e) => e.level === level);
  return entry?.proficiency ?? 2;
}

/**
 * Calcula o bônus total de uma perícia.
 *   = Modificador do Atributo
 *   + (se treinado: Maestria)
 *   + (se especialista: Maestria novamente)
 *   + Outros Bônus
 */
export function getSkillBonus(
  attributeValue: number,
  level: number,
  trained: boolean,
  expert: boolean,
  otherBonus: number = 0
): number {
  const mod = getModifier(attributeValue);
  const prof = getProficiencyBonus(level);
  let total = mod + otherBonus;
  if (trained) total += prof;
  if (expert) total += prof;
  return total;
}

/**
 * Calcula a Defesa total.
 *   = 10 + Mod DEX + Uniforme + Escudo + Outros
 */
export function calcDefense(data: FMCharacterData): number {
  const dexMod = getModifier(data.attributes["DEX"] ?? 10);
  return (
    10 +
    dexMod +
    (data.defense?.uniform ?? 0) +
    (data.defense?.shield ?? 0) +
    (data.defense?.other ?? 0)
  );
}

/**
 * Calcula a Atenção (percepção passiva).
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
    percSkill?.otherBonus ?? 0
  );
  return 10 + bonus;
}

/**
 * Calcula a Iniciativa.
 *   = Mod DEX + Outros Bônus
 */
export function calcInitiative(data: FMCharacterData): number {
  return getModifier(data.attributes["DEX"] ?? 10);
}

/**
 * Calcula a CD (Classe de Dificuldade) de técnicas / habilidades de especialização.
 *   = 8 + Maestria + Mod do Atributo Chave + Outros
 */
export function calcSpellDC(
  level: number,
  keyAttributeValue: number
): number {
  return 8 + getProficiencyBonus(level) + getModifier(keyAttributeValue);
}

/**
 * Retorna o Grau típico para um dado nível.
 */
export function getGradeForLevel(level: number): string {
  if (level <= 4) return "4° Grau";
  if (level <= 7) return "3° Grau";
  if (level <= 13) return "2° Grau";
  if (level <= 18) return "1° Grau";
  return "Grau Especial";
}
