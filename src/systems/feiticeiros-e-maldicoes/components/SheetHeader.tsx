"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Dices,
  History,
  BookOpen,
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Moon,
} from "lucide-react";
import { useDice } from "@/core/dice/DiceContext";
import { useCompendium } from "@/core/compendium/CompendiumContext";
import { ProjectionToolbar } from "@/core/projection/ProjectionToolbar";
import { FMCharacterData, SPEC_TABLE, Specialization } from "@/systems/feiticeiros-e-maldicoes";
import { RestModal } from "./RestModal";
import { BrandLogo } from "@/components/BrandLogo";

interface SheetHeaderProps {
  name: string;
  setName: (name: string) => void;
  type: string;
  campaignId: string;
  characterId: string;
  data: FMCharacterData;
  saveStatus: "saved" | "saving" | "error";
  onManualSave: () => void;
  onUpdateSheet?: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function SheetHeader({
  name,
  setName,
  type,
  campaignId,
  characterId,
  data,
  saveStatus,
  onManualSave,
  onUpdateSheet,
}: SheetHeaderProps) {
  const { openRoller, openHistory } = useDice();
  const { openCompendium } = useCompendium();
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);

  const totalDV = Math.max(data.hitDice?.total ?? 1, data.level ?? 1);
  const spentDV = data.hitDice?.spent ?? 0;
  const availDV = Math.max(0, totalDV - spentDV);
  const die = data.hitDice?.die || SPEC_TABLE[data.specialization as Specialization]?.hitDie || "d10";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#23272F]">
      {/* Informações Básicas do Personagem */}
      <div className="flex items-center gap-3">
        <Link
          href={`/mestre/${campaignId}`}
          className="p-2 rounded-lg bg-[#14161A] border border-[#23272F] hover:bg-[#1A1D24] text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          title="Voltar ao Painel da Campanha"
        >
          <ArrowLeft className="w-4 h-4" />
          <BrandLogo variant="compact" size="sm" />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do Personagem"
              className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-white/20 focus:border-rose-500/50 focus:outline-none transition-colors text-white"
            />
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                type === "PC"
                  ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}
            >
              {type}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {data.origin} · {data.specialization} · Nível {data.level} · {data.grade}
          </p>
        </div>
      </div>

      {/* Ações: Telão/Cenas, Rolador, Histórico, Compêndio e Salvamento */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Controles de Projeção na TV */}
        <ProjectionToolbar campaignId={campaignId} />

        <button
          type="button"
          onClick={() =>
            openRoller({
              label: "Rolagem Livre",
              modifier: 0,
              defaultDice: "1d20",
              roller: name || "Personagem",
              characterId,
              campaignId,
            })
          }
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium
                     bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white
                     transition-all cursor-pointer shadow-xs active:scale-95 group"
          title="Abrir rolador de dados (Digital / Físico)"
        >
          <Dices className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-300 transition-colors" />
          <span>Rolar Dado</span>
        </button>

        <button
          type="button"
          onClick={openHistory}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium
                     bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white
                     transition-all cursor-pointer shadow-xs active:scale-95 group"
          title="Abrir histórico de rolagens"
        >
          <History className="w-3.5 h-3.5 text-violet-400 group-hover:text-violet-300 transition-colors" />
          <span>Histórico</span>
        </button>

        <button
          type="button"
          onClick={openCompendium}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium
                     bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white
                     transition-all cursor-pointer shadow-xs active:scale-95 group"
          title="Abrir compêndio de regras de Feiticeiros e Maldições"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 transition-colors" />
          <span>Compêndio</span>
        </button>

        {onUpdateSheet && (
          <button
            type="button"
            onClick={() => setIsRestModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium
                       bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white
                       transition-all cursor-pointer shadow-xs active:scale-95 group"
            title="Realizar Descanso Curto ou Longo"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span>Descanso</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono">
              {availDV}/{totalDV} {die}
            </span>
          </button>
        )}

        {/* Status de salvamento e botão manual */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#23272F]">
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                <span className="hidden sm:inline text-zinc-400">Salvando...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">Salvo</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400 hidden sm:inline">Erro</span>
              </>
            )}
          </div>

          <button
            onClick={onManualSave}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] text-zinc-200 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Salvar alterações no banco de dados agora"
          >
            <Save className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Salvar</span>
          </button>
        </div>
      </div>

      {onUpdateSheet && (
        <RestModal
          isOpen={isRestModalOpen}
          onClose={() => setIsRestModalOpen(false)}
          data={data}
          onChange={onUpdateSheet}
          characterName={name}
          characterId={characterId}
          campaignId={campaignId}
        />
      )}
    </div>
  );
}
