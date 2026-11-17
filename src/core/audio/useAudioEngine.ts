"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  AudioTrack,
  BGMState,
  INITIAL_BGM_STATE,
  SFXItem,
  DEFAULT_SFX_PRESETS,
  AudioOutputTarget,
} from "./audioTypes";
import { soundSynth } from "./soundSynthesizer";
import { useCampaignSync } from "../sync/useCampaignSync";
import { AudioBGMEventData } from "../sync/syncTypes";

export function useAudioEngine(campaignId: string) {
  const [bgmState, setBgmState] = useState<BGMState>(INITIAL_BGM_STATE);
  const [sfxVolume, setSfxVolume] = useState<number>(0.8);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [customSfx, setCustomSfx] = useState<SFXItem[]>([]);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const { emit } = useCampaignSync({ campaignId });

  // Salva no banco e notifica sync
  const broadcastBGMState = useCallback(
    async (newState: BGMState) => {
      const payload: AudioBGMEventData = {
        trackUrl: newState.track?.url || null,
        trackTitle: newState.track?.title || null,
        trackCategory: newState.track?.category || null,
        isPlaying: newState.isPlaying,
        volume: newState.volume,
        loop: newState.loop,
        outputTarget: newState.outputTarget,
        currentTime: newState.currentTime,
      };

      emit("AUDIO_UPDATE", payload);

      try {
        await fetch(`/api/campaigns/${campaignId}/audio`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audioData: payload }),
        });
      } catch (err) {
        console.warn("Erro ao salvar áudio no banco:", err);
      }
    },
    [campaignId, emit]
  );

  // Carrega faixas cadastradas da campanha
  const loadTracks = useCallback(async () => {
    try {
      const res = await fetch(`/api/media?campaignId=${campaignId}&type=audio`);
      if (!res.ok) return;
      const data = await res.json();
      const mediaList = data.media || [];

      const bgmItems: AudioTrack[] = [];
      const sfxItems: SFXItem[] = [];

      mediaList.forEach((m: { id: string; title: string; url: string; category: string; notes?: string }) => {
        const cat = (m.category || "").toUpperCase();
        if (cat.startsWith("BGM_") || cat === "BGM" || cat === "AUDIO" || cat === "MUSIC") {
          bgmItems.push({
            id: m.id,
            title: m.title,
            url: m.url,
            category: cat.replace("BGM_", "") || "AMBIENTE",
            notes: m.notes,
          });
        } else if (cat === "SFX") {
          sfxItems.push({
            id: m.id,
            title: m.title,
            url: m.url,
            colorTheme: "amber",
          });
        }
      });

      setTracks(bgmItems);
      setCustomSfx(sfxItems);
    } catch (err) {
      console.warn("Erro ao carregar faixas de áudio:", err);
    }
  }, [campaignId]);

  // Carrega estado de áudio ativo inicial
  useEffect(() => {
    loadTracks();
    async function fetchInitialAudio() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/audio`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.activeAudio) {
          const a = data.activeAudio as AudioBGMEventData;
          setBgmState((prev) => ({
            ...prev,
            track: a.trackUrl
              ? { id: "active", title: a.trackTitle || "Faixa Ativa", url: a.trackUrl, category: a.trackCategory || "AMBIENTE" }
              : null,
            isPlaying: a.isPlaying,
            volume: a.volume ?? 0.7,
            loop: a.loop ?? true,
            outputTarget: a.outputTarget || "MASTER_PC",
          }));
        }
      } catch (err) {
        console.warn("Erro ao buscar áudio inicial:", err);
      }
    }
    fetchInitialAudio();
  }, [campaignId, loadTracks]);

  // Gerencia o elemento de áudio local no PC do Mestre
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      audioElementRef.current = audio;

      audio.ontimeupdate = () => {
        setBgmState((prev) => ({
          ...prev,
          currentTime: audio.currentTime,
          duration: audio.duration || 0,
        }));
      };

      audio.onended = () => {
        if (!audio.loop) {
          setBgmState((prev) => ({ ...prev, isPlaying: false }));
        }
      };

      audio.onerror = () => {
        console.warn("Erro ao carregar áudio no PC:", audio.src);
        setBgmState((prev) => ({ ...prev, isPlaying: false }));
      };
    }

    const audio = audioElementRef.current;

    // Se a saída for TV, silencia no PC do Mestre
    if (bgmState.outputTarget === "TV_TELAO") {
      audio.pause();
      return;
    }

    if (bgmState.track?.url) {
      if (audio.src !== bgmState.track.url && !audio.src.endsWith(bgmState.track.url)) {
        audio.src = bgmState.track.url;
        audio.currentTime = 0;
      }
      audio.volume = bgmState.volume;
      audio.loop = bgmState.loop;

      if (bgmState.isPlaying) {
        audio.play().catch((err) => {
          console.warn("Falha ao tocar áudio:", err);
          setBgmState((prev) => ({ ...prev, isPlaying: false }));
        });
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
      audio.removeAttribute("src");
    }
  }, [bgmState.track, bgmState.isPlaying, bgmState.volume, bgmState.loop, bgmState.outputTarget]);

  const playTrack = useCallback(
    (track: AudioTrack) => {
      setBgmState((prev) => {
        const next: BGMState = { ...prev, track, isPlaying: true, currentTime: 0 };
        broadcastBGMState(next);
        return next;
      });
    },
    [broadcastBGMState]
  );

  const togglePlay = useCallback(() => {
    setBgmState((prev) => {
      if (!prev.track) return prev;
      const next: BGMState = { ...prev, isPlaying: !prev.isPlaying };
      broadcastBGMState(next);
      return next;
    });
  }, [broadcastBGMState]);

  const setVolume = useCallback(
    (vol: number) => {
      const clamped = Math.max(0, Math.min(1, vol));
      setBgmState((prev) => {
        const next = { ...prev, volume: clamped };
        broadcastBGMState(next);
        return next;
      });
    },
    [broadcastBGMState]
  );

  const toggleLoop = useCallback(() => {
    setBgmState((prev) => {
      const next = { ...prev, loop: !prev.loop };
      broadcastBGMState(next);
      return next;
    });
  }, [broadcastBGMState]);

  const seek = useCallback((time: number) => {
    if (audioElementRef.current && Number.isFinite(time)) {
      audioElementRef.current.currentTime = time;
    }
    setBgmState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const setOutputTarget = useCallback(
    (target: AudioOutputTarget) => {
      setBgmState((prev) => {
        const next = { ...prev, outputTarget: target };
        broadcastBGMState(next);
        return next;
      });
    },
    [broadcastBGMState]
  );

  const playSFX = useCallback(
    (sfx: SFXItem) => {
      if (bgmState.outputTarget === "TV_TELAO") {
        emit("AUDIO_SFX_PLAY", {
          id: sfx.id,
          url: sfx.url,
          title: sfx.title,
          volume: sfxVolume,
          timestamp: Date.now(),
        });
      } else {
        soundSynth.play(sfx.url, sfxVolume);
      }
    },
    [bgmState.outputTarget, sfxVolume, emit]
  );

  return {
    bgmState,
    sfxVolume,
    tracks,
    customSfx,
    allSfx: [...DEFAULT_SFX_PRESETS, ...customSfx],
    loadTracks,
    playTrack,
    togglePlay,
    setVolume,
    setSfxVolume,
    toggleLoop,
    seek,
    setOutputTarget,
    playSFX,
  };
}
