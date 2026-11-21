"use client";

import { useState } from "react";
import {
  COMPENDIUM_CATEGORIES,
  COMPENDIUM_ENTRIES,
  CompendiumEntry,
} from "./compendiumData";
import { BookOpen, X, Search, Shield, Flame, Skull, Activity, Swords, GraduationCap } from "lucide-react";

interface QuickCompendiumDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCompendiumDrawer({ isOpen, onClose }: QuickCompendiumDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredEntries = COMPENDIUM_ENTRIES.filter((item) => {
    const matchesCategory =
      selectedCategory === "todos" || item.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.details.some((d) => d.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const categoryIcons: Record<string, React.ReactNode> = {
    iniciantes: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />,
    combate: <Swords className="w-3.5 h-3.5 text-red-400" />,
    testes: <Shield className="w-3.5 h-3.5 text-blue-400" />,
    condicoes: <Activity className="w-3.5 h-3.5 text-amber-400" />,
    dominios: <Flame className="w-3.5 h-3.5 text-purple-400" />,
    morte: <Skull className="w-3.5 h-3.5 text-rose-400" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg h-full bg-[var(--bg-card)] border-l border-[var(--border-default)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header do Compêndio */}
        <div className="px-5 py-4 border-b border-[var(--border-default)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base">Compêndio Rápido Jujutsu</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Pesquisar regras, condições, ações ou domínios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Categorias (Pills) */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("todos")}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === "todos"
                  ? "bg-indigo-600 text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Todos
            </button>
            {COMPENDIUM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === cat.id
                    ? "bg-indigo-600 text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {categoryIcons[cat.id]}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Entradas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="py-16 text-center text-xs text-[var(--text-muted)]">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Nenhuma regra encontrada para &quot;{search}&quot;.</p>
            </div>
          ) : (
            filteredEntries.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-2 hover:border-[var(--border-accent)] transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                    {categoryIcons[item.category]}
                    {item.title}
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-default)]">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-indigo-300 font-medium">
                  {item.summary}
                </p>

                <ul className="text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside pt-1">
                  {item.details.map((d, i) => (
                    <li key={i} className="leading-relaxed">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
