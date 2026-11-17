"use client";

import {
  Play,
  Pause,
  Repeat,
  Volume2,
  VolumeX,
  Music,
  Tv,
  Laptop,
} from "lucide-react";
import { useAudio } from "./AudioContext";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayerBar() {
  const {
    bgmState,
    togglePlay,
    setVolume,
    toggleLoop,
    seek,
    setOutputTarget,
    openDrawer,
  } = useAudio();

  const { track, isPlaying, volume, loop, currentTime, duration, outputTarget } =
    bgmState;

  return (
    <aside
      aria-label="Controle de Áudio e Música"
      className="p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-md flex flex-wrap items-center justify-between gap-4"
    >
      {/* Esquerda: Informações da Faixa */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!track}
          className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            isPlaying
              ? "bg-pink-600 text-white shadow-md shadow-pink-600/30 ring-2 ring-pink-500/40"
              : "bg-[var(--bg-secondary)] text-pink-400 border border-pink-500/30 hover:bg-pink-600/20 disabled:opacity-40"
          }`}
          title={isPlaying ? "Pausar música" : "Tocar música"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-pink-950/80 text-pink-300 border border-pink-800/60">
              {track ? track.category : "Mesa de Som"}
            </span>
            {isPlaying && (
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            )}
          </div>
          <h4 className="text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[220px]">
            {track ? track.title : "Nenhuma música selecionada"}
          </h4>
        </div>
      </div>

      {/* Centro: Barra de Progresso e Tempo */}
      <div className="flex-1 min-w-[200px] flex items-center gap-2">
        <span className="text-[10px] font-mono text-[var(--text-muted)] w-9 text-right">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.5"
          value={currentTime || 0}
          disabled={!track}
          onChange={(e) => seek(parseFloat(e.target.value))}
          className="flex-1 accent-pink-500 cursor-pointer disabled:opacity-40 h-1.5 rounded-lg bg-[var(--bg-secondary)]"
        />
        <span className="text-[10px] font-mono text-[var(--text-muted)] w-9">
          {formatTime(duration)}
        </span>

        {/* Repetição Contínua (Loop) */}
        <button
          type="button"
          onClick={toggleLoop}
          className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            loop
              ? "bg-pink-950/80 text-pink-400 border border-pink-700/60 shadow-xs"
              : "text-[var(--text-muted)] hover:text-white"
          }`}
          title={loop ? "Repetição ativada (Loop ligado)" : "Repetição desativada"}
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Direita: Volume, Seletor de Saída e Abrir Mesa */}
      <div className="flex items-center gap-3">
        {/* Controle de Volume da Música */}
        <div className="flex items-center gap-1.5">
          {volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-pink-400" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-18 sm:w-24 accent-pink-500 cursor-pointer h-1.5 rounded-lg bg-[var(--bg-secondary)]"
            title={`Volume BGM: ${Math.round(volume * 100)}%`}
          />
        </div>

        {/* Seletor de Saída: PC vs TV */}
        <div className="flex items-center bg-[var(--bg-secondary)] p-0.5 rounded-lg border border-[var(--border-default)] text-[11px]">
          <button
            type="button"
            onClick={() => setOutputTarget("MASTER_PC")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
              outputTarget === "MASTER_PC"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
            title="Tocar som nas caixas do PC do Mestre"
          >
            <Laptop className="w-3 h-3" /> PC
          </button>
          <button
            type="button"
            onClick={() => setOutputTarget("TV_TELAO")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
              outputTarget === "TV_TELAO"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
            title="Transmitir áudio para o Telão da TV"
          >
            <Tv className="w-3 h-3" /> TV
          </button>
        </div>

        {/* Botão para abrir o Drawer completo */}
        <button
          type="button"
          onClick={openDrawer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-600/20 text-pink-300 border border-pink-500/30 hover:bg-pink-600/30 transition-all cursor-pointer shadow-xs"
          title="Abrir Mesa de Som completa (BGM & Soundboard)"
        >
          <Music className="w-3.5 h-3.5" /> Mesa de Som
        </button>
      </div>
    </aside>
  );
}
