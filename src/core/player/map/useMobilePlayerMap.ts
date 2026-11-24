"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TacticalMapSyncData, SyncEvent } from "@/core/sync/syncTypes";
import { useCampaignSync } from "@/core/sync/useCampaignSync";
import { MapElement } from "@/core/map/elements/elementTypes";
import { FogMapState, parseFogState } from "@/core/map/fog/fogTypes";

interface UseMobilePlayerMapProps {
  campaignId: string;
  characterId: string;
}

export function useMobilePlayerMap({ campaignId, characterId }: UseMobilePlayerMapProps) {
  const [activeMap, setActiveMap] = useState<TacticalMapSyncData | null>(null);
  const [selectedMapIndex, setSelectedMapIndex] = useState<0 | 1>(0);
  const [elementsByMap, setElementsByMap] = useState<Record<string, MapElement[]>>({});
  const [fogByMap, setFogByMap] = useState<Record<string, FogMapState>>({});
  const [tapToMove, setTapToMove] = useState(false);
  const [lastDistance, setLastDistance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ID único deste cliente para evitar loops no SSE
  const clientIdRef = useRef<string>(`mobile-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);

  // Extrai elementos e névoa de um objeto TacticalMapSyncData
  const syncMapDataIntoState = useCallback((syncData: TacticalMapSyncData | null) => {
    if (!syncData) return;
    const updateOne = (m: TacticalMapSyncData) => {
      if (m.elementsData) {
        try {
          const parsed = JSON.parse(m.elementsData);
          if (Array.isArray(parsed)) {
            setElementsByMap((prev) => ({ ...prev, [m.id]: parsed }));
          }
        } catch {}
      }
      if (m.fogData) {
        setFogByMap((prev) => ({ ...prev, [m.id]: parseFogState(m.fogData) }));
      }
    };

    updateOne(syncData);
    if (syncData.secondaryMapData) {
      updateOne(syncData.secondaryMapData);
    }
  }, []);

  // 1. Busca inicial da projeção ativa com AbortController
  useEffect(() => {
    const abortController = new AbortController();
    async function loadActiveMap() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/maps/active`, {
          signal: abortController.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.activeMap) {
            setActiveMap(data.activeMap);
            syncMapDataIntoState(data.activeMap);

            // Se for split, foca no mapa que contém o token do jogador
            if (data.activeMap.displayMode === "split" && data.activeMap.secondaryMapData) {
              const secElements = data.activeMap.secondaryMapData.elementsData
                ? JSON.parse(data.activeMap.secondaryMapData.elementsData)
                : [];
              const hasInSec = secElements.some((el: MapElement) => el.characterId === characterId);
              if (hasInSec) setSelectedMapIndex(1);
            }
          }
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          console.warn("Aviso ao carregar mapa ativo mobile:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadActiveMap();
    return () => {
      abortController.abort();
    };
  }, [campaignId, characterId, syncMapDataIntoState]);

  // 2. Escuta eventos SSE em tempo real (Celular <-> PC <-> TV)
  const handleSyncEvent = useCallback(
    (event: SyncEvent) => {
      if (event.type === "MAP_UPDATE") {
        const payload = event.payload as TacticalMapSyncData | null;
        setActiveMap(payload);
        syncMapDataIntoState(payload);
      } else if (event.type === "MAP_ELEMENTS_UPDATE") {
        const payload = event.payload as { mapId: string; elementsData: string; senderId?: string };
        if (!payload?.mapId || !payload?.elementsData) return;
        // Ignora eco do próprio cliente se acabou de enviar
        if (payload.senderId && payload.senderId === clientIdRef.current) return;

        try {
          const parsed = JSON.parse(payload.elementsData);
          if (Array.isArray(parsed)) {
            setElementsByMap((prev) => ({
              ...prev,
              [payload.mapId]: parsed,
            }));
          }
        } catch {}
      } else if (event.type === "MAP_FOG_UPDATE") {
        const payload = event.payload as { mapId: string; fogData: string };
        if (!payload?.mapId || !payload?.fogData) return;
        setFogByMap((prev) => ({
          ...prev,
          [payload.mapId]: parseFogState(payload.fogData),
        }));
      }
    },
    [syncMapDataIntoState]
  );

  useCampaignSync({ campaignId, onEvent: handleSyncEvent });

  // Mapa atualmente selecionado para exibição no celular
  const currentMap = useMemo(() => {
    if (!activeMap) return null;
    if (activeMap.displayMode === "split" && selectedMapIndex === 1 && activeMap.secondaryMapData) {
      return activeMap.secondaryMapData;
    }
    return activeMap;
  }, [activeMap, selectedMapIndex]);

  const currentElements = useMemo(() => {
    if (!currentMap) return [];
    return elementsByMap[currentMap.id] || [];
  }, [currentMap, elementsByMap]);

  const currentFog = useMemo(() => {
    if (!currentMap) return parseFogState();
    return fogByMap[currentMap.id] || parseFogState(currentMap.fogData);
  }, [currentMap, fogByMap]);

  // Token do jogador no mapa atual
  const myToken = useMemo(() => {
    return currentElements.find((el) => el.characterId === characterId) || null;
  }, [currentElements, characterId]);

  // Movimentação atômica do token
  const moveToken = useCallback(
    async (elementId: string, newX: number, newY: number) => {
      if (!currentMap) return;

      const oldElem = currentElements.find((el) => el.id === elementId);
      if (!oldElem) return;

      // Cálculo de distância percorrida
      const dxPx = newX - oldElem.x;
      const dyPx = newY - oldElem.y;
      const distPx = Math.hypot(dxPx, dyPx);
      const gridCells = Math.round(distPx / (currentMap.gridSize || 50));
      const meters = ((distPx / (currentMap.gridSize || 50)) * (currentMap.metersPerGrid || 1.5)).toFixed(1);
      setLastDistance(`${meters}m (${gridCells}q)`);

      // 1. Atualização otimista imediata na tela do celular
      const updatedList = currentElements.map((el) =>
        el.id === elementId ? { ...el, x: newX, y: newY } : el
      );
      setElementsByMap((prev) => ({
        ...prev,
        [currentMap.id]: updatedList,
      }));

      // 2. Envio atômico para o backend via PATCH
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/maps/${currentMap.id}/move-token`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            elementId,
            characterId,
            x: newX,
            y: newY,
            senderId: clientIdRef.current,
          }),
        });

        if (!res.ok) {
          // Reverte em caso de erro de autorização ou falha de rede
          setElementsByMap((prev) => ({
            ...prev,
            [currentMap.id]: currentElements,
          }));
        }
      } catch (err) {
        console.warn("Falha de rede ao mover token:", err);
        setElementsByMap((prev) => ({
          ...prev,
          [currentMap.id]: currentElements,
        }));
      }
    },
    [campaignId, currentMap, currentElements, characterId]
  );

  return {
    activeMap,
    currentMap,
    selectedMapIndex,
    setSelectedMapIndex,
    currentElements,
    currentFog,
    myToken,
    moveToken,
    tapToMove,
    setTapToMove,
    lastDistance,
    isLoading,
  };
}
