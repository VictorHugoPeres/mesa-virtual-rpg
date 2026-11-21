"use client";

import { useState, useCallback } from "react";
import { TacticalRulerData, RulerShape } from "./rulerTypes";
import { useCampaignSync } from "../../sync/useCampaignSync";

interface UseTacticalRulerProps {
  campaignId: string;
}

export function useTacticalRuler({ campaignId }: UseTacticalRulerProps) {
  const [rulerByMap, setRulerByMap] = useState<Record<string, TacticalRulerData | null>>({});
  const [shape, setShape] = useState<RulerShape>("line");
  const [showOnTv, setShowOnTv] = useState(false);
  const { emit } = useCampaignSync({ campaignId });

  const getRulerByMap = useCallback(
    (mapId: string): TacticalRulerData | null => {
      return rulerByMap[mapId] || null;
    },
    [rulerByMap]
  );

  const updateRuler = useCallback(
    (mapId: string, ruler: TacticalRulerData | null) => {
      setRulerByMap((prev) => ({ ...prev, [mapId]: ruler }));

      // Se ativado para mostrar na TV, emite em tempo real
      if (showOnTv) {
        emit("MAP_RULER_UPDATE", { mapId, ruler });
      }
    },
    [showOnTv, emit]
  );

  const clearRuler = useCallback(
    (mapId: string) => {
      setRulerByMap((prev) => ({ ...prev, [mapId]: null }));
      if (showOnTv) {
        emit("MAP_RULER_UPDATE", { mapId, ruler: null });
      }
    },
    [showOnTv, emit]
  );

  const toggleShowOnTv = useCallback(() => {
    setShowOnTv((prev) => {
      const next = !prev;
      // Se desativou a TV, limpa o ruler projetado
      if (!next) {
        for (const mapId of Object.keys(rulerByMap)) {
          emit("MAP_RULER_UPDATE", { mapId, ruler: null });
        }
      }
      return next;
    });
  }, [rulerByMap, emit]);

  return {
    getRulerByMap,
    shape,
    setShape,
    showOnTv,
    setShowOnTv,
    toggleShowOnTv,
    updateRuler,
    clearRuler,
  };
}
