import {
  AttributeKey,
  SPEC_TABLE,
  createDefaultCharacter,
  FMCharacterData,
  getModifier,
  calcDefense,
  calcAttention,
  calcInitiative,
  calcSpellDC,
} from "@/systems/feiticeiros-e-maldicoes";
import { WizardState } from "./wizardTypes";
import { WIZARD_WEAPONS } from "./wizardPresets";

export function calculateFinalAttributes(state: WizardState): Record<AttributeKey, number> {
  const isRestringido = state.origin === "Restringido";
  const res: Record<AttributeKey, number> = { ...state.baseAttributes };
  if (isRestringido) {
    res.FOR = (res.FOR || 10) + 2;
    res[state.bonusPlus2] = (res[state.bonusPlus2] || 10) + 2;
  } else {
    res[state.bonusPlus2] = (res[state.bonusPlus2] || 10) + 2;
    res[state.bonusPlus1] = (res[state.bonusPlus1] || 10) + 1;
  }
  return res;
}

export function buildCharacterSheet(state: WizardState): FMCharacterData {
  const finalAttrs = calculateFinalAttributes(state);
  const conMod = getModifier(finalAttrs.CON);
  const dexMod = getModifier(finalAttrs.DEX);
  const techAttrVal = finalAttrs[state.techniqueAttribute] || 10;
  const techMod = getModifier(techAttrVal);
  const isRestringido = state.origin === "Restringido";
  const specInfo = SPEC_TABLE[state.specialization] || SPEC_TABLE["Lutador"];

  const hpMax = specInfo.hpBase + conMod;
  const peMax = isRestringido ? 0 : specInfo.pePerLevel + (specInfo.addsAttributeToPE ? Math.max(0, techMod) : 0);

  const sheet = createDefaultCharacter(state.name.trim(), state.type, state.specialization, state.origin);
  sheet.attributes = finalAttrs;
  sheet.keyAttribute = state.techniqueAttribute;
  sheet.hp = { current: hpMax, max: hpMax, temp: 0 };
  sheet.energy = { current: peMax, max: peMax, temp: 0 };
  sheet.integrity = { current: hpMax, max: hpMax, temp: 0 };
  sheet.movement = isRestringido ? 12 : 9;

  for (const skillName of state.trainedSkills) {
    if (sheet.skills[skillName]) {
      sheet.skills[skillName].trained = true;
    }
  }

  sheet.defense.dexMod = dexMod;
  sheet.defense.total = calcDefense(sheet);
  sheet.attention = calcAttention(sheet);
  sheet.initiative = calcInitiative(sheet);

  sheet.cursedProfile = {
    techniqueName: state.techniqueName,
    techniqueDesc: state.techniqueDesc,
    techniqueAttribute: state.techniqueAttribute,
    techniqueDC: calcSpellDC(1, techAttrVal),
    techniqueAttack: 2 + techMod,
    techniqueSkill: "Feitiçaria",
    aptitudes: { aura: 0, control: 0, domain: 0, barrier: 0, rct: 0, special: 0 },
    spells: state.spells.map((s, idx) => ({
      id: `spell-${idx + 1}`,
      name: s.name,
      level: s.level,
      peCost: s.cost,
      action: s.action,
      range: s.range,
      duration: "Instantânea",
      effect: s.description,
    })),
    domainExpansion: { name: "", type: "Letal", description: "", cost: 10 },
  };

  const chosenWeapons = state.selectedWeapons.map((wId) => {
    const item = WIZARD_WEAPONS.find((w) => w.id === wId);
    return {
      name: item?.name || wId,
      attackBonus: 2 + (item?.type === "Simples" ? dexMod : conMod),
      damage: item?.damage || "1d6",
      critical: "20 / x2",
      damageType: item?.type || "Marcial",
      range: item?.properties?.includes("Distância") ? "18m" : "Corpo a corpo",
    };
  });
  sheet.weapons = chosenWeapons;

  if (state.concept) {
    sheet.personal.ideals = state.concept;
  }

  return sheet;
}
