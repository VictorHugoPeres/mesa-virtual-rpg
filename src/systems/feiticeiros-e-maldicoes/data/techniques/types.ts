/**
 * Tipagens para o Catálogo de Técnicas e Feitiços Prontos
 * F&M v2.0 / Enciclopédia Amaldiçoada
 */

export interface ReadySpell {
  name: string;
  level: number;
  cost: string;
  action: string;
  range: string;
  target: string;
  duration: string;
  description: string;
  rollFormula?: string;
}

export interface InnateTechnique {
  id: string;
  name: string;
  characterRef: string;
  category: "Clã Tradicional" | "Maldição do Desastre" | "Feiticeiro Notável" | "Grau Especial" | "Feiticeiro Reencarnado" | "Feiticeiro Desperto" | "Feto Amaldiçoado";
  suggestedAttribute: "FOR" | "DES" | "CON" | "INT" | "SAB" | "CAR";
  source: string;
  description: string;
  basicFunction: string;
  spells: ReadySpell[];
}
