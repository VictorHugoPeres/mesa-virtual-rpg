"use client";

import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { CameraState, DEFAULT_CAMERA } from "./mapTypes";

interface CameraControlsOverlayProps {
  camera: CameraState;
  onChange: (cam: CameraState) => void;
}

export function CameraControlsOverlay({ camera, onChange }: CameraControlsOverlayProps) {
  function zoomIn() {
    onChange({
      ...camera,
      zoom: Math.min(4, Math.round((camera.zoom + 0.2) * 10) / 10),
    });
  }

  function zoomOut() {
    onChange({
      ...camera,
      zoom: Math.max(0.2, Math.round((camera.zoom - 0.2) * 10) / 10),
    });
  }

  function resetCamera() {
    onChange(DEFAULT_CAMERA);
  }

  return (
    <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-[#14161A]/90 backdrop-blur-md border border-[#23272F] shadow-xl text-xs text-white">
      <button
        type="button"
        onClick={zoomOut}
        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        title="Diminuir Zoom (-)"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <span className="font-mono font-bold text-[11px] px-1 text-emerald-400 min-w-[42px] text-center">
        {Math.round(camera.zoom * 100)}%
      </span>

      <button
        type="button"
        onClick={zoomIn}
        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        title="Aumentar Zoom (+)"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-[#23272F] mx-0.5" />

      <button
        type="button"
        onClick={resetCamera}
        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        title="Centralizar Câmera (Resetar Posição)"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
}
