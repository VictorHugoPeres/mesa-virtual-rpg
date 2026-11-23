"use client";

import { useRef, useState, useEffect, useCallback, PointerEvent as ReactPointerEvent } from "react";
import { TacticalMapSyncData } from "@/core/sync/syncTypes";
import { MapElement } from "@/core/map/elements/elementTypes";
import { FogMapState, isCellCovered } from "@/core/map/fog/fogTypes";
import { MapCanvas } from "@/core/map/MapCanvas";
import { FogLayer } from "@/core/map/fog/FogLayer";
import { TokenElement } from "@/core/map/elements/TokenElement";
import { PropElement } from "@/core/map/elements/PropElement";

interface MobileInteractiveCanvasProps {
  mapData: TacticalMapSyncData;
  elements: MapElement[];
  fog: FogMapState;
  myToken: MapElement | null;
  characterId: string;
  tapToMove: boolean;
  onMoveMyToken: (elementId: string, x: number, y: number) => void;
  camera: { zoom: number; panX: number; panY: number };
  onCameraChange: (cam: { zoom: number; panX: number; panY: number }) => void;
}

export function MobileInteractiveCanvas({
  mapData,
  elements,
  fog,
  myToken,
  characterId,
  tapToMove,
  onMoveMyToken,
  camera,
  onCameraChange,
}: MobileInteractiveCanvasProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [draggingTokenId, setDraggingTokenId] = useState<string | null>(null);
  const [dragTokenPos, setDragTokenPos] = useState<{ x: number; y: number } | null>(null);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    elemX: number;
    elemY: number;
    hasMoved: boolean;
  }>({ startX: 0, startY: 0, elemX: 0, elemY: 0, hasMoved: false });

  const gridSize = Math.max(10, mapData.gridSize || 50);

  // 1. Início de arraste do próprio token via Pointer Events (touch-none)
  const handleTokenPointerDown = (e: ReactPointerEvent<HTMLDivElement>, elem: MapElement) => {
    if (elem.characterId !== characterId || tapToMove) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setDraggingTokenId(elem.id);
    setDragTokenPos({ x: elem.x, y: elem.y });
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elemX: elem.x,
      elemY: elem.y,
      hasMoved: false,
    };
  };

  const handleTokenPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingTokenId) return;
    const { startX, startY, elemX, elemY } = dragRef.current;
    const zoom = camera.zoom > 0 ? camera.zoom : 1;
    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.hasMoved = true;
    }

    const rawX = elemX + dx;
    const rawY = elemY + dy;
    const snappedX = Math.round(rawX / gridSize) * gridSize;
    const snappedY = Math.round(rawY / gridSize) * gridSize;

    setDragTokenPos({ x: snappedX, y: snappedY });
  };

  const handleTokenPointerUp = (e: ReactPointerEvent<HTMLDivElement>, elem: MapElement) => {
    if (!draggingTokenId) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (dragRef.current.hasMoved && dragTokenPos) {
      onMoveMyToken(elem.id, dragTokenPos.x, dragTokenPos.y);
    }

    setDraggingTokenId(null);
    setDragTokenPos(null);
  };

  // 2. Modo "📍 Tocar p/ Mover": toca numa célula do mapa e move o token com snap
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tapToMove || !myToken) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const zoom = camera.zoom > 0 ? camera.zoom : 1;
    const clickX = (e.clientX - rect.left - camera.panX) / zoom;
    const clickY = (e.clientY - rect.top - camera.panY) / zoom;

    const col = Math.floor(clickX / gridSize);
    const row = Math.floor(clickY / gridSize);

    // Validação anti-spoiler: não permite mover para área dentro da névoa
    if (isCellCovered(col, row, fog)) {
      return;
    }

    const snappedX = col * gridSize;
    const snappedY = row * gridSize;
    onMoveMyToken(myToken.id, snappedX, snappedY);
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-[#050508] ${
        tapToMove ? "cursor-crosshair" : "cursor-default"
      }`}
      onClick={handleCanvasClick}
    >
      <MapCanvas
        imageUrl={mapData.imageUrl}
        gridEnabled={mapData.gridEnabled}
        gridSize={mapData.gridSize}
        gridColor={mapData.gridColor}
        gridOpacity={mapData.gridOpacity}
        camera={camera}
        onCameraChange={onCameraChange}
        interactive={true}
        canPan={!draggingTokenId}
        onImageLoaded={setImageSize}
      >
        {/* Camada de Objetos e Cenário (z-10) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {elements
            .filter((el) => el.type === "PROP")
            .map((prop) => (
              <div
                key={prop.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${prop.x}px`,
                  top: `${prop.y}px`,
                  width: `${prop.widthCells * gridSize}px`,
                  height: `${prop.heightCells * gridSize}px`,
                }}
              >
                <PropElement element={prop} gridSize={gridSize} />
              </div>
            ))}
        </div>

        {/* Camada de Tokens (z-20) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {elements
            .filter((el) => el.type === "TOKEN")
            .map((token) => {
              const isMine = token.characterId === characterId;
              const isDragging = draggingTokenId === token.id;
              const currentX = isDragging && dragTokenPos ? dragTokenPos.x : token.x;
              const currentY = isDragging && dragTokenPos ? dragTokenPos.y : token.y;

              return (
                <div
                  key={token.id}
                  onPointerDown={(e) => handleTokenPointerDown(e, token)}
                  onPointerMove={handleTokenPointerMove}
                  onPointerUp={(e) => handleTokenPointerUp(e, token)}
                  onPointerCancel={(e) => handleTokenPointerUp(e, token)}
                  className={`absolute transition-transform duration-75 select-none ${
                    isMine
                      ? "pointer-events-auto touch-none cursor-grab active:cursor-grabbing z-30"
                      : "pointer-events-none opacity-90"
                  }`}
                  style={{
                    left: `${currentX}px`,
                    top: `${currentY}px`,
                    transform: isDragging ? "scale(1.12)" : "scale(1)",
                  }}
                >
                  {/* Badge de identificação "Você" com anel neon pulsante */}
                  {isMine && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-cyan-500 text-black font-black text-[9px] uppercase tracking-wider shadow-lg border border-cyan-300 pointer-events-none z-40 animate-pulse">
                      Você
                    </div>
                  )}

                  <div className={`relative ${isMine ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-black rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" : ""}`}>
                    <TokenElement
                      element={token}
                      gridSize={gridSize}
                      isSelected={isMine}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Névoa de Guerra 100% Opaca (z-30: Oculta monstros e áreas não reveladas sem spoilers) */}
        <FogLayer
          mapId={mapData.id}
          fog={fog}
          gridSize={mapData.gridSize}
          width={imageSize.width || 2000}
          height={imageSize.height || 2000}
          isMaster={false}
          interactive={false}
        />
      </MapCanvas>
    </div>
  );
}
