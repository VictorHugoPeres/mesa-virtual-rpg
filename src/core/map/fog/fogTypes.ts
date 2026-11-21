export interface FogMapState {
  baseMode: "covered" | "revealed"; // "covered" = névoa escura por padrão; "revealed" = limpo por padrão
  cells: string[]; // Coordenadas "col,row". Se baseMode="covered", são as células REVELADAS. Se baseMode="revealed", são as células COBERTAS.
}

export const DEFAULT_FOG_STATE: FogMapState = {
  baseMode: "revealed",
  cells: [],
};

export function parseFogState(raw?: string): FogMapState {
  if (!raw) return DEFAULT_FOG_STATE;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.baseMode === "covered" || parsed.baseMode === "revealed")) {
      return {
        baseMode: parsed.baseMode,
        cells: Array.isArray(parsed.cells) ? parsed.cells : [],
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_FOG_STATE;
}

export function serializeFogState(state: FogMapState): string {
  return JSON.stringify(state);
}

export function isCellCovered(col: number, row: number, state: FogMapState): boolean {
  const key = `${col},${row}`;
  if (state.baseMode === "covered") {
    // Coberto por padrão: está coberto a menos que esteja no conjunto de revelados
    return !state.cells.includes(key);
  } else {
    // Revelado por padrão: NÃO está coberto a menos que esteja no conjunto de cobertos
    return state.cells.includes(key);
  }
}

export function getBrushCells(
  centerCol: number,
  centerRow: number,
  brushSize: number,
  maxCols = 200,
  maxRows = 200
): string[] {
  const result: string[] = [];
  const offset = Math.floor(brushSize / 2);

  for (let c = centerCol - offset; c < centerCol - offset + brushSize; c++) {
    for (let r = centerRow - offset; r < centerRow - offset + brushSize; r++) {
      if (c >= 0 && c < maxCols && r >= 0 && r < maxRows) {
        result.push(`${c},${r}`);
      }
    }
  }

  return result;
}
