"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { TacticalRulerData, RulerShape, calculateRulerMetrics } from "./rulerTypes";
import { MapToolMode } from "../mapTypes";

interface RulerLayerProps {
  ruler: TacticalRulerData | null;
  gridSize: number;
  metersPerGrid: number;
  isMaster?: boolean;
  interactive?: boolean;
  toolMode?: MapToolMode;
  shape?: RulerShape;
  showOnTv?: boolean;
  cameraZoom?: number;
  onRulerChange?: (ruler: TacticalRulerData | null) => void;
  onRulerCommit?: (ruler: TacticalRulerData | null) => void;
}

export function RulerLayer({
  ruler,
  gridSize,
  metersPerGrid,
  isMaster = false,
  interactive = false,
  toolMode = "select",
  shape = "line",
  showOnTv = false,
  cameraZoom = 1,
  onRulerChange,
  onRulerCommit,
}: RulerLayerProps) {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const isRulerTool = toolMode === "ruler";
  const canMeasure = isMaster && interactive && isRulerTool;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!canMeasure || e.button !== 0 || !containerRef.current) return;
    e.stopPropagation();

    const rect = containerRef.current.getBoundingClientRect();
    const zoom = cameraZoom > 0 ? cameraZoom : 1;
    const startX = Math.round((e.clientX - rect.left) / zoom);
    const startY = Math.round((e.clientY - rect.top) / zoom);

    startPosRef.current = { x: startX, y: startY };
    setIsMeasuring(true);

    const initialRuler: TacticalRulerData = {
      startX,
      startY,
      currentX: startX,
      currentY: startY,
      shape,
      distanceMeters: 0,
      gridCells: 0,
      showOnTv,
    };

    if (onRulerChange) onRulerChange(initialRuler);
  };

  useEffect(() => {
    if (!isMeasuring) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!containerRef.current || !startPosRef.current || !onRulerChange) return;
      const rect = containerRef.current.getBoundingClientRect();
      const zoom = cameraZoom > 0 ? cameraZoom : 1;
      const currentX = Math.round((e.clientX - rect.left) / zoom);
      const currentY = Math.round((e.clientY - rect.top) / zoom);

      const metrics = calculateRulerMetrics(
        startPosRef.current.x,
        startPosRef.current.y,
        currentX,
        currentY,
        gridSize,
        metersPerGrid,
        shape
      );

      const updated: TacticalRulerData = {
        startX: startPosRef.current.x,
        startY: startPosRef.current.y,
        currentX,
        currentY,
        shape,
        distanceMeters: metrics.distanceMeters,
        gridCells: metrics.gridCells,
        showOnTv,
      };

      onRulerChange(updated);
    };

    const handleMouseUp = () => {
      setIsMeasuring(false);
      startPosRef.current = null;
      if (onRulerCommit) onRulerCommit(ruler);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMeasuring, cameraZoom, gridSize, metersPerGrid, shape, showOnTv, ruler, onRulerChange, onRulerCommit]);

  if (!ruler && !canMeasure) return null;

  const radiusPixels = ruler
    ? Math.hypot(ruler.currentX - ruler.startX, ruler.currentY - ruler.startY)
    : 0;

  const midX = ruler ? (ruler.startX + ruler.currentX) / 2 : 0;
  const midY = ruler ? (ruler.startY + ruler.currentY) / 2 : 0;

  return (
    <div
      ref={containerRef}
      onMouseDown={canMeasure ? handleMouseDown : undefined}
      className={`absolute inset-0 select-none z-40 ${
        canMeasure ? "pointer-events-auto cursor-crosshair" : "pointer-events-none"
      }`}
    >
      {ruler && (
        <>
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {ruler.shape === "circle" ? (
              <>
                {/* Expansão de Domínio / Área Circular */}
                <circle
                  cx={ruler.startX}
                  cy={ruler.startY}
                  r={radiusPixels}
                  fill="#8b5cf6"
                  fillOpacity="0.22"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeDasharray="8,5"
                />
                <line
                  x1={ruler.startX}
                  y1={ruler.startY}
                  x2={ruler.currentX}
                  y2={ruler.currentY}
                  stroke="#c084fc"
                  strokeWidth="2"
                />
                <circle cx={ruler.startX} cy={ruler.startY} r="5" fill="#8b5cf6" />
                <circle cx={ruler.currentX} cy={ruler.currentY} r="5" fill="#c084fc" />
              </>
            ) : (
              <>
                {/* Linha de Distância Direta */}
                <line
                  x1={ruler.startX}
                  y1={ruler.startY}
                  x2={ruler.currentX}
                  y2={ruler.currentY}
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                />
                <circle cx={ruler.startX} cy={ruler.startY} r="5" fill="#10b981" />
                <circle
                  cx={ruler.currentX}
                  cy={ruler.currentY}
                  r="6"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>

          {/* Etiqueta Flutuante de Medição */}
          {radiusPixels > 5 && (
            <div
              style={{ left: `${midX}px`, top: `${midY}px` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-black/90 backdrop-blur-md shadow-2xl border text-[11px] font-bold text-white flex items-center gap-1.5 whitespace-nowrap pointer-events-none ${
                ruler.shape === "circle" ? "border-purple-500/80" : "border-emerald-500/80"
              }`}
            >
              {ruler.shape === "circle" && <span className="text-purple-300">Raio:</span>}
              <span>{ruler.distanceMeters}m</span>
              <span className={ruler.shape === "circle" ? "text-purple-400" : "text-emerald-400"}>
                ({ruler.gridCells}q)
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
