import { Specialization, AttributeKey } from "../../constants";

export type WeaponCategory = "Simples" | "Marcial" | "Distância" | "Fogo" | "Arremesso";
export type EquipmentKind = "Arma" | "Uniforme" | "Escudo" | "Kit" | "Geral";

export interface SpecProficiencyRules {
  weapons: WeaponCategory[];
  shields: string[];
  summary: string;
}

export const SPECIALIZATION_PROFICIENCIES: Record<Specialization, SpecProficiencyRules> = {
  Lutador: {
    weapons: ["Simples", "Marcial"],
    shields: ["Escudo Leve"],
    summary: "Armas Simples, Armas Marciais e Escudo Leve.",
  },
  "Especialista em Combate": {
    weapons: ["Simples", "Marcial", "Distância", "Fogo", "Arremesso"],
    shields: ["Escudo Leve", "Escudo Pequeno", "Escudo Médio", "Escudo Pesado"],
    summary: "Todas as Armas e Todos os Escudos.",
  },
  "Especialista em Técnica": {
    weapons: ["Simples", "Distância"],
    shields: [],
    summary: "Armas Simples e Armas a Distância.",
  },
  Controlador: {
    weapons: ["Simples", "Distância"],
    shields: [],
    summary: "Armas Simples e Armas a Distância.",
  },
  Suporte: {
    weapons: ["Simples"],
    shields: ["Escudo Leve", "Escudo Pequeno", "Escudo Médio"],
    summary: "Armas Simples e Escudos (Leve, Pequeno, Médio).",
  },
  Restringido: {
    weapons: ["Simples", "Marcial", "Distância", "Fogo", "Arremesso"],
    shields: ["Escudo Leve", "Escudo Pequeno", "Escudo Médio", "Escudo Pesado"],
    summary: "Mestria Total: Todas as Armas e Todos os Escudos.",
  },
};

export const STARTING_QUOTA = {
  maxBudget: 2, // 2 pontos de custo (2 itens custo 1 ou 1 item custo 2)
  freeUniform: "uniforme-comum",
  freeToolKitCount: 1,
};

export interface EligibilityResult {
  isEligible: boolean;
  hasProficiency: boolean;
  warning?: string;
  error?: string;
}

/**
 * Validação de Elegibilidade de Equipamentos v2.5:
 * Uniformes não exigem proficiência de treinamento (qualquer feiticeiro pode vestir qualquer uniforme;
 * uniformes médios e robustos apenas impõem penalidades em testes de perícias de Destreza).
 */
export function checkEquipmentEligibility(
  item: {
    cost: number;
    kind: EquipmentKind;
    category?: WeaponCategory;
    shieldType?: string;
    minStrength?: number;
    requiredLevel?: number;
  },
  spec: Specialization,
  characterAttrs: Record<AttributeKey, number>,
  currentCostSpent: number,
  isSelected: boolean
): EligibilityResult {
  const prof = SPECIALIZATION_PROFICIENCIES[spec] || SPECIALIZATION_PROFICIENCIES["Lutador"];
  let hasProficiency = true;
  let warning: string | undefined;
  let error: string | undefined;

  // 1. Armas: proficiência conforme a Especialização
  if (item.kind === "Arma" && item.category) {
    hasProficiency = prof.weapons.includes(item.category);
    if (!hasProficiency) {
      warning = `Sem treino com armas ${item.category} (não soma bônus de treino no ataque).`;
    }
  }

  // 2. Escudos: proficiência conforme a Especialização
  if (item.kind === "Escudo" && item.shieldType) {
    hasProficiency = prof.shields.includes(item.shieldType);
    if (!hasProficiency) {
      warning = `Sem treino com este tipo de escudo (${item.shieldType}).`;
    }
  }

  // 3. Força mínima necessária para manejo eficiente
  if (item.minStrength && (characterAttrs.FOR || 10) < item.minStrength) {
    warning = `Requer Força ${item.minStrength} (atual: ${characterAttrs.FOR || 10}) para manejo ideal.`;
  }

  // 4. Cota de custo inicial
  if (!isSelected && currentCostSpent + item.cost > STARTING_QUOTA.maxBudget) {
    error = `Custo ${item.cost} excede a cota inicial restante (${STARTING_QUOTA.maxBudget - currentCostSpent} pt restante).`;
  }

  return {
    isEligible: !error,
    hasProficiency,
    warning,
    error,
  };
}
