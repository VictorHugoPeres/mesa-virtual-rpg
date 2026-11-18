"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Map as MapIcon,
  Plus,
  Tv,
  EyeOff,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { TacticalMapData, CameraState, DEFAULT_CAMERA } from "./mapTypes";
import { MapCanvas } from "./MapCanvas";
import { GridControlsOverlay } from "./GridControlsOverlay";
import { CameraControlsOverlay } from "./CameraControlsOverlay";
import { AddMapModal } from "./AddMapModal";
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

  const { emit } = useCampaignSync({ campaignId });
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Carrega mapas e verifica se há projeção ativa
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

  const selectedMap = maps.find((m) => m.id === selectedMapId) || maps[0];

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
    [campaignId, emit]
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

    // Salva no banco com debounce
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
      broadcastMapState(selectedMap, true, newCam);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050508] text-white animate-in fade-in duration-200">
      {/* Top Bar do Tabuleiro */}
      <header className="h-14 px-4 bg-zinc-950/90 border-b border-white/10 flex items-center justify-between gap-4 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
            <MapIcon className="w-5 h-5" />
          </div>

          {/* Seletor de Mapa */}
          {maps.length > 0 ? (
            <select
              value={selectedMapId}
              onChange={(e) => {
                setSelectedMapId(e.target.value);
                setCamera(DEFAULT_CAMERA);
                setIsProjected(false);
              }}
              className="bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[200px] sm:max-w-[260px] truncate"
            >
              {maps.map((m) => (
                <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                  {m.title}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-zinc-400 font-medium">Nenhum mapa criado</span>
          )}

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Novo Mapa
          </button>
        </div>

        {/* Controles de Projeção no Telão */}
        <div className="flex items-center gap-2">
          {selectedMap && (
            <button
              type="button"
              onClick={toggleProjection}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isProjected
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                  : "bg-zinc-800 text-zinc-300 hover:text-white border border-white/10"
              }`}
              title={isProjected ? "Ocultar mapa do Telão" : "Projetar mapa no Telão da TV"}
            >
              {isProjected ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Projetando no Telão</span>
                  <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
                </>
              ) : (
                <>
                  <Tv className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Projetar na TV</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => window.open(`/telao/${campaignId}`, "_blank")}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Abrir Telão da TV em nova janela"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-2"
            title="Fechar Tabuleiro"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Área do Tabuleiro */}
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
            />

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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg"
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
    </div>
  );
}
