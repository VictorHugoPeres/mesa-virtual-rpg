"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Map as MapIcon, Plus } from "lucide-react";
import { TacticalMapData, CameraState, DEFAULT_CAMERA } from "./mapTypes";
import { MapCanvas } from "./MapCanvas";
import { MapHeaderBar } from "./MapHeaderBar";
import { GridControlsOverlay } from "./GridControlsOverlay";
import { CameraControlsOverlay } from "./CameraControlsOverlay";
import { AddMapModal } from "./AddMapModal";
import { AddElementDrawer } from "./elements/AddElementDrawer";
import { ElementsLayer } from "./elements/ElementsLayer";
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
  const [camera, setCamera] = useState<CameraState>(DEFAULT_CAMERA);
  const [isProjected, setIsProjected] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showElementsDrawer, setShowElementsDrawer] = useState(false);

  const { emit } = useCampaignSync({ campaignId });
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cameraSyncTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedMap = maps.find((m) => m.id === selectedMapId) || maps[0];

  const {
    elements,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElement,
    updateElementVisual,
    commitElementMove,
    deleteElement,
  } = useTacticalElements({
    campaignId,
    selectedMap,
    isProjected,
  });

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
          if (data.activeMap.id) {
            setSelectedMapId(data.activeMap.id);
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar mapa ativo:", err);
      }
    }
    checkActiveMap();
  }, [isOpen, campaignId, loadMaps]);

  // Sincroniza projeção com o Telão
  const broadcastMapState = useCallback(
    async (map: TacticalMapData, projected: boolean, cam: CameraState) => {
      const payload: TacticalMapSyncData = {
        id: map.id,
        title: map.title,
        imageUrl: map.imageUrl,
        gridEnabled: map.gridEnabled,
        gridSize: map.gridSize,
        gridColor: map.gridColor,
        gridOpacity: map.gridOpacity,
        metersPerGrid: map.metersPerGrid,
        cameraState: cam,
        elementsData: JSON.stringify(elements),
        isProjected: projected,
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
    [campaignId, emit, elements]
  );

  function toggleProjection() {
    if (!selectedMap) return;
    const nextState = !isProjected;
    setIsProjected(nextState);
    broadcastMapState(selectedMap, nextState, camera);
  }

  function handleGridChange(updates: Partial<TacticalMapData>) {
    if (!selectedMap) return;
    const updated = { ...selectedMap, ...updates };

    setMaps((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

    if (isProjected) {
      broadcastMapState(updated, true, camera);
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/campaigns/${campaignId}/maps/${updated.id}`, {
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
    setCamera(newCam);
    if (isProjected && selectedMap) {
      if (cameraSyncTimerRef.current) clearTimeout(cameraSyncTimerRef.current);
      cameraSyncTimerRef.current = setTimeout(() => {
        broadcastMapState(selectedMap, true, newCam);
      }, 120);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050508] text-white animate-in fade-in duration-200">
      <MapHeaderBar
        maps={maps}
        selectedMapId={selectedMapId || ""}
        onSelectMapId={(id) => {
          setSelectedMapId(id);
          setCamera(DEFAULT_CAMERA);
          setIsProjected(false);
        }}
        onOpenAddModal={() => setShowAddModal(true)}
        onOpenElementsDrawer={() => setShowElementsDrawer(true)}
        isProjected={isProjected}
        onToggleProjection={toggleProjection}
        campaignId={campaignId}
        onClose={onClose}
      />

      <div className="relative flex-1 w-full h-full overflow-hidden">
        {selectedMap ? (
          <>
            <MapCanvas
              imageUrl={selectedMap.imageUrl}
              gridEnabled={selectedMap.gridEnabled}
              gridSize={selectedMap.gridSize}
              gridColor={selectedMap.gridColor}
              gridOpacity={selectedMap.gridOpacity}
              camera={camera}
              onCameraChange={handleCameraChange}
              onClick={() => setSelectedElementId(null)}
            >
              <ElementsLayer
                campaignId={campaignId}
                elements={elements}
                gridSize={selectedMap.gridSize}
                cameraZoom={camera.zoom}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={updateElement}
                onLocalMove={updateElementVisual}
                onCommitMove={commitElementMove}
                onDeleteElement={deleteElement}
                interactive={true}
              />
            </MapCanvas>

            <GridControlsOverlay
              gridEnabled={selectedMap.gridEnabled}
              gridSize={selectedMap.gridSize}
              gridColor={selectedMap.gridColor}
              gridOpacity={selectedMap.gridOpacity}
              metersPerGrid={selectedMap.metersPerGrid}
              onChange={handleGridChange}
            />

            <CameraControlsOverlay camera={camera} onChange={handleCameraChange} />
          </>
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
        onAddElement={addElement}
        spawnPosition={{
          x: Math.round(-camera.panX / camera.zoom + 250),
          y: Math.round(-camera.panY / camera.zoom + 200),
        }}
      />
    </div>
  );
}
