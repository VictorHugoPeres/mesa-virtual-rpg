"use client";

import { TacticalMapSyncData } from "../sync/syncTypes";
import { MapCanvas } from "../map/MapCanvas";

interface TelaoMapViewerProps {
  mapData: TacticalMapSyncData | null;
}

export function TelaoMapViewer({ mapData }: TelaoMapViewerProps) {
  if (!mapData || !mapData.isProjected || !mapData.imageUrl) {
    return null;
  }

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
      />

      {/* Título discreto do mapa no canto superior da TV */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="px-2.5 py-1 rounded-md bg-black/70 border border-white/10 text-white font-mono text-[11px] backdrop-blur-xs">
          Mapa: {mapData.title}
        </span>
      </div>
    </div>
  );
}
