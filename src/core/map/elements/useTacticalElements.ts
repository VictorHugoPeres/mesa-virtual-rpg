"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapElement } from "./elementTypes";
import { TacticalMapData } from "../mapTypes";
import { useCampaignSync } from "../../sync/useCampaignSync";

interface UseTacticalElementsProps {
  campaignId: string;
  selectedMap: TacticalMapData | undefined;
  isProjected: boolean;
}

export function useTacticalElements({
  campaignId,
  selectedMap,
  isProjected,
}: UseTacticalElementsProps) {
  const [elements, setElements] = useState<MapElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { emit } = useCampaignSync({ campaignId });

  // Carrega elementos quando o mapa selecionado muda
  useEffect(() => {
    if (!selectedMap) {
      setElements([]);
      setSelectedElementId(null);
      return;
    }
    try {
      if (selectedMap.elementsData) {
        const parsed = JSON.parse(selectedMap.elementsData);
        if (Array.isArray(parsed)) {
          setElements(parsed);
          return;
        }
      }
    } catch (err) {
      console.warn("Erro ao fazer parse dos elementos do mapa:", err);
    }
    setElements([]);
    setSelectedElementId(null);
  }, [selectedMap?.id, selectedMap?.elementsData]);

  // Salva no banco com debounce e emite via sync
  const persistAndBroadcast = useCallback(
    (newElements: MapElement[]) => {
      if (!selectedMap) return;

      const jsonStr = JSON.stringify(newElements);

      // Emite sincronização em tempo real para o Telão
      emit("MAP_ELEMENTS_UPDATE", {
        mapId: selectedMap.id,
        elementsData: jsonStr,
      });

      // Salva no SQLite via PUT
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          await fetch(`/api/campaigns/${campaignId}/maps/${selectedMap.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ elementsData: jsonStr }),
          });
        } catch (err) {
          console.warn("Erro ao salvar elementos do mapa:", err);
        }
      }, 500);
    },
    [campaignId, selectedMap, emit]
  );

  const addElement = useCallback(
    (elem: MapElement) => {
      setElements((prev) => {
        const next = [...prev, elem];
        persistAndBroadcast(next);
        return next;
      });
      setSelectedElementId(elem.id);
    },
    [persistAndBroadcast]
  );

  // Atualização direta por botões da toolbar/modal (salva e transmite)
  const updateElement = useCallback(
    (updated: MapElement) => {
      setElements((prev) => {
        const next = prev.map((el) => (el.id === updated.id ? updated : el));
        persistAndBroadcast(next);
        return next;
      });
    },
    [persistAndBroadcast]
  );

  // Atualização puramente visual durante o arraste (ZERO rede, 60fps)
  const updateElementVisual = useCallback((updated: MapElement) => {
    setElements((prev) => prev.map((el) => (el.id === updated.id ? updated : el)));
  }, []);

  // Confirmação final ao soltar o mouse (salva e transmite apenas uma vez)
  const commitElementMove = useCallback(
    (finalElem: MapElement) => {
      setElements((prev) => {
        const next = prev.map((el) => (el.id === finalElem.id ? finalElem : el));
        persistAndBroadcast(next);
        return next;
      });
    },
    [persistAndBroadcast]
  );

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prev) => {
        const next = prev.filter((el) => el.id !== id);
        persistAndBroadcast(next);
        return next;
      });
      setSelectedElementId(null);
    },
    [persistAndBroadcast]
  );

  return {
    elements,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElement,
    updateElementVisual,
    commitElementMove,
    deleteElement,
  };
}
