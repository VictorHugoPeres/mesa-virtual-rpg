"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface RollRequest {
  label: string;
  modifier: number;
  defaultDice?: string; // Ex: "1d20", "1d8", "2d6"
  roller: string; // Nome do personagem ou Mestre
  characterId?: string;
  campaignId?: string;
}

interface DiceContextValue {
  isModalOpen: boolean;
  isHistoryOpen: boolean;
  activeRequest: RollRequest | null;
  historyVersion: number;
  openRoller: (req: RollRequest) => void;
  closeRoller: () => void;
  openHistory: () => void;
  closeHistory: () => void;
  notifyRollSaved: () => void;
}

const DiceContext = createContext<DiceContextValue | null>(null);

export function DiceProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<RollRequest | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);

  function openRoller(req: RollRequest) {
    setActiveRequest(req);
    setIsModalOpen(true);
  }

  function closeRoller() {
    setIsModalOpen(false);
  }

  function openHistory() {
    setIsHistoryOpen(true);
  }

  function closeHistory() {
    setIsHistoryOpen(false);
  }

  function notifyRollSaved() {
    setHistoryVersion((v) => v + 1);
  }

  return (
    <DiceContext.Provider
      value={{
        isModalOpen,
        isHistoryOpen,
        activeRequest,
        historyVersion,
        openRoller,
        closeRoller,
        openHistory,
        closeHistory,
        notifyRollSaved,
      }}
    >
      {children}
    </DiceContext.Provider>
  );
}

export function useDice() {
  const ctx = useContext(DiceContext);
  if (!ctx) {
    throw new Error("useDice deve ser usado dentro de um DiceProvider");
  }
  return ctx;
}
