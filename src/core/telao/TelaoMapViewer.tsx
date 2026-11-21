"use client";

import { TacticalMapSyncData } from "../sync/syncTypes";
import { SingleTelaoMapPanel } from "./SingleTelaoMapPanel";

interface TelaoMapViewerProps {
  mapData: TacticalMapSyncData | null;
}

export function TelaoMapViewer({ mapData }: TelaoMapViewerProps) {
  if (!mapData || !mapData.isProjected || !mapData.imageUrl) {
    return null;
  }

  const isSplitMode =
    mapData.displayMode === "split" &&
    mapData.secondaryMapData &&
    Boolean(mapData.secondaryMapData.imageUrl);

  if (isSplitMode && mapData.secondaryMapData) {
    return (
      <div className="absolute inset-0 z-10 w-full h-full bg-[#050508] grid grid-cols-2 divide-x-2 divide-emerald-500/30 animate-in fade-in duration-300">
        <SingleTelaoMapPanel
          mapData={mapData}
          displayMode="fit"
          labelPrefix="Mapa 1"
        />
        <SingleTelaoMapPanel
          mapData={mapData.secondaryMapData}
          displayMode="fit"
          labelPrefix="Mapa 2"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-10 w-full h-full bg-[#050508] animate-in fade-in duration-300">
      <SingleTelaoMapPanel
        mapData={mapData}
        displayMode={mapData.displayMode === "follow" ? "follow" : "fit"}
      />
    </div>
  );
}
