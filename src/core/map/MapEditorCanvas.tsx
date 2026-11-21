"use client";

import { MapCanvas } from "./MapCanvas";
import { ElementsLayer } from "./elements/ElementsLayer";
import { GridControlsOverlay } from "./GridControlsOverlay";
import { CameraControlsOverlay } from "./CameraControlsOverlay";
import { TacticalMapData, CameraState } from "./mapTypes";
import { MapElement } from "./elements/elementTypes";

interface MapEditorCanvasProps {
  map: TacticalMapData;
  campaignId: string;
  camera: CameraState;
  onCameraChange: (cam: CameraState) => void;
  onGridChange: (updates: Partial<TacticalMapData>) => void;
  elements: MapElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (updated: MapElement) => void;
  onLocalMove?: (updated: MapElement) => void;
  onCommitMove?: (updated: MapElement) => void;
  onDeleteElement: (id: string) => void;
  availableMaps?: { id: string; title: string }[];
  onTransferElement?: (elementId: string, targetMapId: string) => void;
  badge?: string;
  isActive?: boolean;
  onActivate?: () => void;
}

export function MapEditorCanvas({
  map,
  campaignId,
  camera,
  onCameraChange,
  onGridChange,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onLocalMove,
  onCommitMove,
  onDeleteElement,
  availableMaps,
  onTransferElement,
  badge,
  isActive = true,
  onActivate,
}: MapEditorCanvasProps) {
  return (
    <div
      onClick={onActivate}
      className={`relative w-full h-full overflow-hidden transition-all ${
        isActive ? "ring-2 ring-emerald-500/60" : "opacity-80 hover:opacity-100"
      }`}
    >
      <MapCanvas
        imageUrl={map.imageUrl}
        gridEnabled={map.gridEnabled}
        gridSize={map.gridSize}
        gridColor={map.gridColor}
        gridOpacity={map.gridOpacity}
        camera={camera}
        onCameraChange={onCameraChange}
        onClick={() => onSelectElement(null)}
      >
        <ElementsLayer
          campaignId={campaignId}
          elements={elements}
          gridSize={map.gridSize}
          cameraZoom={camera.zoom}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          onUpdateElement={onUpdateElement}
          onLocalMove={onLocalMove}
          onCommitMove={onCommitMove}
          onDeleteElement={onDeleteElement}
          availableMaps={availableMaps}
          onTransferElement={onTransferElement}
          interactive={isActive}
        />
      </MapCanvas>

      <GridControlsOverlay
        gridEnabled={map.gridEnabled}
        gridSize={map.gridSize}
        gridColor={map.gridColor}
        gridOpacity={map.gridOpacity}
        metersPerGrid={map.metersPerGrid}
        onChange={onGridChange}
      />

      <CameraControlsOverlay camera={camera} onChange={onCameraChange} />

      {badge && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${
              isActive
                ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/60 ring-2 ring-emerald-500/30"
                : "bg-black/80 text-zinc-400 border-white/10"
            }`}
          >
            {badge} {isActive ? "• Ativo" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
