"use client";

import { Portal } from "@/core/ui";
import {
  NEW_SHADOW_STYLE_BASIC_FUNCTION,
  SIMPLE_DOMAIN_MODS_ONLY,
  NEW_SHADOW_STYLE_TECHNIQUES,
  SimpleDomainModification,
} from "../../data/newShadowStyle";
import { X, Shield, Sparkles, Plus, AlertTriangle, Swords } from "lucide-react";

interface ShadowStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterLevel?: number;
  onApplySpell?: (spell: {
    name: string;
    level: number;
    peCost: number;
    action: string;
    range: string;
    duration: string;
    effect: string;
  }) => void;
}

export function ShadowStyleModal({
  isOpen,
  onClose,
  characterLevel = 1,
  onApplySpell,
}: ShadowStyleModalProps) {
  if (!isOpen) return null;

  const isBelowLevel4 = characterLevel < 4;

  function handleAddTechnique(item: SimpleDomainModification) {
    if (!onApplySpell) return;
    const costMatch = item.cost.match(/\d+/);
    const peCost = costMatch ? parseInt(costMatch[0], 10) : 2;
    onApplySpell({
      name: `Estilo da Sombra: ${item.name}`,
      level: item.type === "Técnica de Estilo Especial" ? 2 : 1,
      peCost,
      action: item.action,
      range: "Domínio Simples / Próprio",
      duration: item.duration,
      effect: `${item.description} [${item.cost}]`,
    });
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-4xl h-[90dvh] sm:h-[85vh] max-h-[90dvh] sm:max-h-[85vh] bg-[#14161A] border border-[#23272F] rounded-2xl shadow-2xl flex flex-col min-h-0 overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23272F] bg-[#0B0C0E] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Novo Estilo da Sombra (Shinkage-ryū)
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                    Regras Oficiais v2.5
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Fundamentos marciais e técnicas de combate derivadas do Domínio Simples.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo com Scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
            {/* Aviso de Nível Oficial */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Requisito de Desbloqueio Oficial: Nível 4</span>
                {isBelowLevel4 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-200 border border-amber-700/50">
                    Seu Nível: {characterLevel}
                  </span>
                )}
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                {NEW_SHADOW_STYLE_BASIC_FUNCTION.description}
              </p>
            </div>

            {/* Seção 1: Técnicas de Estilo Especiais */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-rose-400" />
                Técnicas de Estilo Especiais ({NEW_SHADOW_STYLE_TECHNIQUES.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {NEW_SHADOW_STYLE_TECHNIQUES.map((tech: SimpleDomainModification) => (
                  <div
                    key={tech.id}
                    className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#23272F] hover:border-indigo-500/40 flex flex-col justify-between space-y-2 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-indigo-300">{tech.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-200 border border-indigo-800/40">
                          {tech.cost}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mb-2">
                        {tech.action} • {tech.duration}
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        {tech.description}
                      </p>
                    </div>

                    {onApplySpell && (
                      <button
                        type="button"
                        onClick={() => handleAddTechnique(tech)}
                        className="w-full mt-2 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#14161A] hover:bg-rose-600 text-zinc-200 hover:text-white border border-[#23272F] hover:border-rose-500 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar à Ficha
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Seção 2: Modificações de Domínio Simples */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Modificações de Domínio Simples ({SIMPLE_DOMAIN_MODS_ONLY.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SIMPLE_DOMAIN_MODS_ONLY.map((mod: SimpleDomainModification) => (
                  <div
                    key={mod.id}
                    className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#23272F] hover:border-sky-500/40 flex flex-col justify-between space-y-2 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-sky-300">{mod.name}</span>
                        {mod.stackable && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                            Acumulável
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 mb-2">
                        {mod.action} • {mod.cost}
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    {onApplySpell && (
                      <button
                        type="button"
                        onClick={() => handleAddTechnique(mod)}
                        className="w-full mt-2 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#14161A] hover:bg-sky-600 text-zinc-200 hover:text-white border border-[#23272F] hover:border-sky-500 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar à Ficha
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
