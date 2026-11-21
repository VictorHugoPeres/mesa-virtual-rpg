"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Map as MapIcon, Plus } from "lucide-react";
import { TacticalMapData, CameraState, DEFAULT_CAMERA, MapDisplayMode } from "./mapTypes";
import { MapHeaderBar } from "./MapHeaderBar";
import { SplitEditingToolbar } from "./SplitEditingToolbar";
import { MapEditorCanvas } from "./MapEditorCanvas";
import { AddMapModal } from "./AddMapModal";
import { AddElementDrawer } from "./elements/AddElementDrawer";
import { useTacticalElements } from "./elements/useTacticalElements";
import { useCampaignSync } from "../sync/useCampaignSync";
import { TacticalMapSyncData } from "../sync/syncTypes";

interface TacticalMapWorkspaceProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TacticalMapWorkspace({
  campaignId,
  isOpen,
  onClose,
}: TacticalMapWorkspaceProps) {
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
    [campaignId, emit, displayMode, secondaryMapId, secondaryMap, cameras, getElementsByMap]
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
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
            <MapIcon className="w-16 h-16 mb-3 opacity-20 text-emerald-400" />
            <h3 className="text-base font-bold text-white mb-1">Nenhum mapa cadastrado</h3>
            <p className="text-xs max-w-sm mb-4">
              Crie o seu primeiro mapa de batalha fazendo upload de uma imagem ou colando um link.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Criar Primeiro Mapa
            </button>
          </div>
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
