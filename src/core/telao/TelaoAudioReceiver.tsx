"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AudioBGMEventData, AudioSFXEventData, SyncEvent } from "../sync/syncTypes";
import { soundSynth } from "../audio/soundSynthesizer";
import { useCampaignSync } from "../sync/useCampaignSync";

interface TelaoAudioReceiverProps {
  campaignId: string;
  initialAudio?: AudioBGMEventData | null;
}

export function TelaoAudioReceiver({
  campaignId,
  initialAudio = null,
}: TelaoAudioReceiverProps) {
  const [bgmData, setBgmData] = useState<AudioBGMEventData | null>(initialAudio);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Escuta eventos em tempo real para BGM e SFX
  const handleSyncEvent = useCallback((event: SyncEvent) => {
    if (event.type === "AUDIO_UPDATE") {
      setBgmData(event.payload as AudioBGMEventData | null);
    } else if (event.type === "AUDIO_SFX_PLAY") {
      const sfx = event.payload as AudioSFXEventData;
      if (sfx && sfx.url) {
        soundSynth.play(sfx.url, sfx.volume ?? 0.8);
      }
    }
  }, []);

  useCampaignSync({ campaignId, onEvent: handleSyncEvent });

  // Busca dados iniciais caso a TV abra depois
  useEffect(() => {
    async function fetchInitial() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/audio`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.activeAudio) {
          setBgmData(data.activeAudio);
        }
      } catch (err) {
        console.warn("Erro ao buscar áudio inicial no Telão:", err);
      }
    }
    fetchInitial();
  }, [campaignId]);

  // Função para destravar áudio com interação do usuário
  function unlockAudio() {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onerror = () => {
        console.warn("Áudio da TV falhou ao carregar:", audioRef.current?.src);
      };
    }
    // Toca som mudo temporário para destravar contexto do navegador
    soundSynth.play("synth:sword", 0.001);
    setAudioUnlocked(true);
    setAutoplayBlocked(false);

    if (bgmData?.trackUrl && bgmData.outputTarget === "TV_TELAO" && bgmData.isPlaying) {
      const audio = audioRef.current;
      audio.src = bgmData.trackUrl;
      audio.volume = bgmData.volume ?? 0.7;
      audio.loop = bgmData.loop ?? true;
      audio.play().catch(() => setAutoplayBlocked(true));
    }
  }

  // Gerencia o elemento HTMLAudio para BGM na TV
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onerror = () => {
        console.warn("Áudio da TV falhou ao carregar:", audioRef.current?.src);
      };
    }
    const audio = audioRef.current;

    // Se o mestre escolheu tocar no PC do mestre, pausa na TV
    if (!bgmData || bgmData.outputTarget !== "TV_TELAO") {
      audio.pause();
      return;
    }

    if (bgmData.trackUrl) {
      if (audio.src !== bgmData.trackUrl && !audio.src.endsWith(bgmData.trackUrl)) {
        audio.src = bgmData.trackUrl;
      }
      audio.volume = bgmData.volume ?? 0.7;
      audio.loop = bgmData.loop ?? true;

      if (bgmData.isPlaying) {
        audio
          .play()
          .then(() => {
            setAutoplayBlocked(false);
            setAudioUnlocked(true);
          })
          .catch((err) => {
            // Autoplay bloqueado pelo navegador até o usuário interagir
            console.warn("Autoplay na TV aguardando clique:", err);
            setAutoplayBlocked(true);
          });
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [bgmData]);

  const isTvTarget = bgmData?.outputTarget === "TV_TELAO";

  return (
    <>
      {/* Botão discreto para destravar o áudio na TV se bloqueado pelo navegador */}
      {isTvTarget && (!audioUnlocked || autoplayBlocked) && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in duration-300">
          <button
            type="button"
            onClick={unlockAudio}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl backdrop-blur-md border border-emerald-400/50 cursor-pointer animate-pulse transition-all"
            title="Clique para liberar a reprodução de som nesta janela"
          >
            <VolumeX className="w-4 h-4" />
            <span>Ativar Som da TV</span>
          </button>
        </div>
      )}

      {/* Indicador discreto temporário de Som da TV ativo */}
      {isTvTarget && audioUnlocked && !autoplayBlocked && bgmData?.isPlaying && (
        <div className="fixed top-4 left-4 z-40 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono backdrop-blur-xs">
            <Volume2 className="w-3 h-3 text-emerald-400" />
            <span>Áudio TV: {bgmData.trackTitle || "BGM Ativa"}</span>
          </div>
        </div>
      )}
    </>
  );
}
