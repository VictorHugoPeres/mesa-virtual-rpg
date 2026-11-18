"use client";

import { useState } from "react";
import { X, User, Box, Sparkles } from "lucide-react";
import { MapElement } from "./elementTypes";
import { TokenPickerTab } from "./TokenPickerTab";
import { PropPickerTab } from "./PropPickerTab";

interface AddElementDrawerProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  onAddElement: (elem: MapElement) => void;
  spawnPosition?: { x: number; y: number };
}

export function AddElementDrawer({
  campaignId,
  isOpen,
  onClose,
  onAddElement,
  spawnPosition = { x: 200, y: 200 },
}: AddElementDrawerProps) {
  const [tab, setTab] = useState<"tokens" | "props">("tokens");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Adicionar Elemento ao Mapa</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-white/10 bg-zinc-900/50 p-1 gap-1">
          <button
            type="button"
            onClick={() => setTab("tokens")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === "tokens"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" /> Tokens (Personagens & Ameaças)
          </button>
          <button
            type="button"
            onClick={() => setTab("props")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === "props"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Box className="w-3.5 h-3.5" /> Objetos de Cenário (Props)
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-4 overflow-y-auto flex-1">
          {tab === "tokens" ? (
            <TokenPickerTab
              campaignId={campaignId}
              spawnPosition={spawnPosition}
              onAddElement={onAddElement}
              onClose={onClose}
            />
          ) : (
            <PropPickerTab
              campaignId={campaignId}
              spawnPosition={spawnPosition}
              onAddElement={onAddElement}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
