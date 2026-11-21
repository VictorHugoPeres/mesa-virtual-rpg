"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapElement } from "./elementTypes";
import { TacticalMapData } from "../mapTypes";
import { useCampaignSync } from "../../sync/useCampaignSync";

interface UseTacticalElementsProps {
  campaignId: string;
  maps: TacticalMapData[];
}

export function useTacticalElements({ campaignId, maps }: UseTacticalElementsProps) {
  const [elementsByMap, setElementsByMap] = useState<Record<string, MapElement[]>>({});
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const saveTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const { emit } = useCampaignSync({ campaignId });

  // Inicializa ou sincroniza os elementos de cada mapa a partir de maps
  useEffect(() => {
    setElementsByMap((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const m of maps) {
        if (!next[m.id]) {
          try {
            const parsed = m.elementsData ? JSON.parse(m.elementsData) : [];
            next[m.id] = Array.isArray(parsed) ? parsed : [];
            changed = true;
          } catch {
            next[m.id] = [];
            changed = true;
          }
        }
      }
      return changed ? next : prev;
    });
  }, [maps]);

  const getElementsByMap = useCallback(
    (mapId: string): MapElement[] => {
      return elementsByMap[mapId] || [];
    },
    [elementsByMap]
  );

  const persistAndBroadcast = useCallback(
    (mapId: string, newElements: MapElement[]) => {
      const jsonStr = JSON.stringify(newElements);

      // Emite sincronização isolada para o Telão com mapId específico
      emit("MAP_ELEMENTS_UPDATE", { mapId, elementsData: jsonStr });

      // Salva no SQLite via PUT com debounce por mapa
      if (saveTimersRef.current[mapId]) {
        clearTimeout(saveTimersRef.current[mapId]);
      }

      saveTimersRef.current[mapId] = setTimeout(async () => {
        try {
          await fetch(`/api/campaigns/${campaignId}/maps/${mapId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ elementsData: jsonStr }),
          });
        } catch (err) {
          console.warn(`Erro ao salvar elementos do mapa ${mapId}:`, err);
        }
      }, 500);
    },
    [campaignId, emit]
  );

  const addElement = useCallback(
    (mapId: string, elem: MapElement) => {
      setElementsByMap((prev) => {
        const current = prev[mapId] || [];
        const next = [...current, elem];
        persistAndBroadcast(mapId, next);
        return { ...prev, [mapId]: next };
      });
      setSelectedElementId(elem.id);
    },
    [persistAndBroadcast]
  );

  const updateElement = useCallback(
    (mapId: string, updated: MapElement) => {
      setElementsByMap((prev) => {
        const current = prev[mapId] || [];
        const next = current.map((el) => (el.id === updated.id ? updated : el));
        persistAndBroadcast(mapId, next);
        return { ...prev, [mapId]: next };
      });
    },
    [persistAndBroadcast]
  );

  // Arraste visual puro (ZERO rede, 60fps)
  const updateElementVisual = useCallback((mapId: string, updated: MapElement) => {
    setElementsByMap((prev) => {
      const current = prev[mapId] || [];
      const next = current.map((el) => (el.id === updated.id ? updated : el));
      return { ...prev, [mapId]: next };
    });
  }, []);

  // Confirmação ao soltar o clique
  const commitElementMove = useCallback(
    (mapId: string, finalElem: MapElement) => {
      setElementsByMap((prev) => {
        const current = prev[mapId] || [];
        const next = current.map((el) => (el.id === finalElem.id ? finalElem : el));
        persistAndBroadcast(mapId, next);
        return { ...prev, [mapId]: next };
      });
    },
    [persistAndBroadcast]
  );

  const deleteElement = useCallback(
    (mapId: string, id: string) => {
      setElementsByMap((prev) => {
        const current = prev[mapId] || [];
        const next = current.filter((el) => el.id !== id);
        persistAndBroadcast(mapId, next);
        return { ...prev, [mapId]: next };
      });
      setSelectedElementId(null);
    },
    [persistAndBroadcast]
  );

  const transferElement = useCallback(
    async (sourceMapId: string, targetMapId: string, elementId: string) => {
      if (!sourceMapId || !targetMapId || sourceMapId === targetMapId) return;

      let movedElem: MapElement | undefined;
      let newSource: MapElement[] = [];
      let newTarget: MapElement[] = [];

      setElementsByMap((prev) => {
        const srcList = prev[sourceMapId] || [];
        const dstList = prev[targetMapId] || [];
        movedElem = srcList.find((el) => el.id === elementId);
        if (!movedElem) return prev;

        newSource = srcList.filter((el) => el.id !== elementId);
        newTarget = [...dstList, { ...movedElem }];

        return {
          ...prev,
          [sourceMapId]: newSource,
          [targetMapId]: newTarget,
        };
      });

      if (!movedElem) return;

      setSelectedElementId(null);

      // Transmite atualizações imediatas para ambos os mapas na TV
      emit("MAP_ELEMENTS_UPDATE", { mapId: sourceMapId, elementsData: JSON.stringify(newSource) });
      emit("MAP_ELEMENTS_UPDATE", { mapId: targetMapId, elementsData: JSON.stringify(newTarget) });

      // Salva imediatamente no banco para ambos os mapas
      try {
        await Promise.all([
          fetch(`/api/campaigns/${campaignId}/maps/${sourceMapId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ elementsData: JSON.stringify(newSource) }),
          }),
          fetch(`/api/campaigns/${campaignId}/maps/${targetMapId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ elementsData: JSON.stringify(newTarget) }),
          }),
        ]);
      } catch (err) {
        console.warn("Erro ao salvar transferência de elemento:", err);
      }
    },
    [campaignId, emit]
  );

  return {
    elementsByMap,
    getElementsByMap,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElement,
    updateElementVisual,
    commitElementMove,
    deleteElement,
    transferElement,
  };
}
