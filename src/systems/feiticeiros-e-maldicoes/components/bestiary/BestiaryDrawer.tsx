"use client";

import { useState } from "react";
import { Skull, X, Search, Filter } from "lucide-react";
import { ThreatFormModal } from "./ThreatFormModal";
import { ThreatCard } from "./ThreatCard";
import { FMCharacterData, parseCharacterData } from "../../schemas";
import { Portal } from "@/core/ui";

interface CharacterSummary {
  id: string;
  name: string;
  type: string;
  data: string;
}

interface BestiaryDrawerProps {
  campaignId: string;
  characters: CharacterSummary[];
  isOpen: boolean;
  onClose: () => void;
  onReloadCampaign?: () => void;
  onCloneToCombat?: (charData: FMCharacterData, threatName: string, threatId: string) => void;
}

export function BestiaryDrawer({
  campaignId,
  characters,
  isOpen,
  onClose,
  onReloadCampaign,
  onCloneToCombat,
}: BestiaryDrawerProps) {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("TODOS");

  if (!isOpen) return null;

  // Filtra apenas personagens de tipo THREAT ou NPC
  const threats = characters.filter((c) => c.type === "THREAT" || c.type === "NPC");

  const filteredThreats = threats.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedGrade === "TODOS") return true;

    try {
      const parsed = parseCharacterData(c.data);
      return parsed.grade === selectedGrade;
    } catch {
      return false;
    }
  });

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#14161A] border-l border-[#23272F] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23272F] bg-[#0B0C0E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Bestiário de Ameaças & Maldições
              </h2>
              <p className="text-xs text-zinc-400">
                Inimigos cadastrados na campanha ({threats.length})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThreatFormModal
              campaignId={campaignId}
              onSuccess={() => {
                if (onReloadCampaign) onReloadCampaign();
                else window.location.reload();
              }}
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="p-4 border-b border-[var(--border-default)] bg-[var(--bg-secondary)] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar maldição ou ameaça por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            {["TODOS", "4° Grau", "3° Grau", "2° Grau", "1° Grau", "Grau Especial"].map(
              (g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGrade(g)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedGrade === g
                      ? "bg-red-600 text-white"
                      : "bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-white"
                  }`}
                >
                  {g}
                </button>
              )
            )}
          </div>
        </div>

        {/* Lista de Ameaças */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredThreats.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)]">
              <Skull className="w-10 h-10 mb-2 opacity-30 text-red-400" />
              <p className="text-sm font-medium">Nenhuma ameaça encontrada.</p>
              <p className="text-xs mt-1">
                Cadastre maldições usando o botão &quot;+ Nova Ameaça&quot; acima.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredThreats.map((threat) => (
                <ThreatCard
                  key={threat.id}
                  campaignId={campaignId}
                  threat={threat}
                  onCloneToCombat={(charData, threatName, threatId) => {
                    if (onCloneToCombat) {
                      onCloneToCombat(charData, threatName, threatId);
                    } else {
                      window.dispatchEvent(
                        new CustomEvent("clone-threat-to-combat", {
                          detail: { threatName, threatId, charData },
                        })
                      );
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}
