import { TacticalRulerData, RulerShape } from "../mapTypes";

export type { TacticalRulerData, RulerShape };

export function calculateRulerMetrics(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  gridSize: number,
  metersPerGrid = 1.5,
  shape: RulerShape = "line"
): {
  distancePixels: number;
  distanceMeters: number;
  gridCells: number;
} {
  const dx = currentX - startX;
  const dy = currentY - startY;
  const distancePixels = Math.hypot(dx, dy);

  const safeGrid = gridSize > 5 ? gridSize : 50;
  const rawCells = distancePixels / safeGrid;
  const gridCells = Math.round(rawCells * 10) / 10;
  const distanceMeters = Math.round(gridCells * metersPerGrid * 10) / 10;

  return {
    distancePixels,
    distanceMeters,
    gridCells,
  };
}
