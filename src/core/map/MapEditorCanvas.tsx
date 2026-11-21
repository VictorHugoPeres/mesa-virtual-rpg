"use client";

import { useState } from "react";
import { MapCanvas } from "./MapCanvas";
import { ElementsLayer } from "./elements/ElementsLayer";
import { ElementControlsOverlay } from "./elements/ElementControlsOverlay";
import { FogLayer } from "./fog/FogLayer";
import { RulerLayer } from "./ruler/RulerLayer";
import { GridControlsOverlay } from "./GridControlsOverlay";
import { CameraControlsOverlay } from "./CameraControlsOverlay";
import { TacticalMapData, CameraState, MapToolMode, RulerShape, TacticalRulerData } from "./mapTypes";
import { MapElement } from "./elements/elementTypes";
import { FogMapState } from "./fog/fogTypes";

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
  // Ferramentas da Etapa 3C
  toolMode?: MapToolMode;
  fog: FogMapState;
  brushSize?: number;
  onPaintFog?: (cellKeys: string[], mode: "reveal" | "hide") => void;
  onCommitFog?: () => void;
  ruler: TacticalRulerData | null;
  rulerShape?: RulerShape;
  showRulerOnTv?: boolean;
  onRulerChange?: (ruler: TacticalRulerData | null) => void;
  onRulerCommit?: (ruler: TacticalRulerData | null) => void;
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
  toolMode = "select",
  fog,
  brushSize = 1,
  onPaintFog,
  onCommitFog,
  ruler,
  rulerShape = "line",
  showRulerOnTv = false,
  onRulerChange,
  onRulerCommit,
}: MapEditorCanvasProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const selectedElement = elements.find((el) => el.id === selectedElementId);

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
        canPan={isActive && toolMode === "select"}
        onImageLoaded={setImageSize}
        onClick={() => {
          if (toolMode === "select") onSelectElement(null);
        }}
      >
        {/* Camada de Tokens e Objetos */}
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
          interactive={isActive && toolMode === "select"}
        />

        {/* Camada de Névoa de Guerra (Semitransparente para o Mestre) */}
        <FogLayer
          mapId={map.id}
          fog={fog}
          gridSize={map.gridSize}
          width={imageSize.width}
          height={imageSize.height}
          isMaster={true}
          interactive={isActive}
          toolMode={toolMode}
          brushSize={brushSize}
          cameraZoom={camera.zoom}
          onPaintCells={onPaintFog}
          onCommitPaint={onCommitFog}
        />

        {/* Camada da Régua de Medição */}
        <RulerLayer
          ruler={ruler}
          gridSize={map.gridSize}
          metersPerGrid={map.metersPerGrid}
          isMaster={true}
          interactive={isActive}
          toolMode={toolMode}
          shape={rulerShape}
          showOnTv={showRulerOnTv}
          cameraZoom={camera.zoom}
          onRulerChange={onRulerChange}
          onRulerCommit={onRulerCommit}
        />
      </MapCanvas>

      {/* Inspetor Fixo do Elemento Selecionado (Fora do overflow-hidden do mapa) */}
      {isActive && selectedElement && toolMode === "select" && (
        <ElementControlsOverlay
          element={selectedElement}
          gridSize={map.gridSize}
          campaignId={campaignId}
          onUpdate={onUpdateElement}
          onDelete={onDeleteElement}
          onDeselect={() => onSelectElement(null)}
          availableMaps={availableMaps}
          onTransfer={(targetMapId) => {
            if (onTransferElement) onTransferElement(selectedElement.id, targetMapId);
          }}
        />
      )}

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
