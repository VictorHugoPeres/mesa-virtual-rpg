"use client";

import { useState } from "react";
import { Portal } from "@/core/ui";
import { READY_TECHNIQUES, TECHNIQUE_CATEGORIES, InnateTechnique, ReadySpell } from "../../data/techniques";
import { TechniqueDetailView } from "./TechniqueDetailView";
import { AttributeKey, ATTRIBUTE_KEYS } from "../../constants";
import { BookOpen, X, Search, Sparkles, Filter } from "lucide-react";

interface TechniqueCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterLevel?: number;
  maxSpells?: number;
  onApplyTechnique: (tech: {
    name: string;
    attribute: AttributeKey;
    description: string;
    selectedSpells: ReadySpell[];
  }) => void;
}

export function TechniqueCatalogModal({
  isOpen,
  onClose,
  characterLevel = 1,
  maxSpells = 2,
  onApplyTechnique,
}: TechniqueCatalogModalProps) {
  const [selectedTechId, setSelectedTechId] = useState<string>("ilimitado");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedAttr, setSelectedAttr] = useState<string>("todos");

  if (!isOpen) return null;

  const filteredTechs = READY_TECHNIQUES.filter((t) => {
    const matchesSearch =
      !search.trim() ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.characterRef.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "todos" || t.category === selectedCategory;
    const matchesAttr = selectedAttr === "todos" || t.suggestedAttribute === selectedAttr;

    return matchesSearch && matchesCategory && matchesAttr;
  });

  const activeTech = READY_TECHNIQUES.find((t) => t.id === selectedTechId) || filteredTechs[0] || READY_TECHNIQUES[0];

  function handleApply(techData: {
    name: string;
    attribute: AttributeKey;
    description: string;
    selectedSpells: ReadySpell[];
  }) {
    onApplyTechnique(techData);
    onClose();
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-5xl h-[90vh] bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header Superior */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-default)] bg-[var(--bg-secondary)] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Catálogo Oficial de Técnicas Inatas
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                    {READY_TECHNIQUES.length} Técnicas da Obra
                  </span>
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Selecione uma técnica pronta para importar seu funcionamento básico e feitiços para a ficha.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corpo: Grade Dividida (Lista Lateral + Detalhes) */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Coluna Esquerda: Filtros e Lista */}
            <div className="w-full md:w-80 lg:w-96 border-r border-[var(--border-default)] flex flex-col shrink-0 bg-[var(--bg-card)]">
              {/* Barra de Busca e Filtros */}
              <div className="p-3.5 border-b border-[var(--border-default)] space-y-2.5 bg-[var(--bg-secondary)]/30">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar técnica ou personagem..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("todos")}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === "todos"
                        ? "bg-blue-600 text-white"
                        : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    Todas
                  </button>
                  {TECHNIQUE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista com Scroll */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredTechs.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] p-4 text-center">Nenhuma técnica encontrada.</p>
                ) : (
                  filteredTechs.map((t) => {
                    const isSelected = (activeTech?.id === t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTechId(t.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? "bg-blue-600/15 border-blue-500/50 shadow-xs"
                            : "bg-[var(--bg-secondary)]/30 border-transparent hover:bg-[var(--bg-secondary)]/80 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-bold ${isSelected ? "text-blue-400" : "text-white"}`}>
                            {t.name}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-300 border border-amber-800/30">
                            {t.suggestedAttribute}
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)] truncate">
                          {t.characterRef} • {t.category}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Coluna Direita: Detalhes da Técnica Selecionada */}
            <div className="flex-1 min-w-0 h-full overflow-hidden">
              {activeTech ? (
                <TechniqueDetailView
                  technique={activeTech}
                  characterLevel={characterLevel}
                  maxSpells={maxSpells}
                  onApply={handleApply}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">
                  Selecione uma técnica ao lado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
