"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FogMapState, DEFAULT_FOG_STATE, parseFogState, serializeFogState } from "./fogTypes";
import { TacticalMapData } from "../mapTypes";
import { useCampaignSync } from "../../sync/useCampaignSync";

interface UseTacticalFogProps {
  campaignId: string;
  maps: TacticalMapData[];
}

export function useTacticalFog({ campaignId, maps }: UseTacticalFogProps) {
  const [fogByMap, setFogByMap] = useState<Record<string, FogMapState>>({});
  const saveTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const { emit } = useCampaignSync({ campaignId });

  // Inicializa a névoa de cada mapa
  useEffect(() => {
    setFogByMap((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const m of maps) {
        if (!next[m.id]) {
          next[m.id] = parseFogState(m.fogData);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [maps]);

  const getFogByMap = useCallback(
    (mapId: string): FogMapState => {
      return fogByMap[mapId] || DEFAULT_FOG_STATE;
    },
    [fogByMap]
  );

  const persistAndBroadcast = useCallback(
    (mapId: string, newState: FogMapState) => {
      const serialized = serializeFogState(newState);

      // Emite sincronização em tempo real para o Telão
      emit("MAP_FOG_UPDATE", { mapId, fogData: serialized });

      // Salva no SQLite com debounce
      if (saveTimersRef.current[mapId]) {
        clearTimeout(saveTimersRef.current[mapId]);
      }

      saveTimersRef.current[mapId] = setTimeout(async () => {
        try {
          await fetch(`/api/campaigns/${campaignId}/maps/${mapId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fogData: serialized }),
          });
        } catch (err) {
          console.warn(`Erro ao salvar névoa do mapa ${mapId}:`, err);
        }
      }, 500);
    },
    [campaignId, emit]
  );

  // Botão Rápido: Cobrir Mapa Inteiro
  const coverAll = useCallback(
    (mapId: string) => {
      const newState: FogMapState = { baseMode: "covered", cells: [] };
      setFogByMap((prev) => ({ ...prev, [mapId]: newState }));
      persistAndBroadcast(mapId, newState);
    },
    [persistAndBroadcast]
  );

  // Botão Rápido: Revelar Tudo
  const revealAll = useCallback(
    (mapId: string) => {
      const newState: FogMapState = { baseMode: "revealed", cells: [] };
      setFogByMap((prev) => ({ ...prev, [mapId]: newState }));
      persistAndBroadcast(mapId, newState);
    },
    [persistAndBroadcast]
  );

  // Pincel ao vivo: atualiza apenas o estado local (60fps, zero rede)
  const paintCells = useCallback(
    (mapId: string, cellKeys: string[], mode: "reveal" | "hide") => {
      setFogByMap((prev) => {
        const current = prev[mapId] || DEFAULT_FOG_STATE;
        const currentSet = new Set(current.cells);
        let hasChanges = false;

        if (mode === "reveal") {
          // Revelar: se baseMode for covered, adiciona aos revelados; se for revealed, remove dos cobertos
          if (current.baseMode === "covered") {
            for (const key of cellKeys) {
              if (!currentSet.has(key)) {
                currentSet.add(key);
                hasChanges = true;
              }
            }
          } else {
            for (const key of cellKeys) {
              if (currentSet.has(key)) {
                currentSet.delete(key);
                hasChanges = true;
              }
            }
          }
        } else {
          // Cobrir: se baseMode for covered, remove dos revelados; se for revealed, adiciona aos cobertos
          if (current.baseMode === "covered") {
            for (const key of cellKeys) {
              if (currentSet.has(key)) {
                currentSet.delete(key);
                hasChanges = true;
              }
            }
          } else {
            for (const key of cellKeys) {
              if (!currentSet.has(key)) {
                currentSet.add(key);
                hasChanges = true;
              }
            }
          }
        }

        if (!hasChanges) return prev;
        return {
          ...prev,
          [mapId]: {
            ...current,
            cells: Array.from(currentSet),
          },
        };
      });
    },
    []
  );

  // Confirmação ao soltar o clique (salva e transmite apenas uma vez)
  const commitFog = useCallback(
    (mapId: string) => {
      setFogByMap((prev) => {
        const current = prev[mapId] || DEFAULT_FOG_STATE;
        persistAndBroadcast(mapId, current);
        return prev;
      });
    },
    [persistAndBroadcast]
  );

  return {
    fogByMap,
    getFogByMap,
    coverAll,
    revealAll,
    paintCells,
    commitFog,
  };
}
