import {
  AttributeKey,
  ATTRIBUTE_KEYS,
  SPEC_TABLE,
  createDefaultCharacter,
  FMCharacterData,
  getModifier,
  calcDefense,
  calcAttention,
  calcInitiative,
  calcSpellDC,
  calcSuggestedHP,
  calcSuggestedPE,
} from "@/systems/feiticeiros-e-maldicoes";
import { WizardState } from "./wizardTypes";
import { WIZARD_WEAPONS } from "./wizardPresets";
import {
  WEAPONS_CATALOG,
  UNIFORMS_CATALOG,
  SHIELDS_CATALOG,
  TOOL_KITS_CATALOG,
  GENERAL_GEAR_CATALOG,
  SPECIALIZATION_PROFICIENCIES,
} from "../../data/equipment";

export function calculateFinalAttributes(state: WizardState): Record<AttributeKey, number> {
  const res: Record<AttributeKey, number> = { ...state.baseAttributes };
  
  if (state.attributeBonuses && Object.keys(state.attributeBonuses).length > 0) {
    (ATTRIBUTE_KEYS as readonly AttributeKey[]).forEach((key) => {
      res[key] = (res[key] || 0) + (state.attributeBonuses?.[key] || 0);
    });
    return res;
  }

  const isRestringido = state.origin === "Restringido";
  if (isRestringido) {
    res.FOR = (res.FOR || 10) + 1;
    res.DEX = (res.DEX || 10) + 1;
    res.CON = (res.CON || 10) + 1;
    res[state.bonusPlus2] = (res[state.bonusPlus2] || 10) + 2;
  } else {
    res[state.bonusPlus2] = (res[state.bonusPlus2] || 10) + 2;
    res[state.bonusPlus1] = (res[state.bonusPlus1] || 10) + 1;
  }
  return res;
}

export function buildCharacterSheet(state: WizardState): FMCharacterData {
  const finalAttrs = calculateFinalAttributes(state);
  const forMod = getModifier(finalAttrs.FOR);
  const dexMod = getModifier(finalAttrs.DEX);
  const conMod = getModifier(finalAttrs.CON);
  const chosenKeyAttr = state.keyAttribute || state.techniqueAttribute || "FOR";
  const keyAttrVal = finalAttrs[chosenKeyAttr] || 10;
  const keyAttrMod = getModifier(keyAttrVal);
  const isRestringido = state.origin === "Restringido" || state.specialization === "Restringido";
  const specProf = SPECIALIZATION_PROFICIENCIES[state.specialization] || SPECIALIZATION_PROFICIENCIES["Lutador"];

  const hpMax = calcSuggestedHP(state.specialization, 1, conMod, state.clan);
  const peMax = isRestringido
    ? 0
    : calcSuggestedPE(state.specialization, 1, keyAttrMod, { origin: state.origin, clan: state.clan });

  const sheet = createDefaultCharacter(state.name.trim(), state.type, state.specialization, state.origin);
  sheet.attributes = finalAttrs;
  sheet.clan = state.clan || "";
  sheet.keyAttribute = chosenKeyAttr;
  sheet.hp = { current: hpMax, max: hpMax, temp: 0 };
  sheet.energy = { current: peMax, max: peMax, temp: 0 };
  sheet.integrity = { current: hpMax, max: hpMax, temp: 0 };
  sheet.movement = isRestringido ? 12 : 9;

  if (state.anatomyTrait) {
    sheet.features.push({
      id: "feat-anatomy",
      name: `Anatomia: ${state.anatomyTrait}`,
      current: 1,
      max: 1,
      cost: "-",
      description: "Característica de Anatomia (1º Nível) de Feto Amaldiçoado Híbrido.",
    });
  }

  if (state.level1Choice) {
    sheet.features.push({
      id: "feat-level1-spec",
      name: state.level1Choice,
      current: 1,
      max: 1,
      cost: "-",
      description: `Escolha de 1º Nível da Especialização ${state.specialization}.`,
    });
  }

  if (state.level1FeatName) {
    sheet.features.push({
      id: `feat-level1-${state.level1FeatId || "origem"}`,
      name: `${state.level1FeatType === "aptidao" ? "Aptidão: " : "Talento: "}${state.level1FeatName}`,
      current: 1,
      max: 1,
      cost: "-",
      description: state.level1FeatDesc || "Concedido no 1º Nível pela Origem.",
    });
  }

  // Testes de Resistência
  if (state.chosenSavingThrow && sheet.skills[state.chosenSavingThrow]) {
    sheet.skills[state.chosenSavingThrow].trained = true;
  }
  if (isRestringido) {
    if (sheet.skills["Fortitude"]) sheet.skills["Fortitude"].trained = true;
    if (sheet.skills["Reflexos"]) sheet.skills["Reflexos"].trained = true;
  }

  // Perícias Treinadas
  for (const skillName of state.trainedSkills) {
    if (!sheet.skills[skillName]) {
      sheet.skills[skillName] = { trained: true, expert: false, otherBonus: 0 };
    } else {
      sheet.skills[skillName].trained = true;
    }
  }

  // Perícias Mestre
  for (const skillName of state.expertSkills || []) {
    if (!sheet.skills[skillName]) {
      sheet.skills[skillName] = { trained: true, expert: true, otherBonus: 0 };
    } else {
      sheet.skills[skillName].trained = true;
      sheet.skills[skillName].expert = true;
    }
  }

  // Ofícios
  for (const craftName of state.craftSkills || []) {
    if (!sheet.skills[craftName]) {
      sheet.skills[craftName] = { trained: true, expert: false, otherBonus: 0 };
    }
  }

  // Uniforme e Escudo na Defesa
  const uniformItem = UNIFORMS_CATALOG.find((u) => u.id === (state.selectedUniform || "uniforme-comum"));
  const shieldItem = SHIELDS_CATALOG.find((s) => s.id === state.selectedShield);

  sheet.defense.dexMod = dexMod;
  sheet.defense.uniform = uniformItem ? uniformItem.caBonus : 0;
  sheet.defense.shield = shieldItem ? shieldItem.caBonus : 0;
  sheet.defense.total = calcDefense(sheet);
  sheet.attention = calcAttention(sheet);
  sheet.initiative = calcInitiative(sheet);

  sheet.cursedProfile = {
    techniqueName: state.techniqueName,
    techniqueDesc: state.techniqueDesc,
    techniqueAttribute: state.techniqueAttribute,
    techniqueDC: calcSpellDC(1, finalAttrs[state.techniqueAttribute] || 10),
    techniqueAttack: 2 + getModifier(finalAttrs[state.techniqueAttribute] || 10),
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

  // Armas equipadas
  const chosenWeapons = state.selectedWeapons.map((wId) => {
    const item = WEAPONS_CATALOG.find((w) => w.id === wId) || WIZARD_WEAPONS.find((w) => w.id === wId);
    if (!item) {
      return {
        name: wId,
        attackBonus: 2 + dexMod,
        damage: "1d6",
        critical: "20 / x2",
        damageType: "Impacto",
        range: "Corpo a corpo",
      };
    }

    const isCatalog = "category" in item && "properties" in item && Array.isArray(item.properties);
    const category = isCatalog ? (item as any).category : (item as any).type;
    const properties: string[] = isCatalog ? (item as any).properties : [];
    const hasProf = specProf.weapons.includes(category);
    const isAgile = properties.includes("Ágil");
    const isRanged = category === "Distância" || category === "Fogo" || category === "Arremesso";

    const statMod = isRanged ? dexMod : isAgile ? Math.max(forMod, dexMod) : forMod;
    const attackBonus = (hasProf ? 2 : 0) + statMod;
    const dmgBonusStr = statMod > 0 ? `+${statMod}` : statMod < 0 ? `${statMod}` : "";
    const baseDamage = isCatalog ? (item as any).damage : (item as any).damage;

    return {
      name: item.name,
      attackBonus,
      damage: `${baseDamage}${dmgBonusStr}`,
      critical: isCatalog ? (item as any).critical : "20 / x2",
      damageType: isCatalog ? (item as any).damageType : (item as any).type,
      range: isCatalog ? (item as any).range : (item as any).properties?.includes("Distância") ? "18m" : "Corpo a corpo",
    };
  });
  sheet.weapons = chosenWeapons;

  // Inventário Inicial
  const inventoryItems: FMCharacterData["inventory"] = [];

  // Uniforme no inventário
  if (uniformItem) {
    inventoryItems.push({
      id: uniformItem.id,
      name: uniformItem.name,
      quantity: 1,
      slots: uniformItem.slots,
      cost: `${uniformItem.cost} pt`,
      description: uniformItem.description,
    });
  }

  // Escudo no inventário
  if (shieldItem) {
    inventoryItems.push({
      id: shieldItem.id,
      name: shieldItem.name,
      quantity: 1,
      slots: shieldItem.slots,
      cost: `${shieldItem.cost} pt`,
      description: `${shieldItem.description} (RD ${shieldItem.rdBonus})`,
    });
  }

  // Armas no inventário
  for (const wId of state.selectedWeapons) {
    const item = WEAPONS_CATALOG.find((w) => w.id === wId);
    if (item) {
      inventoryItems.push({
        id: item.id,
        name: item.name,
        quantity: 1,
        slots: item.slots,
        cost: `${item.cost} pt`,
        description: `${item.description} [${item.properties.join(", ")}]`,
      });
    }
  }

  // Kit de Ferramentas
  const kit = TOOL_KITS_CATALOG.find((k) => k.id === state.selectedToolKit);
  if (kit) {
    inventoryItems.push({
      id: kit.id,
      name: kit.name,
      quantity: 1,
      slots: kit.slots,
      cost: "0 pt (Incluso)",
      description: kit.description,
    });
  }

  // Equipamentos Gerais
  for (const gId of state.selectedGear || []) {
    const gear = GENERAL_GEAR_CATALOG.find((g) => g.id === gId);
    if (gear) {
      inventoryItems.push({
        id: gear.id,
        name: gear.name,
        quantity: 1,
        slots: gear.slots,
        cost: `${gear.cost} pt`,
        description: `${gear.description} (${gear.utility})`,
      });
    }
  }

  sheet.inventory = inventoryItems;

  if (state.concept) {
    sheet.personal.ideals = state.concept;
  }

  return sheet;
}
