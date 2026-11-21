"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { MapElement } from "./elementTypes";
import { TokenElement } from "./TokenElement";
import { PropElement } from "./PropElement";

interface ElementsLayerProps {
  elements: MapElement[];
  gridSize: number;
  cameraZoom?: number;
  campaignId?: string;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (updated: MapElement) => void;
  onLocalMove?: (updated: MapElement) => void;
  onCommitMove?: (updated: MapElement) => void;
  onDeleteElement: (id: string) => void;
  availableMaps?: { id: string; title: string }[];
  onTransferElement?: (elementId: string, targetMapId: string) => void;
  interactive?: boolean;
}

export function ElementsLayer({
  elements,
  gridSize,
  cameraZoom = 1,
  campaignId = "",
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onLocalMove,
  onCommitMove,
  onDeleteElement,
  availableMaps,
  onTransferElement,
  interactive = true,
}: ElementsLayerProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    elemX: number;
    elemY: number;
    currentElements: MapElement[];
    hasMoved: boolean;
    lastUpdated?: MapElement;
  }>({
    startX: 0,
    startY: 0,
    elemX: 0,
    elemY: 0,
    currentElements: elements,
    hasMoved: false,
  });

  useEffect(() => {
    dragRef.current.currentElements = elements;
  }, [elements]);

  const handleMouseDown = (e: MouseEvent, elem: MapElement) => {
    if (!interactive || elem.isLocked) return;
    if (e.button !== 0) return;

    e.stopPropagation();
    onSelectElement(elem.id);
    setDraggingId(elem.id);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elemX: elem.x,
      elemY: elem.y,
      currentElements: elements,
      hasMoved: false,
      lastUpdated: elem,
    };
  };

  useEffect(() => {
    if (!draggingId) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const { startX, startY, elemX, elemY, currentElements } = dragRef.current;
      const zoom = cameraZoom > 0 ? cameraZoom : 1;
      const dx = (e.clientX - startX) / zoom;
      const dy = (e.clientY - startY) / zoom;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragRef.current.hasMoved = true;
      }

      const rawX = elemX + dx;
      const rawY = elemY + dy;

      let finalX = rawX;
      let finalY = rawY;

      // Snap ao grid por padrão; Shift permite movimento livre
      if (!e.shiftKey && gridSize > 5) {
        finalX = Math.round(rawX / gridSize) * gridSize;
        finalY = Math.round(rawY / gridSize) * gridSize;
      } else {
        finalX = Math.round(rawX);
        finalY = Math.round(rawY);
      }

      finalX = Math.max(0, finalX);
      finalY = Math.max(0, finalY);

      const target = currentElements.find((el) => el.id === draggingId);
      if (target && (target.x !== finalX || target.y !== finalY)) {
        const updated = { ...target, x: finalX, y: finalY };
        dragRef.current.lastUpdated = updated;
        if (onLocalMove) {
          onLocalMove(updated);
        } else {
          onUpdateElement(updated);
        }
      }
    };

    const handleMouseUp = () => {
      const { hasMoved, lastUpdated } = dragRef.current;
      setDraggingId(null);

      if (hasMoved && lastUpdated && onCommitMove) {
        onCommitMove(lastUpdated);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, cameraZoom, gridSize, onLocalMove, onUpdateElement, onCommitMove]);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Elementos no Tabuleiro */}
      {elements.map((elem) => {
        const isSelected = selectedElementId === elem.id;
        const isDragging = draggingId === elem.id;

        return (
          <div
            key={elem.id}
            onMouseDown={(e) => handleMouseDown(e, elem)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(elem.id);
            }}
            className={`absolute select-none transition-shadow ${
              interactive ? "pointer-events-auto cursor-grab active:cursor-grabbing" : ""
            } ${isDragging ? "opacity-90 z-20" : isSelected ? "z-20" : "z-10"}`}
            style={{
              left: `${elem.x}px`,
              top: `${elem.y}px`,
            }}
          >
            {elem.type === "TOKEN" ? (
              <TokenElement element={elem} gridSize={gridSize} isSelected={isSelected} />
            ) : (
              <PropElement element={elem} gridSize={gridSize} isSelected={isSelected} />
            )}
          </div>
        );
      })}
    </div>
  );
}
