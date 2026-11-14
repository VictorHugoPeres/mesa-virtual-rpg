"use client";

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
} from "lucide-react";
import { useDice } from "@/core/dice/DiceContext";
import { useCompendium } from "@/core/compendium/CompendiumContext";
import { ProjectionToolbar } from "@/core/projection/ProjectionToolbar";
import { FMCharacterData } from "../types";

interface SheetHeaderProps {
  name: string;
  setName: (name: string) => void;
  type: string;
  campaignId: string;
  characterId: string;
  data: FMCharacterData;
  saveStatus: "saved" | "saving" | "error";
  onManualSave: () => void;
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
}: SheetHeaderProps) {
  const { openRoller, openHistory } = useDice();
  const { openCompendium } = useCompendium();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-default)]">
      {/* Informações Básicas do Personagem */}
      <div className="flex items-center gap-3">
        <Link
          href={`/mestre/${campaignId}`}
          className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          title="Voltar ao Painel da Campanha"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do Personagem"
              className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-[var(--border-accent)] focus:border-blue-500 focus:outline-none transition-colors"
            />
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                type === "PC"
                  ? "bg-blue-900/60 text-blue-300 border border-blue-700"
                  : "bg-red-900/60 text-red-300 border border-red-700"
              }`}
            >
              {type}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {data.origin} · {data.specialization} · Nível {data.level} · {data.grade}
          </p>
        </div>
      </div>

      {/* Ações: Telão/Cenas, Rolador, Histórico, Compêndio e Salvamento */}
      <div className="flex flex-wrap items-center gap-2.5">
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                     bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30
                     transition-all cursor-pointer shadow-xs"
          title="Abrir rolador de dados (Digital / Físico)"
        >
          <Dices className="w-3.5 h-3.5 text-blue-400" />
          Rolar Dado
        </button>

        <button
          type="button"
          onClick={openHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                     bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30
                     transition-all cursor-pointer shadow-xs"
          title="Abrir histórico de rolagens"
        >
          <History className="w-3.5 h-3.5 text-purple-400" />
          Histórico
        </button>

        <button
          type="button"
          onClick={openCompendium}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                     bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30
                     transition-all cursor-pointer shadow-xs"
          title="Abrir compêndio de regras de Feiticeiros e Maldições"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          Compêndio
        </button>

        {/* Status de salvamento e botão manual */}
        <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-default)]">
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span className="hidden sm:inline">Salvando...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 hidden sm:inline">Salvo</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span className="text-red-400 hidden sm:inline">Erro</span>
              </>
            )}
          </div>

          <button
            onClick={onManualSave}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-default)] text-[var(--text-primary)] transition-colors cursor-pointer disabled:opacity-50"
            title="Salvar alterações no banco de dados agora"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salvar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
