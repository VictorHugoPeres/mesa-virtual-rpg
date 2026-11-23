"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useMobilePlayerMap } from "./map/useMobilePlayerMap";
import { MobileMapToolbar } from "./map/MobileMapToolbar";
import { MobileInteractiveCanvas } from "./map/MobileInteractiveCanvas";
import { MobileEmptyMapState } from "./map/MobileEmptyMapState";
import { Loader2 } from "lucide-react";

interface MobileTabMapaProps {
  campaignId: string;
  characterId: string;
  characterName: string;
}

export function MobileTabMapa({
  campaignId,
  characterId,
  characterName: _characterName,
}: MobileTabMapaProps) {
  const {
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
  } = useMobilePlayerMap({ campaignId, characterId });

  const containerRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState({ zoom: 1, panX: 0, panY: 0 });
  const hasAutoCenteredRef = useRef(false);

  // Centraliza a visão do celular no token do jogador
  const centerOnMyToken = useCallback(() => {
    if (!myToken || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const tokenCenterX = myToken.x + 25;
    const tokenCenterY = myToken.y + 25;

    const panX = rect.width / 2 - tokenCenterX * camera.zoom;
    const panY = rect.height / 2 - tokenCenterY * camera.zoom;
    setCamera((prev) => ({ ...prev, panX, panY }));
  }, [myToken, camera.zoom]);

  // Centraliza automaticamente na primeira vez que o token é detectado
  useEffect(() => {
    if (myToken && !hasAutoCenteredRef.current) {
      hasAutoCenteredRef.current = true;
      centerOnMyToken();
    }
  }, [myToken, centerOnMyToken]);

  const handleZoomIn = useCallback(() => {
    setCamera((prev) => ({ ...prev, zoom: Math.min(3, prev.zoom * 1.25) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setCamera((prev) => ({ ...prev, zoom: Math.max(0.2, prev.zoom * 0.8) }));
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-zinc-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        <span className="text-xs font-medium">Sincronizando mapa tático...</span>
      </div>
    );
  }

  if (!activeMap || !activeMap.isProjected || !activeMap.imageUrl || !currentMap) {
    return <MobileEmptyMapState />;
  }

  const isSplit = activeMap.displayMode === "split" && Boolean(activeMap.secondaryMapData?.imageUrl);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100dvh-125px)] overflow-hidden rounded-2xl border border-zinc-800 bg-[#050508] shadow-2xl"
    >
      <MobileMapToolbar
        isSplit={isSplit}
        selectedMapIndex={selectedMapIndex}
        onSelectMapIndex={setSelectedMapIndex}
        map1Title={activeMap.title}
        map2Title={activeMap.secondaryMapData?.title}
        tapToMove={tapToMove}
        onToggleTapToMove={() => setTapToMove((prev) => !prev)}
        onCenterMyToken={centerOnMyToken}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        lastDistance={lastDistance}
      />

      <MobileInteractiveCanvas
        mapData={currentMap}
        elements={currentElements}
        fog={currentFog}
        myToken={myToken}
        characterId={characterId}
        tapToMove={tapToMove}
        onMoveMyToken={moveToken}
        camera={camera}
        onCameraChange={setCamera}
      />
    </div>
  );
}
