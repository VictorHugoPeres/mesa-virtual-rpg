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
  children?: React.ReactNode;
  onClick?: () => void;
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
  children,
  onClick,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragDistanceRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

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

        const panX = mouseX - (mouseX - camera.panX) * (newZoom / camera.zoom);
        const panY = mouseY - (mouseY - camera.panY) * (newZoom / camera.zoom);

        onCameraChange({ zoom: newZoom, panX, panY });
      } else {
        onCameraChange({ ...camera, zoom: newZoom });
      }
    },
    [camera, interactive, onCameraChange]
  );

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - camera.panX, y: e.clientY - camera.panY });
      dragDistanceRef.current = 0;
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging) return;
    dragDistanceRef.current += Math.abs(e.movementX) + Math.abs(e.movementY);
    const newPanX = e.clientX - dragStart.x;
    const newPanY = e.clientY - dragStart.y;
    onCameraChange({ ...camera, panX: newPanX, panY: newPanY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // Se arrastou (pan), não desmarca
    if (dragDistanceRef.current > 6) return;
    if (onClick) onClick();
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
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
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt="Mapa Tático"
            draggable={false}
            onLoad={(e) => {
              const img = e.currentTarget;
              setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
            }}
            onError={() => setImageError(true)}
            className="block max-w-none pointer-events-none shadow-2xl"
          />
        ) : (
          <div className="w-[1200px] h-[800px] bg-zinc-900 border border-red-950 flex flex-col items-center justify-center text-zinc-500 font-medium p-6 text-center">
            <span className="text-sm font-bold text-red-400 mb-1">
              {imageError ? "Falha ao carregar a imagem do mapa." : "Nenhuma imagem carregada para o mapa."}
            </span>
            <span className="text-xs text-zinc-500 max-w-md">
              {imageError
                ? `Não foi possível carregar a imagem de "${imageUrl}". Verifique se o link é válido ou envie um arquivo local.`
                : "Cadastre um mapa com imagem válida."}
            </span>
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

        {/* Camada de Elementos (Tokens e Objetos) */}
        {children}
      </div>
    </div>
  );
}
