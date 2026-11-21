"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { FogMapState, getBrushCells } from "./fogTypes";
import { MapToolMode } from "../mapTypes";

interface FogLayerProps {
  mapId: string;
  fog: FogMapState;
  gridSize: number;
  width: number;
  height: number;
  isMaster?: boolean;
  interactive?: boolean;
  toolMode?: MapToolMode;
  brushSize?: number;
  cameraZoom?: number;
  onPaintCells?: (cellKeys: string[], mode: "reveal" | "hide") => void;
  onCommitPaint?: () => void;
}

export function FogLayer({
  mapId,
  fog,
  gridSize,
  width,
  height,
  isMaster = false,
  interactive = false,
  toolMode = "select",
  brushSize = 1,
  cameraZoom = 1,
  onPaintCells,
  onCommitPaint,
}: FogLayerProps) {
  const [isPainting, setIsPainting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCellRef = useRef<string | null>(null);

  const isFogTool = toolMode === "fog_reveal" || toolMode === "fog_hide";
  const canPaint = isMaster && interactive && isFogTool;

  const maxCols = Math.max(1, Math.ceil((width || 2000) / gridSize));
  const maxRows = Math.max(1, Math.ceil((height || 2000) / gridSize));

  const handlePointerAction = (clientX: number, clientY: number) => {
    if (!containerRef.current || !onPaintCells) return;
    const rect = containerRef.current.getBoundingClientRect();
    const zoom = cameraZoom > 0 ? cameraZoom : 1;
    const x = (clientX - rect.left) / zoom;
    const y = (clientY - rect.top) / zoom;

    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);

    if (col < 0 || col >= maxCols || row < 0 || row >= maxRows) return;

    const cellKey = `${col},${row}`;
    if (cellKey === lastCellRef.current) return;
    lastCellRef.current = cellKey;

    const affected = getBrushCells(col, row, brushSize, maxCols, maxRows);
    onPaintCells(affected, toolMode === "fog_reveal" ? "reveal" : "hide");
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!canPaint || e.button !== 0) return;
    e.stopPropagation();
    setIsPainting(true);
    lastCellRef.current = null;
    handlePointerAction(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!isPainting) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      handlePointerAction(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsPainting(false);
      lastCellRef.current = null;
      if (onCommitPaint) onCommitPaint();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPainting, cameraZoom, gridSize, maxCols, maxRows, brushSize, toolMode, onPaintCells, onCommitPaint]);

  const maskId = `fog-mask-${mapId}-${isMaster ? "gm" : "tv"}`;
  const fogOpacity = isMaster ? 0.55 : 1;
  const zIndexClass = isMaster ? "z-20" : "z-30"; // No telão, z-30 fica acima de todos os tokens!

  return (
    <div
      ref={containerRef}
      onMouseDown={canPaint ? handleMouseDown : undefined}
      className={`absolute inset-0 select-none ${zIndexClass} ${
        canPaint ? "pointer-events-auto cursor-crosshair" : "pointer-events-none"
      }`}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        width={width || "100%"}
        height={height || "100%"}
      >
        {fog.baseMode === "covered" ? (
          <>
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="100%"
                height="100%"
              >
                {/* Base branca = tudo coberto de névoa */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {/* Células pretas = buracos revelados */}
                {fog.cells.map((key) => {
                  const [c, r] = key.split(",").map(Number);
                  return (
                    <rect
                      key={key}
                      x={c * gridSize}
                      y={r * gridSize}
                      width={gridSize}
                      height={gridSize}
                      fill="black"
                    />
                  );
                })}
              </mask>
            </defs>
            {/* Camada escura com a máscara aplicada */}
            <rect
              width="100%"
              height="100%"
              fill="#050508"
              opacity={fogOpacity}
              mask={`url(#${maskId})`}
            />
          </>
        ) : (
          /* Base revelada: desenha apenas os blocos que foram cobertos */
          <g>
            {fog.cells.map((key) => {
              const [c, r] = key.split(",").map(Number);
              return (
                <rect
                  key={key}
                  x={c * gridSize}
                  y={r * gridSize}
                  width={gridSize}
                  height={gridSize}
                  fill="#050508"
                  opacity={fogOpacity}
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
