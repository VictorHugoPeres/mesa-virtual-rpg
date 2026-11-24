"use client";

import {
  Map as MapIcon,
  Plus,
  Tv,
  EyeOff,
  X,
  ExternalLink,
  Users,
  Swords,
  Dices,
} from "lucide-react";
import { TacticalMapData, MapDisplayMode } from "./mapTypes";
import { BrandLogo } from "@/components/BrandLogo";

interface MapHeaderBarProps {
  maps: TacticalMapData[];
  selectedMapId: string;
  onSelectMapId: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenElementsDrawer: () => void;
  isProjected: boolean;
  onToggleProjection: () => void;
  displayMode: MapDisplayMode;
  onDisplayModeChange: (mode: MapDisplayMode) => void;
  secondaryMapId: string;
  onSecondaryMapIdChange: (id: string) => void;
  campaignId: string;
  onClose: () => void;
  isCombatOpen?: boolean;
  onToggleCombatDrawer?: () => void;
  onOpenDiceModal?: () => void;
}

export function MapHeaderBar({
  maps,
  selectedMapId,
  onSelectMapId,
  onOpenAddModal,
  onOpenElementsDrawer,
  isProjected,
  onToggleProjection,
  displayMode,
  onDisplayModeChange,
  secondaryMapId,
  onSecondaryMapIdChange,
  campaignId,
  onClose,
  isCombatOpen = false,
  onToggleCombatDrawer,
  onOpenDiceModal,
}: MapHeaderBarProps) {
  const hasSelectedMap = maps.some((m) => m.id === selectedMapId);
  const secondaryMaps = maps.filter((m) => m.id !== selectedMapId);

  return (
    <header className="min-h-14 py-2 px-3 sm:px-4 bg-[#0B0C0E]/95 border-b border-[#23272F] flex flex-wrap items-center justify-between gap-2.5 z-30 shrink-0 backdrop-blur-md">
      {/* Lado Esquerdo: Identificação, Seleção de Mapa e Elementos */}
      <div className="flex flex-wrap items-center gap-2">
        <BrandLogo variant="compact" size="sm" className="hidden sm:inline-flex" />
        <div className="p-1.5 rounded-lg bg-[#14161A] border border-[#23272F] text-emerald-400">
          <MapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        {maps.length > 0 ? (
          <select
            value={selectedMapId || ""}
            onChange={(e) => onSelectMapId(e.target.value)}
            className="bg-[#14161A] border border-[#23272F] rounded-lg px-2.5 py-1.5 text-xs font-bold text-zinc-100 focus:outline-none focus:border-white/20 cursor-pointer max-w-[150px] sm:max-w-[190px] truncate"
            title="Mapa Principal (Slot 1 na TV)"
          >
            {maps.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#14161A] text-zinc-100">
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
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600/10 text-rose-300 border border-rose-500/30 hover:bg-rose-600/20 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Novo</span> Mapa
        </button>

        {hasSelectedMap && (
          <button
            type="button"
            onClick={onOpenElementsDrawer}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#14161A] hover:bg-[#1A1D24] text-zinc-200 border border-[#23272F] transition-colors cursor-pointer"
            title="Adicionar Tokens de Combatentes e Objetos de Cenário"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Elementos</span>
          </button>
        )}

        {/* Botão de Acesso Rápido ao Combate */}
        {onToggleCombatDrawer && (
          <button
            type="button"
            onClick={onToggleCombatDrawer}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isCombatOpen
                ? "bg-[#1A1D24] text-white border border-purple-500/50 shadow-md shadow-purple-950/20"
                : "bg-[#14161A] text-zinc-300 hover:text-white border border-[#23272F] hover:bg-[#1A1D24]"
            }`}
            title="Abrir Painel Rápido de Combate & Iniciativa"
          >
            <Swords className="w-3.5 h-3.5 text-purple-400" />
            <span>Combate</span>
          </button>
        )}

        {/* Botão de Acesso Rápido aos Dados */}
        {onOpenDiceModal && (
          <button
            type="button"
            onClick={onOpenDiceModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#14161A] text-zinc-300 hover:text-white border border-[#23272F] hover:bg-[#1A1D24] transition-all cursor-pointer"
            title="Abrir Rolador de Dados"
          >
            <Dices className="w-3.5 h-3.5 text-sky-400" />
            <span>Dados</span>
          </button>
        )}
      </div>

      {/* Lado Direito: Modos de Projeção na TV e Ações */}
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {hasSelectedMap && (
          <>
            {/* Seletor do Modo de Visualização na TV */}
            <select
              value={displayMode}
              onChange={(e) => onDisplayModeChange(e.target.value as MapDisplayMode)}
              className="bg-[#14161A] border border-[#23272F] rounded-lg px-2.5 py-1.5 text-xs font-bold text-zinc-200 focus:outline-none focus:border-white/20 cursor-pointer"
              title="Modo de visualização no Telão da TV"
            >
              <option value="fit">📺 Ajustar à Tela (TV)</option>
              <option value="follow">🎥 Seguir Câmera</option>
              <option value="split">◫ Dividir Tela (2 Mapas)</option>
            </select>

            {/* Dropdown do 2º Mapa quando Dividir Tela estiver ativo */}
            {displayMode === "split" && (
              <select
                value={secondaryMapId || ""}
                onChange={(e) => onSecondaryMapIdChange(e.target.value)}
                className="bg-[#14161A] border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs font-bold text-emerald-300 focus:outline-none focus:border-emerald-400 cursor-pointer max-w-[130px] sm:max-w-[160px] truncate animate-in fade-in duration-150"
                title="Selecione o segundo mapa para o Slot 2 do Telão"
              >
                <option value="">-- 2º Mapa --</option>
                {secondaryMaps.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            )}

            {/* Botão Projetar na TV */}
            <button
              type="button"
              onClick={onToggleProjection}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isProjected
                  ? "bg-emerald-600/90 text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/50"
                  : "bg-[#14161A] text-zinc-300 hover:text-white border border-[#23272F] hover:bg-[#1A1D24]"
              }`}
              title={isProjected ? "Ocultar mapa do Telão" : "Projetar mapa no Telão da TV"}
            >
              {isProjected ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{displayMode === "split" ? "Projetando (Dividido)" : "Projetando na TV"}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
                </>
              ) : (
                <>
                  <Tv className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Projetar na TV</span>
                </>
              )}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => window.open(`/telao/${campaignId}`, "_blank")}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Abrir Telão da TV em nova janela"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Fechar Tabuleiro"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
