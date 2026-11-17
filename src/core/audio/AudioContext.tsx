"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { useAudioEngine } from "./useAudioEngine";

type AudioEngineType = ReturnType<typeof useAudioEngine>;

interface AudioContextValue extends AudioEngineType {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({
  campaignId,
  children,
}: {
  campaignId: string;
  children: ReactNode;
}) {
  const audio = useAudioEngine(campaignId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const value: AudioContextValue = {
    ...audio,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("useAudio deve ser usado dentro de um AudioProvider");
  }
  return ctx;
}
