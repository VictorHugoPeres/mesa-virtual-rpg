"use client";

import { useCallback } from "react";
import { TacticalMapData, CameraState, DEFAULT_CAMERA, MapDisplayMode } from "./mapTypes";
import { TacticalMapSyncData } from "../sync/syncTypes";
import { MapElement } from "./elements/elementTypes";
import { FogMapState, serializeFogState } from "./fog/fogTypes";

interface UseMapBroadcastProps {
  campaignId: string;
  emit: (type: any, payload: any) => void;
  displayMode: MapDisplayMode;
  secondaryMapId: string;
  secondaryMap?: TacticalMapData;
  cameras: Record<string, CameraState>;
  getElementsByMap: (id: string) => MapElement[];
  getFogByMap: (id: string) => FogMapState;
}

export function useMapBroadcast({
  campaignId,
  emit,
  displayMode,
  secondaryMapId,
  secondaryMap,
  cameras,
  getElementsByMap,
  getFogByMap,
}: UseMapBroadcastProps) {
  const broadcastMapState = useCallback(
    async (
      map: TacticalMapData,
      projected: boolean,
      overrideMode?: MapDisplayMode,
      overrideSecId?: string,
      overrideSecMap?: TacticalMapData | null
    ) => {
      const mode = overrideMode ?? displayMode;
      const secId = overrideSecId ?? secondaryMapId;
      const effectiveSec = overrideSecMap !== undefined ? overrideSecMap : secondaryMap;
      const secCam = effectiveSec ? cameras[effectiveSec.id] || DEFAULT_CAMERA : DEFAULT_CAMERA;

      const secData: TacticalMapSyncData | null =
        mode === "split" && effectiveSec
          ? {
              id: effectiveSec.id,
              title: effectiveSec.title,
              imageUrl: effectiveSec.imageUrl,
              gridEnabled: effectiveSec.gridEnabled,
              gridSize: effectiveSec.gridSize,
              gridColor: effectiveSec.gridColor,
              gridOpacity: effectiveSec.gridOpacity,
              metersPerGrid: effectiveSec.metersPerGrid,
              cameraState: secCam,
              elementsData: JSON.stringify(getElementsByMap(effectiveSec.id)),
              fogData: serializeFogState(getFogByMap(effectiveSec.id)),
              isProjected: true,
              displayMode: "fit",
            }
          : null;

      const primaryCam = cameras[map.id] || DEFAULT_CAMERA;
      const payload: TacticalMapSyncData = {
        id: map.id,
        title: map.title,
        imageUrl: map.imageUrl,
        gridEnabled: map.gridEnabled,
        gridSize: map.gridSize,
        gridColor: map.gridColor,
        gridOpacity: map.gridOpacity,
        metersPerGrid: map.metersPerGrid,
        cameraState: primaryCam,
        elementsData: JSON.stringify(getElementsByMap(map.id)),
        fogData: serializeFogState(getFogByMap(map.id)),
        isProjected: projected,
        displayMode: mode,
        secondaryMapId: mode === "split" ? secId : null,
        secondaryMapData: projected ? secData : null,
      };

      emit("MAP_UPDATE", payload);

      try {
        await fetch(`/api/campaigns/${campaignId}/maps/active`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mapData: projected ? payload : null }),
        });
      } catch (err) {
        console.warn("Erro ao salvar mapa ativo no banco:", err);
      }
    },
    [campaignId, emit, displayMode, secondaryMapId, secondaryMap, cameras, getElementsByMap, getFogByMap]
  );

  return { broadcastMapState };
}
