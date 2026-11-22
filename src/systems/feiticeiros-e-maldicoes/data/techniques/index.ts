/**
 * Índice Geral do Catálogo de Técnicas Inatas Prontas
 * F&M v2.0 / Enciclopédia Amaldiçoada
 */

import { InnateTechnique } from "./types";
import { CLAN_TECHNIQUES } from "./clans";
import { DISASTER_TECHNIQUES } from "./disasters";
import { SORCERERS_TECHNIQUES_1 } from "./sorcerers1";
import { SORCERERS_TECHNIQUES_2 } from "./sorcerers2";
import { SORCERERS_TECHNIQUES_3 } from "./sorcerers3";
import { SORCERERS_TECHNIQUES_4 } from "./sorcerers4";

export * from "./types";
export { CLAN_TECHNIQUES } from "./clans";
export { DISASTER_TECHNIQUES } from "./disasters";
export { SORCERERS_TECHNIQUES_1 } from "./sorcerers1";
export { SORCERERS_TECHNIQUES_2 } from "./sorcerers2";
export { SORCERERS_TECHNIQUES_3 } from "./sorcerers3";
export { SORCERERS_TECHNIQUES_4 } from "./sorcerers4";

/**
 * Catálogo completo com as 26 Técnicas Amaldiçoadas Oficiais da Obra
 */
export const READY_TECHNIQUES: InnateTechnique[] = [
  ...CLAN_TECHNIQUES,
  ...DISASTER_TECHNIQUES,
  ...SORCERERS_TECHNIQUES_1,
  ...SORCERERS_TECHNIQUES_2,
  ...SORCERERS_TECHNIQUES_3,
  ...SORCERERS_TECHNIQUES_4,
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
 * Filtra técnicas pelo atributo-chave sugerido (FOR, DES, CON, INT, SAB, CAR)
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
