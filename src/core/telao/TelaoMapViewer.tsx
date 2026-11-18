"use client";

import { useMemo } from "react";
import { TacticalMapSyncData } from "../sync/syncTypes";
import { MapCanvas } from "../map/MapCanvas";
import { ElementsLayer } from "../map/elements/ElementsLayer";
import { MapElement } from "../map/elements/elementTypes";

interface TelaoMapViewerProps {
  mapData: TacticalMapSyncData | null;
}

export function TelaoMapViewer({ mapData }: TelaoMapViewerProps) {
  if (!mapData || !mapData.isProjected || !mapData.imageUrl) {
    return null;
  }

  const elements: MapElement[] = useMemo(() => {
    if (!mapData.elementsData) return [];
    try {
      const parsed = JSON.parse(mapData.elementsData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [mapData.elementsData]);

  return (
    <div className="absolute inset-0 z-10 w-full h-full bg-[#050508] animate-in fade-in duration-300">
      <MapCanvas
        imageUrl={mapData.imageUrl}
        gridEnabled={mapData.gridEnabled}
        gridSize={mapData.gridSize}
        gridColor={mapData.gridColor}
        gridOpacity={mapData.gridOpacity}
        camera={mapData.cameraState}
        onCameraChange={() => {}}
        interactive={false}
      >
        <ElementsLayer
          elements={elements}
          gridSize={mapData.gridSize}
          cameraZoom={mapData.cameraState.zoom}
          selectedElementId={null}
          onSelectElement={() => {}}
          onUpdateElement={() => {}}
          onDeleteElement={() => {}}
          interactive={false}
        />
      </MapCanvas>

      {/* Título discreto do mapa no canto superior da TV */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="px-2.5 py-1 rounded-md bg-black/70 border border-white/10 text-white font-mono text-[11px] backdrop-blur-xs">
          Mapa: {mapData.title}
        </span>
      </div>
    </div>
  );
}
