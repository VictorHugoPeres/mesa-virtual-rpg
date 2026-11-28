"use client";

import { useState } from "react";
import { Portal } from "@/core/ui";
import {
  READY_MARTIAL_TECHNIQUES,
  MartialTechnique,
} from "../../data/martialTechniques";
import { X, Swords, Lock, Plus, Shield, Search } from "lucide-react";

interface MartialTechniquesModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterLevel?: number;
  onAddTechnique?: (tech: {
    name: string;
    level: number;
    peCost: number;
    action: string;
    range: string;
    duration: string;
    effect: string;
  }) => void;
}

export function MartialTechniquesModal({
  isOpen,
  onClose,
  characterLevel = 1,
  onAddTechnique,
}: MartialTechniquesModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | "todos">("todos");
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  function isLevelUnlocked(techLevel: number): boolean {
    if (techLevel === 1) return true;
    if (techLevel === 2) return characterLevel >= 5;
    if (techLevel === 3) return characterLevel >= 9;
    if (techLevel === 4) return characterLevel >= 15;
    return false;
  }

  function getRequiredCharacterLevel(techLevel: number): number {
    if (techLevel === 2) return 5;
    if (techLevel === 3) return 9;
    if (techLevel === 4) return 15;
    return 1;
  }

  const filtered = READY_MARTIAL_TECHNIQUES.filter((t) => {
    const matchesLevel = selectedLevel === "todos" || t.level === selectedLevel;
    const matchesSearch =
      !search.trim() ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  function handleSelect(tech: MartialTechnique) {
    if (!onAddTechnique) return;
    onAddTechnique({
      name: tech.name,
      level: tech.level,
      peCost: tech.staminaCost,
      action: tech.action,
      range: tech.range,
      duration: tech.duration,
      effect: `${tech.description}${tech.prerequisite ? ` (Pré-requisito: ${tech.prerequisite})` : ""}`,
    });
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-4xl h-[90dvh] sm:h-[85vh] max-h-[90dvh] sm:max-h-[85vh] bg-[#14161A] border border-[#23272F] rounded-2xl shadow-2xl flex flex-col min-h-0 overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23272F] bg-[#0B0C0E] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Arsenal Marcial Oficial (Restringido)
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
                    {READY_MARTIAL_TECHNIQUES.length} Técnicas Oficiais
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Manobras físicas avançadas e artes marciais alimentadas por Estamina.
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

          {/* Filtros */}
          <div className="p-3.5 border-b border-[#23272F] bg-[#0B0C0E]/50 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedLevel("todos")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedLevel === "todos"
                    ? "bg-amber-600 text-white"
                    : "bg-[#0B0C0E] text-zinc-400 hover:text-white border border-[#23272F]"
                }`}
              >
                Todos os Níveis
              </button>
              {[1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedLevel === lvl
                      ? "bg-amber-600 text-white"
                      : "bg-[#0B0C0E] text-zinc-400 hover:text-white border border-[#23272F]"
                  }`}
                >
                  Nível {lvl}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar técnica marcial..."
                className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Grade de Técnicas */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((tech) => {
                const unlocked = isLevelUnlocked(tech.level);
                const reqCharLevel = getRequiredCharacterLevel(tech.level);

                return (
                  <div
                    key={tech.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                      unlocked
                        ? "bg-[#0B0C0E] border-[#23272F] hover:border-amber-500/40"
                        : "bg-[#0B0C0E]/40 border-white/5 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-amber-300">{tech.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-200 border border-amber-800/40">
                            Nível {tech.level}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {tech.staminaCost} EST
                        </span>
                      </div>

                      <div className="text-[10px] text-zinc-400 mb-2 flex items-center gap-1.5 flex-wrap">
                        <span>{tech.action}</span>
                        <span>•</span>
                        <span>{tech.category}</span>
                        <span>•</span>
                        <span>{tech.range}</span>
                      </div>

                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        {tech.description}
                      </p>

                      {tech.prerequisite && (
                        <p className="text-[10px] text-zinc-500 italic mt-1.5">
                          Pré-requisito: {tech.prerequisite}
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      {!unlocked ? (
                        <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] text-zinc-500 font-semibold bg-white/5 rounded-lg border border-white/5">
                          <Lock className="w-3.5 h-3.5 text-zinc-500" /> Requer Personagem Nível {reqCharLevel}
                        </div>
                      ) : onAddTechnique ? (
                        <button
                          type="button"
                          onClick={() => handleSelect(tech)}
                          className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#14161A] hover:bg-amber-600 text-zinc-200 hover:text-white border border-[#23272F] hover:border-amber-500 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar ao Arsenal
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
