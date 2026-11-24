"use client";

import {
  Play,
  Pause,
  Repeat,
  Volume2,
  VolumeX,
  Music,
  Laptop,
  Tv,
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
      className="p-3 rounded-xl border border-[#23272F] bg-[#14161A] shadow-sm flex flex-wrap items-center justify-between gap-4"
    >
      {/* Esquerda: Informações da Faixa */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!track}
          className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer active:scale-95 select-none ${
            isPlaying
              ? "bg-rose-600 text-white shadow-md shadow-rose-950/40 hover:bg-rose-500 ring-1 ring-rose-400/30"
              : "bg-[#1A1D24] text-zinc-300 border border-[#23272F] hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
          title={isPlaying ? "Pausar música" : "Tocar música"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
              {track ? track.category : "Mesa de Som"}
            </span>
            {isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <h4 className="text-xs font-semibold text-zinc-200 truncate max-w-[160px] sm:max-w-[220px] mt-0.5">
            {track ? track.title : "Nenhuma música selecionada"}
          </h4>
        </div>
      </div>

      {/* Centro: Barra de Progresso e Tempo */}
      <div className="flex-1 min-w-[200px] flex items-center gap-2">
        <span className="text-[10px] font-mono text-zinc-500 w-9 text-right">
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
          className="flex-1 accent-rose-500 cursor-pointer disabled:opacity-40 h-1.5 rounded-lg bg-zinc-800"
        />
        <span className="text-[10px] font-mono text-zinc-500 w-9">
          {formatTime(duration)}
        </span>

        {/* Repetição Contínua (Loop) */}
        <button
          type="button"
          onClick={toggleLoop}
          className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            loop
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-xs"
              : "text-zinc-500 hover:text-zinc-300"
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
            <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-18 sm:w-24 accent-rose-500 cursor-pointer h-1.5 rounded-lg bg-zinc-800"
            title={`Volume BGM: ${Math.round(volume * 100)}%`}
          />
        </div>

        {/* Seletor de Saída: PC vs TV em Superfície Neutra Grafite */}
        <div className="flex items-center bg-[#0B0C0E] p-0.5 rounded-lg border border-[#23272F] text-[11px]">
          <button
            type="button"
            onClick={() => setOutputTarget("MASTER_PC")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
              outputTarget === "MASTER_PC"
                ? "bg-[#1A1D24] text-white border border-white/10 shadow-xs font-semibold"
                : "text-zinc-400 hover:text-zinc-200 font-medium"
            }`}
            title="Tocar som nas caixas do PC do Mestre"
          >
            <Laptop className="w-3 h-3 text-sky-400" /> PC
          </button>
          <button
            type="button"
            onClick={() => setOutputTarget("TV_TELAO")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
              outputTarget === "TV_TELAO"
                ? "bg-[#1A1D24] text-white border border-white/10 shadow-xs font-semibold"
                : "text-zinc-400 hover:text-zinc-200 font-medium"
            }`}
            title="Tocar som no Telão da TV"
          >
            <Tv className="w-3 h-3 text-emerald-400" /> TV
          </button>
        </div>

        {/* Botão de abrir Mesa de Som Completa */}
        <button
          type="button"
          onClick={openDrawer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
          title="Abrir Mesa de Som Completa (playlists e efeitos sonoros)"
        >
          <Music className="w-3.5 h-3.5 text-pink-400" />
          <span>Mesa</span>
        </button>
      </div>
    </aside>
  );
}
