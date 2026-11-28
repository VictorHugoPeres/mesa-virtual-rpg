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
  clan?: string;
  anatomyTrait?: string;
  specialization: Specialization;
  keyAttribute?: AttributeKey;
  level1Choice?: string;
  attributeMethod: AttributeMethod;
  baseAttributes: Record<AttributeKey, number>;
  bonusPlus2: AttributeKey;
  bonusPlus1: AttributeKey;
  attributeBonuses?: Partial<Record<AttributeKey, number>>;
  chosenSavingThrow?: string;
  skillBonusAttribute?: "INT" | "SAB";
  trainedSkills: string[];
  expertSkills?: string[];
  craftSkills?: string[];
  techniqueName: string;
  techniqueDesc: string;
  techniqueAttribute: AttributeKey;
  spells: WizardSpell[];
  domainExpansion?: {
    name: string;
    type: string;
    cost: number;
    description: string;
  };
  level1FeatId?: string;
  level1FeatName?: string;
  level1FeatType?: "talento" | "aptidao";
  level1FeatDesc?: string;
  selectedWeapons: string[];
  selectedUniform?: string;
  selectedShield?: string;
  selectedToolKit: string;
  selectedGear?: string[];
}

export interface ClanInfo {
  id: string;
  name: string;
  trait: string;
  description: string;
  allowedBonusPlus2?: AttributeKey[];
}

export interface AnatomyInfo {
  id: string;
  name: string;
  effect: string;
}

export interface OriginInfo {
  id: Origin;
  name: string;
  tagline: string;
  description: string;
  attributeBonusDesc: string;
  isOptional?: boolean;
  source?: string;
  features: { title: string; desc: string }[];
  recommended: string;
  clans?: ClanInfo[];
  anatomyOptions?: AnatomyInfo[];
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
