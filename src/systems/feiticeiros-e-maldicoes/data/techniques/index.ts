/**
 * Índice Geral do Catálogo de Técnicas Inatas Prontas
 * F&M v2.0 / Enciclopédia Amaldiçoada
 */

import { InnateTechnique } from "./types";
import { CLANS1_TECHNIQUES } from "./clans1";
import { CLANS2_TECHNIQUES } from "./clans2";
import { CLANS3_TECHNIQUES } from "./clans3";
import { DISASTERS1_TECHNIQUES } from "./disasters1";
import { DISASTERS2_TECHNIQUES } from "./disasters2";
import { DISASTERS3_TECHNIQUES } from "./disasters3";
import { SORCERERS1A_TECHNIQUES } from "./sorcerers1a";
import { SORCERERS1B_TECHNIQUES } from "./sorcerers1b";
import { SORCERERS1C_TECHNIQUES } from "./sorcerers1c";
import { SORCERERS2A_TECHNIQUES } from "./sorcerers2a";
import { SORCERERS2B_TECHNIQUES } from "./sorcerers2b";
import { SORCERERS3A_TECHNIQUES } from "./sorcerers3a";
import { SORCERERS3B_TECHNIQUES } from "./sorcerers3b";
import { SORCERERS4A_TECHNIQUES } from "./sorcerers4a";
import { SORCERERS4B_TECHNIQUES } from "./sorcerers4b";

export * from "./types";

export const CLAN_TECHNIQUES: InnateTechnique[] = [
  ...CLANS1_TECHNIQUES,
  ...CLANS2_TECHNIQUES,
  ...CLANS3_TECHNIQUES,
];

export const DISASTER_TECHNIQUES: InnateTechnique[] = [
  ...DISASTERS1_TECHNIQUES,
  ...DISASTERS2_TECHNIQUES,
  ...DISASTERS3_TECHNIQUES,
];

export const SORCERERS_TECHNIQUES: InnateTechnique[] = [
  ...SORCERERS1A_TECHNIQUES,
  ...SORCERERS1B_TECHNIQUES,
  ...SORCERERS1C_TECHNIQUES,
  ...SORCERERS2A_TECHNIQUES,
  ...SORCERERS2B_TECHNIQUES,
  ...SORCERERS3A_TECHNIQUES,
  ...SORCERERS3B_TECHNIQUES,
  ...SORCERERS4A_TECHNIQUES,
  ...SORCERERS4B_TECHNIQUES,
];

/**
 * Catálogo completo com as 26 Técnicas Amaldiçoadas Oficiais da Obra (F&M 2.5 / Enciclopédia)
 */
export const READY_TECHNIQUES: InnateTechnique[] = [
  ...CLAN_TECHNIQUES,
  ...DISASTER_TECHNIQUES,
  ...SORCERERS_TECHNIQUES,
];

/**
 * Busca uma técnica pronta pelo seu identificador único (slug)
 */
export function getTechniqueById(id: string): InnateTechnique | undefined {
  return READY_TECHNIQUES.find((t) => t.id === id);
}

/**
 * Busca uma técnica pronta pelo nome exato ou aproximado
 */
export function getTechniqueByName(name: string): InnateTechnique | undefined {
  const norm = name.toLowerCase().trim();
  return READY_TECHNIQUES.find(
    (t) => t.name.toLowerCase() === norm || t.id.toLowerCase() === norm
  );
}

/**
 * Filtra técnicas pela categoria (ex: "Clã Tradicional", "Maldição do Desastre")
 */
export function getTechniquesByCategory(category: string): InnateTechnique[] {
  return READY_TECHNIQUES.filter((t) => t.category === category);
}

/**
 * Filtra técnicas pelo atributo-chave sugerido (FOR, DEX, CON, INT, SAB, CAR)
 */
export function getTechniquesByAttribute(attr: string): InnateTechnique[] {
  return READY_TECHNIQUES.filter((t) => t.suggestedAttribute === attr);
}

/**
 * Categorias disponíveis no catálogo
 */
export const TECHNIQUE_CATEGORIES = [
  "Clã Tradicional",
  "Maldição do Desastre",
  "Feiticeiro Notável",
  "Grau Especial",
  "Feiticeiro Reencarnado",
  "Feiticeiro Desperto",
  "Feto Amaldiçoado",
] as const;
