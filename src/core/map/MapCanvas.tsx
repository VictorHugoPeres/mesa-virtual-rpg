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
  onImageLoaded?: (size: { width: number; height: number }) => void;
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
  onImageLoaded,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragDistanceRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  // Checa se a imagem já foi carregada do cache
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth) {
      const size = { width: imgRef.current.naturalWidth, height: imgRef.current.naturalHeight };
      setImageSize(size);
      if (onImageLoaded) onImageLoaded(size);
    }
  }, [imageUrl, onImageLoaded]);

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
      const newZoom = Math.min(4, Math.max(0.1, camera.zoom * zoomFactor));

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
        {imageUrl && !imageError ? (
          <div
            className="relative select-none shadow-2xl overflow-hidden"
            style={{
              width: imageSize.width ? `${imageSize.width}px` : "auto",
              height: imageSize.height ? `${imageSize.height}px` : "auto",
            }}
          >
            {/* Imagem Base do Mapa */}
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Mapa Tático"
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget;
                const size = { width: img.naturalWidth, height: img.naturalHeight };
                setImageSize(size);
                if (onImageLoaded) onImageLoaded(size);
              }}
              onError={() => setImageError(true)}
              className="block max-w-none pointer-events-none shadow-2xl"
            />

            {/* Camada da Grade Vetorial (SVG Grid) - 100% presa dentro dos limites da imagem */}
            {gridEnabled && gridSize > 5 && (
              <svg
                className="absolute inset-0 pointer-events-none w-full h-full"
                width="100%"
                height="100%"
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
      </div>
    </div>
  );
}
