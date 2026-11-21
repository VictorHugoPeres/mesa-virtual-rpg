"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { TacticalMapSyncData, TacticalRulerData } from "../sync/syncTypes";
import { MapCanvas } from "../map/MapCanvas";
import { ElementsLayer } from "../map/elements/ElementsLayer";
import { FogLayer } from "../map/fog/FogLayer";
import { RulerLayer } from "../map/ruler/RulerLayer";
import { MapElement } from "../map/elements/elementTypes";
import { parseFogState } from "../map/fog/fogTypes";

interface SingleTelaoMapPanelProps {
  mapData: TacticalMapSyncData;
  displayMode?: "fit" | "follow";
  labelPrefix?: string;
  ruler?: TacticalRulerData | null;
}

export function SingleTelaoMapPanel({
  mapData,
  displayMode = "fit",
  labelPrefix,
  ruler = null,
}: SingleTelaoMapPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const elements: MapElement[] = useMemo(() => {
    if (!mapData.elementsData) return [];
    try {
      const parsed = JSON.parse(mapData.elementsData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [mapData.elementsData]);

  const fog = useMemo(() => {
    return parseFogState(mapData.fogData);
  }, [mapData.fogData]);

  // Centralização geométrica exata
  const activeCamera = useMemo(() => {
    if (displayMode === "follow") {
      return mapData.cameraState;
    }

    const cw = containerSize.width || 1200;
    const ch = containerSize.height || 800;
    const iw = imageSize.width || 1200;
    const ih = imageSize.height || 800;

    const scaleX = cw / iw;
    const scaleY = ch / ih;
    const fitZoom = Math.min(scaleX, scaleY);
    const zoom = Math.max(0.05, Number.isFinite(fitZoom) ? fitZoom : 1);

    const panX = (cw - iw * zoom) / 2;
    const panY = (ch - ih * zoom) / 2;

    return { zoom, panX, panY };
  }, [displayMode, mapData.cameraState, containerSize, imageSize]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#050508]">
      <MapCanvas
        imageUrl={mapData.imageUrl}
        gridEnabled={mapData.gridEnabled}
        gridSize={mapData.gridSize}
        gridColor={mapData.gridColor}
        gridOpacity={mapData.gridOpacity}
        camera={activeCamera}
        onCameraChange={() => {}}
        onImageLoaded={setImageSize}
        interactive={false}
      >
        {/* Tokens e Objetos */}
        <ElementsLayer
          elements={elements}
          gridSize={mapData.gridSize}
          cameraZoom={activeCamera.zoom}
          selectedElementId={null}
          onSelectElement={() => {}}
          onUpdateElement={() => {}}
          onDeleteElement={() => {}}
          interactive={false}
        />

        {/* Névoa de Guerra 100% Opaca (z-30: cobre o mapa E todos os tokens/props na TV) */}
        <FogLayer
          mapId={mapData.id}
          fog={fog}
          gridSize={mapData.gridSize}
          width={imageSize.width}
          height={imageSize.height}
          isMaster={false}
          interactive={false}
        />

        {/* Projeção da Régua / Área se ativada pelo Mestre */}
        {ruler && (
          <RulerLayer
            ruler={ruler}
            gridSize={mapData.gridSize}
            metersPerGrid={mapData.metersPerGrid}
            isMaster={false}
            interactive={false}
          />
        )}
      </MapCanvas>

      {/* Rótulo de título do mapa na TV */}
      <div className="absolute top-4 left-4 z-40 pointer-events-none opacity-70 hover:opacity-100 transition-opacity">
        <span className="px-3 py-1.5 rounded-lg bg-black/85 border border-white/15 text-white font-mono text-xs backdrop-blur-md shadow-lg flex items-center gap-2">
          {labelPrefix && (
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              {labelPrefix}
            </span>
          )}
          <span>{mapData.title}</span>
        </span>
      </div>
    </div>
  );
}
