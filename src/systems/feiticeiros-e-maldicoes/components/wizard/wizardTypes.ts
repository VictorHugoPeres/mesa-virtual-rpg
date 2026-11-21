import { AttributeKey, Specialization, Origin } from "@/systems/feiticeiros-e-maldicoes";

export type AttributeMethod = "fixed" | "pointBuy" | "roll";

export interface WizardSpell {
  name: string;
  level: number;
  cost: number;
  action: string;
  range: string;
  description: string;
}

export interface WizardState {
  name: string;
  type: "PC" | "NPC";
  concept: string;
  origin: Origin;
  specialization: Specialization;
  attributeMethod: AttributeMethod;
  baseAttributes: Record<AttributeKey, number>;
  bonusPlus2: AttributeKey;
  bonusPlus1: AttributeKey;
  trainedSkills: string[];
  techniqueName: string;
  techniqueDesc: string;
  techniqueAttribute: AttributeKey;
  spells: WizardSpell[];
  selectedWeapons: string[];
  selectedToolKit: string;
}

export interface OriginInfo {
  id: Origin;
  name: string;
  tagline: string;
  description: string;
  attributeBonusDesc: string;
  features: { title: string; desc: string }[];
  recommended: string;
}

export interface SpecDetailInfo {
  id: Specialization;
  name: string;
  tagline: string;
  description: string;
  hpBase: number;
  hitDie: string;
  peDesc: string;
  savingThrows: string;
  skillsDesc: string;
  keyAttributes: AttributeKey[];
  features: { title: string; desc: string }[];
}

export interface TechniquePreset {
  id: string;
  name: string;
  description: string;
  attribute: AttributeKey;
  spells: WizardSpell[];
}

export interface EquipmentOption {
  id: string;
  name: string;
  category: "arma" | "kit";
  damage?: string;
  type?: string;
  properties?: string;
  description: string;
}
