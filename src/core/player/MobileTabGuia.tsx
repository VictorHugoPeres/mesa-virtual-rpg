"use client";

import { useState } from "react";
import {
  COMPENDIUM_CATEGORIES,
  COMPENDIUM_ENTRIES,
  CompendiumEntry,
} from "@/core/compendium/compendiumData";
import { Search, BookOpen, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";

export function MobileTabGuia() {
  const [selectedCategory, setSelectedCategory] = useState<string>("iniciantes");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("d20-como-funciona");

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

  return (
    <div className="space-y-3 pb-20">
      {/* Busca */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
        <input
          type="text"
          placeholder="Pesquisar regras, d20, feitiços..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#14161A] border border-[#23272F] text-zinc-100 focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Categorias Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory("todos")}
          className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === "todos"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-[#14161A] border border-[#23272F] text-zinc-400 hover:text-white"
          }`}
        >
          Todos
        </button>
        {COMPENDIUM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              selectedCategory === cat.id
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-[#14161A] border border-[#23272F] text-zinc-400 hover:text-white"
            }`}
          >
            {cat.id === "iniciantes" && <GraduationCap className="w-3 h-3 text-emerald-300" />}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de Regras (Accordion) */}
      <div className="space-y-2">
        {filteredEntries.map((entry) => {
          const isExpanded = expandedId === entry.id;

          return (
            <div
              key={entry.id}
              className="rounded-xl bg-[#14161A] border border-[#23272F] overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="w-full p-3 text-left flex items-center justify-between cursor-pointer touch-manipulation select-none active:bg-[#1A1D24] transition-colors"
              >
                <div>
                  <h4 className="font-bold text-xs text-zinc-100">{entry.title}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {entry.summary}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-[#23272F] bg-[#0B0C0E]/50 text-xs space-y-1.5">
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 text-[11px] leading-relaxed">
                    {entry.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
