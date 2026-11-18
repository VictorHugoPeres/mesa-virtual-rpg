"use client";

import { useRef, useState, useEffect, useCallback, MouseEvent, WheelEvent } from "react";
import { CameraState } from "./mapTypes";

interface MapCanvasProps {
  imageUrl: string;
  gridEnabled: boolean;
  gridSize: number;
  gridColor: string;
  gridOpacity: number;
  camera: CameraState;
  onCameraChange: (newCam: CameraState) => void;
  interactive?: boolean;
}

export function MapCanvas({
  imageUrl,
  gridEnabled,
  gridSize,
  gridColor,
  gridOpacity,
  camera,
  onCameraChange,
  interactive = true,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Previne zoom da página ao usar scroll no canvas
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !interactive) return;

    const preventDefaultScroll = (e: globalThis.WheelEvent) => {
      e.preventDefault();
    };

    el.addEventListener("wheel", preventDefaultScroll, { passive: false });
    return () => {
      el.removeEventListener("wheel", preventDefaultScroll);
    };
  }, [interactive]);

  // Manipulador de Zoom com a roda do mouse
  const handleWheel = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (!interactive) return;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const newZoom = Math.min(4, Math.max(0.2, camera.zoom * zoomFactor));

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Mantém o ponto do cursor estável durante o zoom
        const panX = mouseX - (mouseX - camera.panX) * (newZoom / camera.zoom);
        const panY = mouseY - (mouseY - camera.panY) * (newZoom / camera.zoom);

        onCameraChange({ zoom: newZoom, panX, panY });
      } else {
        onCameraChange({ ...camera, zoom: newZoom });
      }
    },
    [camera, interactive, onCameraChange]
  );

  // Início do arrasto (Pan)
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    // Permite arrastar com botão esquerdo ou do meio
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - camera.panX, y: e.clientY - camera.panY });
    }
  };

  // Movimento durante o arrasto
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging) return;
    const newPanX = e.clientX - dragStart.x;
    const newPanY = e.clientY - dragStart.y;
    onCameraChange({ ...camera, panX: newPanX, panY: newPanY });
  };

  // Fim do arrasto
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full overflow-hidden bg-[#07070a] select-none ${
        interactive ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
      }`}
    >
      {/* Camada Transformada por Zoom e Pan */}
      <div
        className="absolute origin-top-left transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translate3d(${camera.panX}px, ${camera.panY}px, 0) scale(${camera.zoom})`,
        }}
      >
        {/* Imagem Base do Mapa */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Mapa Tático"
            draggable={false}
            onLoad={(e) => {
              const img = e.currentTarget;
              setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
            }}
            className="block max-w-none pointer-events-none shadow-2xl"
          />
        ) : (
          <div className="w-[1200px] h-[800px] bg-zinc-900 flex items-center justify-center text-zinc-500 font-medium">
            Nenhuma imagem carregada para o mapa.
          </div>
        )}

        {/* Camada da Grade Vetorial (SVG Grid) */}
        {gridEnabled && gridSize > 5 && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width={imageSize.width || "100%"}
            height={imageSize.height || "100%"}
            style={{ width: imageSize.width || 2000, height: imageSize.height || 2000 }}
          >
            <defs>
              <pattern
                id={`tactical-grid-${gridSize}`}
                width={gridSize}
                height={gridSize}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                  fill="none"
                  stroke={gridColor}
                  strokeWidth="1"
                  strokeOpacity={gridOpacity}
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={`url(#tactical-grid-${gridSize})`}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
