// ────────────────────────────────────────────
// Avaliador e parser de dados (Core Dice Parser)
// ────────────────────────────────────────────

export interface ParsedDice {
  count: number;
  sides: number;
  modifier: number;
}

export interface RollResult {
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
  isCritical: boolean;
  isFumble: boolean;
  mode: "normal" | "advantage" | "disadvantage";
  keptIndex?: number;
}

/**
 * Faz o parse de expressões de dados como "1d20+5", "2d8-2", "d20", "1d10".
 * Também extrai com segurança dados seguidos de tipos de dano (ex: "1d8 cortante", "2d6+4 fogo", "1d10 perfurante").
 */
export function parseDiceExpression(expr: string): ParsedDice | null {
  if (!expr || typeof expr !== "string") return null;

  // 1. Procura padrão NdX (+/- M) ignorando texto extra após a expressão
  const diceRegex = /(\d*)d(\d+)(?:\s*([+-]\s*\d+))?/i;
  const match = expr.match(diceRegex);

  if (match) {
    const count = match[1] === "" ? 1 : parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3].replace(/\s+/g, ""), 10) : 0;

    if (count > 0 && sides > 0) {
      return { count, sides, modifier };
    }
  }

  // 2. Tenta extrair número fixo (ex: "+5", "3")
  const staticMatch = expr.trim().match(/^([+-]?\d+)$/);
  if (staticMatch) {
    return { count: 0, sides: 0, modifier: parseInt(staticMatch[1], 10) };
  }

  return null;
}

/**
 * Extrai apenas a fórmula limpa de dados de um texto (ex: "1d8 cortante" -> "1d8", "2d6+4 fogo" -> "2d6+4").
 */
export function extractDiceFormula(raw: string): string {
  if (!raw) return "1d20";
  const parsed = parseDiceExpression(raw);
  if (!parsed) return raw;
  if (parsed.count === 0 && parsed.sides === 0) return `${parsed.modifier >= 0 ? `+${parsed.modifier}` : parsed.modifier}`;
  const modStr = parsed.modifier > 0 ? `+${parsed.modifier}` : parsed.modifier < 0 ? `${parsed.modifier}` : "";
  return `${parsed.count}d${parsed.sides}${modStr}`;
}

/**
 * Rola um dado simples de 1 a N.
 */
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Executa uma rolagem digital com suporte a normal, vantagem e desvantagem.
 */
export function rollDigitalDice(
  formula: string,
  mode: "normal" | "advantage" | "disadvantage" = "normal"
): RollResult {
  const parsed = parseDiceExpression(formula);

  if (!parsed) {
    // Se não conseguir parsear, tenta tratar como número puro + modificador
    const fallbackRoll = rollDie(20);
    return {
      formula,
      rolls: [fallbackRoll],
      modifier: 0,
      total: fallbackRoll,
      isCritical: fallbackRoll === 20,
      isFumble: fallbackRoll === 1,
      mode,
    };
  }

  // Valor fixo sem dados
  if (parsed.count === 0 && parsed.sides === 0) {
    return {
      formula,
      rolls: [parsed.modifier],
      modifier: parsed.modifier,
      total: parsed.modifier,
      isCritical: false,
      isFumble: false,
      mode: "normal",
    };
  }

  // Tratamento especial para d20 com vantagem / desvantagem
  if (parsed.sides === 20 && parsed.count === 1 && mode !== "normal") {
    const roll1 = rollDie(20);
    const roll2 = rollDie(20);
    const kept =
      mode === "advantage"
        ? Math.max(roll1, roll2)
        : Math.min(roll1, roll2);

    const keptIndex = kept === roll1 ? 0 : 1;
    const isCritical = kept === 20;
    const isFumble = kept === 1;
    const total = kept + parsed.modifier;

    return {
      formula: `${formula} (${mode === "advantage" ? "Vantagem" : "Desvantagem"})`,
      rolls: [roll1, roll2],
      modifier: parsed.modifier,
      total,
      isCritical,
      isFumble,
      mode,
      keptIndex,
    };
  }

  // Rolagem normal de N dados
  const rolls: number[] = [];
  for (let i = 0; i < parsed.count; i++) {
    rolls.push(rollDie(parsed.sides));
  }

  const sumRolls = rolls.reduce((acc, r) => acc + r, 0);
  const total = sumRolls + parsed.modifier;

  // Crítico / Falha apenas para d20 simples
  const isCritical = parsed.sides === 20 && parsed.count === 1 && rolls[0] === 20;
  const isFumble = parsed.sides === 20 && parsed.count === 1 && rolls[0] === 1;

  return {
    formula,
    rolls,
    modifier: parsed.modifier,
    total,
    isCritical,
    isFumble,
    mode: "normal",
  };
}

/**
 * Calcula o resultado para uma entrada física inserida manualmente.
 */
export function calculatePhysicalRoll(
  physicalValue: number,
  modifier: number,
  isD20: boolean = true
) {
  const total = physicalValue + modifier;
  const isCritical = isD20 && physicalValue === 20;
  const isFumble = isD20 && physicalValue === 1;

  return {
    physicalValue,
    modifier,
    total,
    isCritical,
    isFumble,
  };
}
