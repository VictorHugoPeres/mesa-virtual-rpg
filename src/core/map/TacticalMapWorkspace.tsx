"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TacticalMapData, CameraState, DEFAULT_CAMERA, MapDisplayMode, MapToolMode } from "./mapTypes";
import { MapHeaderBar } from "./MapHeaderBar";
import { MapToolsToolbar } from "./MapToolsToolbar";
import { SplitEditingToolbar } from "./SplitEditingToolbar";
import { MapEditorCanvas } from "./MapEditorCanvas";
import { EmptyMapState } from "./EmptyMapState";
import { AddMapModal } from "./AddMapModal";
import { AddElementDrawer } from "./elements/AddElementDrawer";
import { useTacticalElements } from "./elements/useTacticalElements";
import { useTacticalFog } from "./fog/useTacticalFog";
import { useTacticalRuler } from "./ruler/useTacticalRuler";
import { serializeFogState } from "./fog/fogTypes";
import { useCampaignSync } from "../sync/useCampaignSync";
import { TacticalMapSyncData } from "../sync/syncTypes";

interface TacticalMapWorkspaceProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TacticalMapWorkspace({ campaignId, isOpen, onClose }: TacticalMapWorkspaceProps) {
  const [maps, setMaps] = useState<TacticalMapData[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string>("");
  const [secondaryMapId, setSecondaryMapId] = useState<string>("");
  const [activeEditSlot, setActiveEditSlot] = useState<1 | 2>(1);
  const [gmSplitView, setGmSplitView] = useState(false);
  const [displayMode, setDisplayMode] = useState<MapDisplayMode>("fit");
  const [cameras, setCameras] = useState<Record<string, CameraState>>({});
  const [isProjected, setIsProjected] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showElementsDrawer, setShowElementsDrawer] = useState(false);

  // Ferramentas Etapa 3C
  const [toolMode, setToolMode] = useState<MapToolMode>("select");
  const [brushSize, setBrushSize] = useState<number>(1);

  const { emit } = useCampaignSync({ campaignId });
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cameraSyncTimerRef = useRef<NodeJS.Timeout | null>(null);

  const primaryMap = maps.find((m) => m.id === selectedMapId) || maps[0];
  const secondaryMap = maps.find((m) => m.id === secondaryMapId);
  const currentEditingMap = activeEditSlot === 2 && secondaryMap ? secondaryMap : primaryMap;

  const {
    getElementsByMap,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElement,
    updateElementVisual,
    commitElementMove,
    deleteElement,
    transferElement,
  } = useTacticalElements({ campaignId, maps });

  const { getFogByMap, coverAll, revealAll, paintCells, commitFog } = useTacticalFog({
    campaignId,
    maps,
  });

  const {
    getRulerByMap,
    shape: rulerShape,
    setShape: setRulerShape,
    showOnTv: showRulerOnTv,
    toggleShowOnTv: toggleShowRulerOnTv,
    updateRuler,
    clearRuler,
  } = useTacticalRuler({ campaignId });

  const loadMaps = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/maps`);
      if (!res.ok) return;
      const data = await res.json();
      const list = data.maps || [];
      setMaps(list);
      if (list.length > 0 && !selectedMapId) {
        setSelectedMapId(list[0].id);
      }
    } catch (err) {
      console.warn("Erro ao carregar mapas:", err);
    }
  }, [campaignId, selectedMapId]);

  useEffect(() => {
    if (!isOpen) return;
    loadMaps();

    async function checkActiveMap() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/maps/active`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.activeMap?.isProjected) {
          setIsProjected(true);
          if (data.activeMap.id) setSelectedMapId(data.activeMap.id);
          if (data.activeMap.displayMode) setDisplayMode(data.activeMap.displayMode);
          if (data.activeMap.secondaryMapId) setSecondaryMapId(data.activeMap.secondaryMapId);
        }
      } catch (err) {
        console.warn("Erro ao buscar mapa ativo:", err);
      }
    }
    checkActiveMap();
  }, [isOpen, campaignId, loadMaps]);

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

  function handleGridChange(updates: Partial<TacticalMapData>) {
    if (!currentEditingMap) return;
    const targetId = currentEditingMap.id;

    setMaps((prev) => {
      const nextMaps = prev.map((m) => (m.id === targetId ? { ...m, ...updates } : m));
      const updatedPrimary = nextMaps.find((m) => m.id === selectedMapId) || nextMaps[0];
      const updatedSecondary = nextMaps.find((m) => m.id === secondaryMapId);

      if (isProjected && updatedPrimary) {
        broadcastMapState(updatedPrimary, true, undefined, undefined, updatedSecondary);
      }
      return nextMaps;
    });

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/campaigns/${campaignId}/maps/${targetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.warn("Erro ao salvar ajustes do mapa:", err);
      }
    }, 600);
  }

  function handleCameraChange(newCam: CameraState) {
    if (!currentEditingMap) return;
    setCameras((prev) => ({ ...prev, [currentEditingMap.id]: newCam }));

    if (isProjected && primaryMap && displayMode === "follow" && currentEditingMap.id === primaryMap.id) {
      if (cameraSyncTimerRef.current) clearTimeout(cameraSyncTimerRef.current);
      cameraSyncTimerRef.current = setTimeout(() => {
        broadcastMapState(primaryMap, true);
      }, 120);
    }
  }

  if (!isOpen) return null;

  const currentCam = currentEditingMap ? cameras[currentEditingMap.id] || DEFAULT_CAMERA : DEFAULT_CAMERA;

  const renderEditor = (map: TacticalMapData, slot: 1 | 2, isSplit: boolean) => (
    <MapEditorCanvas
      map={map}
      campaignId={campaignId}
      camera={cameras[map.id] || DEFAULT_CAMERA}
      onCameraChange={(cam) => setCameras((p) => ({ ...p, [map.id]: cam }))}
      onGridChange={handleGridChange}
      elements={getElementsByMap(map.id)}
      selectedElementId={selectedElementId}
      onSelectElement={setSelectedElementId}
      onUpdateElement={(updated) => updateElement(map.id, updated)}
      onLocalMove={(updated) => updateElementVisual(map.id, updated)}
      onCommitMove={(updated) => commitElementMove(map.id, updated)}
      onDeleteElement={(id) => deleteElement(map.id, id)}
      availableMaps={maps.filter((m) => m.id !== map.id).map((m) => ({ id: m.id, title: m.title }))}
      onTransferElement={(elemId, targetId) => transferElement(map.id, targetId, elemId)}
      badge={isSplit || (displayMode === "split" && secondaryMap) ? `Slot ${slot}: ${map.title}` : undefined}
      isActive={activeEditSlot === slot}
      onActivate={() => setActiveEditSlot(slot)}
      toolMode={toolMode}
      fog={getFogByMap(map.id)}
      brushSize={brushSize}
      onPaintFog={(cells, mode) => paintCells(map.id, cells, mode)}
      onCommitFog={() => commitFog(map.id)}
      ruler={getRulerByMap(map.id)}
      rulerShape={rulerShape}
      showRulerOnTv={showRulerOnTv}
      onRulerChange={(r) => updateRuler(map.id, r)}
      onRulerCommit={(r) => updateRuler(map.id, r)}
    />
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050508] text-white animate-in fade-in duration-200">
      <MapHeaderBar
        maps={maps}
        selectedMapId={selectedMapId || ""}
        onSelectMapId={(id) => {
          setSelectedMapId(id);
          if (secondaryMapId === id) setSecondaryMapId("");
          setActiveEditSlot(1);
          setIsProjected(false);
        }}
        onOpenAddModal={() => setShowAddModal(true)}
        onOpenElementsDrawer={() => setShowElementsDrawer(true)}
        isProjected={isProjected}
        onToggleProjection={() => {
          if (!primaryMap) return;
          const nextState = !isProjected;
          setIsProjected(nextState);
          broadcastMapState(primaryMap, nextState);
        }}
        displayMode={displayMode}
        onDisplayModeChange={(newMode) => {
          setDisplayMode(newMode);
          if (newMode !== "split") setActiveEditSlot(1);
          if (isProjected && primaryMap) broadcastMapState(primaryMap, true, newMode);
        }}
        secondaryMapId={secondaryMapId}
        onSecondaryMapIdChange={(newSecId) => {
          setSecondaryMapId(newSecId);
          if (isProjected && primaryMap && displayMode === "split") {
            broadcastMapState(primaryMap, true, "split", newSecId);
          }
        }}
        campaignId={campaignId}
        onClose={onClose}
      />

      {displayMode === "split" && secondaryMap && (
        <SplitEditingToolbar
          map1Title={primaryMap?.title || "Mapa 1"}
          map2Title={secondaryMap.title}
          activeEditSlot={activeEditSlot}
          onSelectSlot={(slot) => setActiveEditSlot(slot)}
          gmSplitView={gmSplitView}
          onToggleGmSplitView={() => setGmSplitView(!gmSplitView)}
        />
      )}

      <div className="relative flex-1 w-full h-full overflow-hidden">
        {currentEditingMap ? (
          gmSplitView && displayMode === "split" && secondaryMap ? (
            <div className="grid grid-cols-2 w-full h-full divide-x-2 divide-emerald-500/40">
              {renderEditor(primaryMap, 1, true)}
              {renderEditor(secondaryMap, 2, true)}
            </div>
          ) : (
            renderEditor(currentEditingMap, activeEditSlot, false)
          )
        ) : (
          <EmptyMapState onOpenAddModal={() => setShowAddModal(true)} />
        )}

        {/* Barra de Ferramentas Flutuante: Selecionar, Névoa e Régua */}
        {currentEditingMap && (
          <MapToolsToolbar
            activeTool={toolMode}
            onSelectTool={setToolMode}
            onCoverAll={() => coverAll(currentEditingMap.id)}
            onRevealAll={() => revealAll(currentEditingMap.id)}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            rulerShape={rulerShape}
            onRulerShapeChange={setRulerShape}
            showRulerOnTv={showRulerOnTv}
            onToggleShowRulerOnTv={toggleShowRulerOnTv}
            onClearRuler={() => clearRuler(currentEditingMap.id)}
          />
        )}
      </div>

      <AddMapModal
        campaignId={campaignId}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadMaps}
      />

      <AddElementDrawer
        campaignId={campaignId}
        isOpen={showElementsDrawer}
        onClose={() => setShowElementsDrawer(false)}
        onAddElement={(elem) => {
          if (currentEditingMap) addElement(currentEditingMap.id, elem);
        }}
        spawnPosition={{
          x: Math.round(-currentCam.panX / currentCam.zoom + 250),
          y: Math.round(-currentCam.panY / currentCam.zoom + 200),
        }}
      />
    </div>
  );
}
