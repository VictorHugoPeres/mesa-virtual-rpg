"use client";

import { Sparkles, BookOpen, Plus, Swords, Shield } from "lucide-react";

interface SpellsHeaderControlsProps {
  isRestringido: boolean;
  spellCount: number;
  maxSpells: number;
  characterLevel: number;
  onOpenCatalog: () => void;
  onOpenBuilder: () => void;
  onOpenMartial: () => void;
  onOpenShadow: () => void;
  onAddQuick: () => void;
}

export function SpellsHeaderControls({
  isRestringido,
  spellCount,
  maxSpells,
  characterLevel,
  onOpenCatalog,
  onOpenBuilder,
  onOpenMartial,
  onOpenShadow,
  onAddQuick,
}: SpellsHeaderControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            {isRestringido
              ? `Estilo & Técnicas Marciais (${spellCount} manobras)`
              : `Feitiços & Liberações (${spellCount} / ${maxSpells} slots)`}
          </h3>
          {!isRestringido && spellCount >= maxSpells && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
              Limite do Nível Atingido
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {isRestringido
            ? `Técnicas físicas e manobras avançadas alimentadas por Estamina (Nível ${characterLevel})`
            : `Golpes, disparos e manifestações da sua técnica amaldiçoada (Nível ${characterLevel})`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isRestringido ? (
          <button
            type="button"
            onClick={onOpenMartial}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-950/30 transition-all cursor-pointer active:scale-95"
          >
            <Swords className="w-3.5 h-3.5" /> ⚔️ Arsenal Marcial
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onOpenShadow}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-indigo-500/40 text-indigo-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
              title="Consultar posturas e técnicas do Novo Estilo da Sombra"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" /> Estilo da Sombra
            </button>

            <button
              type="button"
              onClick={onOpenCatalog}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Catálogo da Obra
            </button>

            <button
              type="button"
              onClick={onOpenBuilder}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-950/30 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" /> + Feitiço Guiado
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onAddQuick}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
          title="Criar item em branco para preenchimento manual"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-400" /> Rápido
        </button>
      </div>
    </div>
  );
}
