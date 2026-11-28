"use client";

import { useState } from "react";
import { Portal } from "@/core/ui";
import { READY_TECHNIQUES, TECHNIQUE_CATEGORIES, InnateTechnique, ReadySpell } from "../../data/techniques";
import { TechniqueDetailView } from "./TechniqueDetailView";
import { AttributeKey, ATTRIBUTE_KEYS } from "../../constants";
import { BookOpen, X, Search, Sparkles, Filter, Swords, Shield } from "lucide-react";
import { MartialTechniquesModal } from "./MartialTechniquesModal";
import { ShadowStyleModal } from "./ShadowStyleModal";

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
    domainExpansion?: {
      name: string;
      type: string;
      cost: number;
      description: string;
    };
  }) => void;
  onApplySpell?: (spell: any) => void;
}

export function TechniqueCatalogModal({
  isOpen,
  onClose,
  characterLevel = 1,
  maxSpells = 2,
  onApplyTechnique,
  onApplySpell,
}: TechniqueCatalogModalProps) {
  const [selectedTechId, setSelectedTechId] = useState<string>("ilimitado");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedAttr, setSelectedAttr] = useState<string>("todos");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [isMartialOpen, setIsMartialOpen] = useState(false);
  const [isShadowOpen, setIsShadowOpen] = useState(false);

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
    domainExpansion?: any;
  }) {
    onApplyTechnique(techData);
    onClose();
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-5xl h-[92dvh] sm:h-[85vh] max-h-[92dvh] sm:max-h-[85vh] bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-2xl flex flex-col min-h-0 overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header Superior */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23272F] bg-[#0B0C0E] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Catálogo Oficial de Técnicas Inatas
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold">
                    {READY_TECHNIQUES.length} Técnicas da Obra
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Selecione uma técnica pronta para importar seu funcionamento básico e feitiços para a ficha.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsShadowOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-indigo-500/40 text-indigo-300 hover:text-indigo-200 transition-all cursor-pointer"
                title="Explorar o Novo Estilo da Sombra e Domínio Simples"
              >
                <Shield className="w-3.5 h-3.5" /> Estilo da Sombra
              </button>

              <button
                type="button"
                onClick={() => setIsMartialOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-amber-500/40 text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
                title="Explorar o Arsenal Marcial do Restringido"
              >
                <Swords className="w-3.5 h-3.5" /> Arsenal Marcial
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Corpo: Grade Dividida (Lista Lateral + Detalhes) */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Coluna Esquerda: Filtros e Lista */}
            <div className={`w-full md:w-80 lg:w-96 h-full flex-1 md:flex-none border-r border-[var(--border-default)] flex-col min-h-0 bg-[var(--bg-card)] ${
              mobileView === "detail" ? "hidden md:flex" : "flex"
            }`}>
              {/* Barra de Busca e Filtros */}
              <div className="p-3.5 border-b border-[var(--border-default)] space-y-2.5 bg-[var(--bg-secondary)]/30 shrink-0">
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

                <div className="flex flex-wrap items-center gap-1.5 pt-1 max-h-24 overflow-y-auto scrollbar-none">
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
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-2 space-y-1 pb-10">
                {filteredTechs.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] p-4 text-center">Nenhuma técnica encontrada.</p>
                ) : (
                  filteredTechs.map((t) => {
                    const isSelected = (activeTech?.id === t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedTechId(t.id);
                          setMobileView("detail");
                        }}
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
            <div className={`flex-1 min-w-0 min-h-0 h-full overflow-hidden flex flex-col ${
              mobileView === "list" ? "hidden md:flex" : "flex"
            }`}>
              {activeTech ? (
                <TechniqueDetailView
                  technique={activeTech}
                  characterLevel={characterLevel}
                  maxSpells={maxSpells}
                  onApply={handleApply}
                  onBack={() => setMobileView("list")}
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

      <MartialTechniquesModal
        isOpen={isMartialOpen}
        onClose={() => setIsMartialOpen(false)}
        characterLevel={characterLevel}
        onAddTechnique={onApplySpell ? (tech) => {
          onApplySpell(tech);
          setIsMartialOpen(false);
          onClose();
        } : undefined}
      />

      <ShadowStyleModal
        isOpen={isShadowOpen}
        onClose={() => setIsShadowOpen(false)}
        characterLevel={characterLevel}
        onApplySpell={onApplySpell ? (spell) => {
          onApplySpell(spell);
          setIsShadowOpen(false);
          onClose();
        } : undefined}
      />
    </Portal>
  );
}
