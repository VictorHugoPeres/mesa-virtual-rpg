"use client";

import {
  Map as MapIcon,
  Plus,
  Tv,
  EyeOff,
  X,
  ExternalLink,
  Users,
} from "lucide-react";
import { TacticalMapData } from "./mapTypes";

interface MapHeaderBarProps {
  maps: TacticalMapData[];
  selectedMapId: string;
  onSelectMapId: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenElementsDrawer: () => void;
  isProjected: boolean;
  onToggleProjection: () => void;
  campaignId: string;
  onClose: () => void;
}

export function MapHeaderBar({
  maps,
  selectedMapId,
  onSelectMapId,
  onOpenAddModal,
  onOpenElementsDrawer,
  isProjected,
  onToggleProjection,
  campaignId,
  onClose,
}: MapHeaderBarProps) {
  const hasSelectedMap = maps.some((m) => m.id === selectedMapId);

  return (
    <header className="h-14 px-4 bg-zinc-950/90 border-b border-white/10 flex items-center justify-between gap-4 z-30 shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
          <MapIcon className="w-5 h-5" />
        </div>

        {/* Seletor de Mapa */}
        {maps.length > 0 ? (
          <select
            value={selectedMapId || ""}
            onChange={(e) => onSelectMapId(e.target.value)}
            className="bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[200px] sm:max-w-[240px] truncate"
          >
            {maps.map((m) => (
              <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                {m.title}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-zinc-400 font-medium">Nenhum mapa criado</span>
        )}

        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Novo Mapa
        </button>

        {/* Botão + Elementos (Tokens & Props) */}
        {hasSelectedMap && (
          <button
            type="button"
            onClick={onOpenElementsDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-800 text-emerald-300 border border-emerald-500/30 hover:bg-zinc-700 hover:text-emerald-200 transition-colors cursor-pointer"
            title="Adicionar Tokens de Combatentes e Objetos de Cenário"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Elementos</span>
          </button>
        )}
      </div>

      {/* Controles de Projeção no Telão */}
      <div className="flex items-center gap-2">
        {hasSelectedMap && (
          <button
            type="button"
            onClick={onToggleProjection}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isProjected
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                : "bg-zinc-800 text-zinc-300 hover:text-white border border-white/10"
            }`}
            title={isProjected ? "Ocultar mapa do Telão" : "Projetar mapa no Telão da TV"}
          >
            {isProjected ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Projetando no Telão</span>
                <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
              </>
            ) : (
              <>
                <Tv className="w-3.5 h-3.5 text-emerald-400" />
                <span>Projetar na TV</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => window.open(`/telao/${campaignId}`, "_blank")}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Abrir Telão da TV em nova janela"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-2"
          title="Fechar Tabuleiro"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
