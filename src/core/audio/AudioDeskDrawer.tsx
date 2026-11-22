"use client";

import { useState } from "react";
import { Music, X, Radio, Laptop, Tv } from "lucide-react";
import { useAudio } from "./AudioContext";
import { BGMTab } from "./BGMTab";
import { SoundboardTab } from "./SoundboardTab";
import { AddAudioModal } from "./AddAudioModal";
import { Portal } from "@/core/ui";

interface AudioDeskDrawerProps {
  campaignId: string;
}

export function AudioDeskDrawer({ campaignId }: AudioDeskDrawerProps) {
  const { isDrawerOpen, closeDrawer, bgmState, setOutputTarget, loadTracks } = useAudio();
  const [activeTab, setActiveTab] = useState<"bgm" | "sfx">("bgm");
  const [showAddModal, setShowAddModal] = useState(false);

  if (!isDrawerOpen) return null;

  return (
    <>
      <Portal>
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-2xl bg-[var(--bg-primary)] border-l border-[var(--border-default)] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-card)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-pink-950/60 border border-pink-800 text-pink-400">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  Mesa de Som (Áudio & SFX)
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Músicas ambiente e soundboard de efeitos em tempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Seletor de Saída de Áudio */}
              <div className="flex items-center bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-default)] text-xs">
                <button
                  type="button"
                  onClick={() => setOutputTarget("MASTER_PC")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    bgmState.outputTarget === "MASTER_PC"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-white"
                  }`}
                  title="Tocar áudio no computador do Mestre"
                >
                  <Laptop className="w-3.5 h-3.5" /> PC Mestre
                </button>
                <button
                  type="button"
                  onClick={() => setOutputTarget("TV_TELAO")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    bgmState.outputTarget === "TV_TELAO"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-white"
                  }`}
                  title="Transmitir áudio para a janela do Telão da TV"
                >
                  <Tv className="w-3.5 h-3.5" /> Telão TV
                </button>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Abas */}
          <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-secondary)] text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("bgm")}
              className={`flex-1 py-2.5 font-bold text-center border-b-2 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                activeTab === "bgm"
                  ? "border-pink-500 text-pink-400 bg-[var(--bg-card)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              <Music className="w-4 h-4" /> Músicas Ambiente (BGM)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sfx")}
              className={`flex-1 py-2.5 font-bold text-center border-b-2 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                activeTab === "sfx"
                  ? "border-purple-500 text-purple-400 bg-[var(--bg-card)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              <Radio className="w-4 h-4" /> Soundboard de Efeitos (SFX)
            </button>
          </div>

          {/* Conteúdo da Aba */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "bgm" ? (
              <BGMTab onOpenAddModal={() => setShowAddModal(true)} />
            ) : (
              <SoundboardTab onOpenAddModal={() => setShowAddModal(true)} />
            )}
          </div>
        </div>
      </div>
      </Portal>

      <AddAudioModal
        campaignId={campaignId}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadTracks}
        defaultType={activeTab === "bgm" ? "BGM" : "SFX"}
      />
    </>
  );
}
