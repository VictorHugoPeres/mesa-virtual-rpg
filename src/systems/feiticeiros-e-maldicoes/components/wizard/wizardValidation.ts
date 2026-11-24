import { WizardState } from "./wizardTypes";

const POINT_COSTS: Record<number, number> = {
  8: -2, 9: -1, 10: 0, 11: 2, 12: 3, 13: 4, 14: 5, 15: 7,
};

export const INITIAL_WIZARD_STATE: WizardState = {
  name: "",
  type: "PC",
  concept: "",
  origin: "Inato",
  specialization: "Lutador",
  attributeMethod: "fixed",
  baseAttributes: { FOR: 0, DEX: 0, CON: 0, INT: 0, SAB: 0, PRE: 0 },
  bonusPlus2: "FOR",
  bonusPlus1: "CON",
  trainedSkills: ["Fortitude", "Atletismo", "Luta"],
  techniqueName: "Proporções 7:3",
  techniqueDesc: "Cria um ponto fraco artificial dividindo a anatomia na proporção 7:3.",
  techniqueAttribute: "SAB",
  spells: [
    {
      name: "Golpe no Ponto Fraco",
      level: 1,
      cost: 2,
      action: "Ação Padrão",
      range: "Corpo a corpo",
      description: "Atinge a linha 7:3 causando dano da arma + 2d8 de impacto crítico.",
    },
    {
      name: "Colapso Estrutural",
      level: 1,
      cost: 2,
      action: "Ação Padrão",
      range: "Toque em superfície",
      description: "Destrói o terreno no ponto 7:3 derrubando inimigos em 4,5m.",
    },
  ],
  selectedWeapons: ["adaga", "espada-curta"],
  selectedUniform: "uniforme-comum",
  selectedShield: "",
  selectedToolKit: "kit-primeiros-socorros",
  selectedGear: [],
};

export function canAdvanceStep(step: number, state: WizardState): boolean {
  if (step === 3) {
    const vals = Object.values(state.baseAttributes);
    if (state.attributeMethod === "fixed") {
      return vals.filter((v) => v > 0).length === 6 && new Set(vals).size === 6;
    }
    if (state.attributeMethod === "roll") {
      return vals.filter((v) => v > 0).length === 6;
    }
    if (state.attributeMethod === "pointBuy") {
      const spent = vals.reduce((acc, v) => acc + (POINT_COSTS[v] ?? 0), 0);
      return 17 - spent >= 0 && vals.every((v) => v >= 8 && v <= 15);
    }
  }
  return true;
}
