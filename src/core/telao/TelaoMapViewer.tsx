"use client";

import { TacticalMapSyncData, TacticalRulerData } from "../sync/syncTypes";
import { SingleTelaoMapPanel } from "./SingleTelaoMapPanel";

interface TelaoMapViewerProps {
  mapData: TacticalMapSyncData | null;
  rulersByMap?: Record<string, TacticalRulerData | null>;
}

export function TelaoMapViewer({ mapData, rulersByMap }: TelaoMapViewerProps) {
  if (!mapData || !mapData.isProjected || !mapData.imageUrl) {
    return null;
  }

  const isSplitMode =
    mapData.displayMode === "split" &&
    mapData.secondaryMapData &&
    Boolean(mapData.secondaryMapData.imageUrl);

  if (isSplitMode && mapData.secondaryMapData) {
    return (
      <div className="absolute inset-0 z-10 w-full h-full bg-[#0B0C0E] grid grid-cols-2 divide-x-2 divide-[#23272F] animate-in fade-in duration-300">
        <SingleTelaoMapPanel
          mapData={mapData}
          displayMode="fit"
          labelPrefix="Mapa 1"
          ruler={rulersByMap?.[mapData.id] || null}
        />
        <SingleTelaoMapPanel
          mapData={mapData.secondaryMapData}
          displayMode="fit"
          labelPrefix="Mapa 2"
          ruler={rulersByMap?.[mapData.secondaryMapData.id] || null}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-10 w-full h-full bg-[#0B0C0E] animate-in fade-in duration-300">
      <SingleTelaoMapPanel
        mapData={mapData}
        displayMode={mapData.displayMode === "follow" ? "follow" : "fit"}
        ruler={rulersByMap?.[mapData.id] || null}
      />
    </div>
  );
}
