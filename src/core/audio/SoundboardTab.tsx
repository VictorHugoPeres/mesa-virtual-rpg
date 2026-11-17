"use client";

import { Volume2, VolumeX, Sparkles, Plus, Swords, Zap, Skull, CloudRain, Flame, AlertCircle } from "lucide-react";
import { SFXItem } from "./audioTypes";
import { useAudio } from "./AudioContext";

interface SoundboardTabProps {
  onOpenAddModal: () => void;
}

export function SoundboardTab({ onOpenAddModal }: SoundboardTabProps) {
  const { allSfx, sfxVolume, setSfxVolume, playSFX } = useAudio();

  function getThemeClasses(color: SFXItem["colorTheme"]) {
    switch (color) {
      case "red":
        return "bg-red-950/40 text-red-300 border-red-700/50 hover:bg-red-900/60 active:scale-95";
      case "purple":
        return "bg-purple-950/40 text-purple-300 border-purple-700/50 hover:bg-purple-900/60 active:scale-95";
      case "blue":
        return "bg-blue-950/40 text-blue-300 border-blue-700/50 hover:bg-blue-900/60 active:scale-95";
      case "amber":
        return "bg-amber-950/40 text-amber-300 border-amber-700/50 hover:bg-amber-900/60 active:scale-95";
      case "emerald":
        return "bg-emerald-950/40 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60 active:scale-95";
      case "zinc":
      default:
        return "bg-zinc-900 text-zinc-300 border-zinc-700/50 hover:bg-zinc-800 active:scale-95";
    }
  }

  function getIcon(title: string) {
    const lower = title.toLowerCase();
    if (lower.includes("espada") || lower.includes("golpe")) return <Swords className="w-5 h-5 mb-1" />;
    if (lower.includes("domínio") || lower.includes("dominio")) return <Sparkles className="w-5 h-5 mb-1 text-purple-400 animate-spin" style={{ animationDuration: "6s" }} />;
    if (lower.includes("trovão") || lower.includes("trovao") || lower.includes("raio")) return <Zap className="w-5 h-5 mb-1 text-blue-400" />;
    if (lower.includes("impacto")) return <Flame className="w-5 h-5 mb-1 text-amber-400" />;
    if (lower.includes("feitiço") || lower.includes("maldição")) return <Skull className="w-5 h-5 mb-1 text-emerald-400" />;
    if (lower.includes("suspense") || lower.includes("tensão")) return <AlertCircle className="w-5 h-5 mb-1 text-zinc-400" />;
    return <CloudRain className="w-5 h-5 mb-1" />;
  }

  return (
    <div className="space-y-4">
      {/* Barra de Volume de Efeitos */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          {sfxVolume === 0 ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
          <span>Volume dos Efeitos (SFX)</span>
          <span className="text-pink-400 font-mono text-[11px]">{Math.round(sfxVolume * 100)}%</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={sfxVolume}
            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            className="w-32 accent-pink-500 cursor-pointer"
          />
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-input)] text-white/80 hover:text-white border border-[var(--border-default)] hover:border-pink-500/40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-pink-400" /> Novo SFX
          </button>
        </div>
      </div>

      {/* Grade de Botões do Soundboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allSfx.map((sfx) => {
          const theme = getThemeClasses(sfx.colorTheme);

          return (
            <button
              key={sfx.id}
              type="button"
              onClick={() => playSFX(sfx)}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center font-bold text-xs shadow-md transition-all cursor-pointer ${theme}`}
              title={`Tocar efeito: ${sfx.title}`}
            >
              {getIcon(sfx.title)}
              <span className="line-clamp-2 leading-tight">{sfx.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
