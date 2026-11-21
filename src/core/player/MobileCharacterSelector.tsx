"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Plus, Shield, Heart, Activity, Sparkles, ChevronRight } from "lucide-react";
import { CharacterWizardModal } from "@/systems/feiticeiros-e-maldicoes/components/wizard/CharacterWizardModal";
import { parseCharacterData } from "@/systems/feiticeiros-e-maldicoes";

interface PCItem {
  id: string;
  name: string;
  type: string;
  data: string;
}

interface MobileCharacterSelectorProps {
  campaignId: string;
  campaignName: string;
  characters: PCItem[];
}

export function MobileCharacterSelector({
  campaignId,
  campaignName,
  characters,
}: MobileCharacterSelectorProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="pt-4 pb-6 text-center space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-0.5 rounded-full inline-block">
          Portal do Jogador
        </span>
        <h1 className="text-xl font-black text-[var(--text-primary)]">{campaignName}</h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Selecione seu personagem para acessar sua ficha e rolar dados.
        </p>
      </div>

      {/* Lista de Personagens */}
      <div className="flex-1 space-y-3 pb-6">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Personagens da Campanha ({characters.length})
          </span>
        </div>

        {characters.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-center space-y-3">
            <User className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
            <p className="text-xs text-[var(--text-secondary)]">
              Nenhum personagem de jogador criado ainda nesta campanha.
            </p>
          </div>
        ) : (
          characters.map((char) => {
            let sheet;
            try {
              sheet = parseCharacterData(char.data);
            } catch {
              sheet = null;
            }

            const hpCurrent = sheet?.hp?.current ?? 0;
            const hpMax = sheet?.hp?.max ?? 0;
            const peCurrent = sheet?.energy?.current ?? 0;
            const peMax = sheet?.energy?.max ?? 0;

            return (
              <Link
                key={char.id}
                href={`/jogador/${campaignId}/${char.id}`}
                className="block p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-blue-500/60 active:scale-[0.98] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-base shrink-0">
                      {char.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] leading-tight">
                        {char.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-muted)]">
                        <span className="text-blue-300 font-medium">
                          {sheet?.specialization || "Lutador"}
                        </span>
                        <span>•</span>
                        <span>{sheet?.origin || "Inato"}</span>
                        <span>•</span>
                        <span>Nvl {sheet?.level || 1}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
                </div>

                {/* Mini Stats Bar */}
                {sheet && (
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[var(--border-default)]/60 text-[11px]">
                    <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
                      <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>PV: {hpCurrent}/{hpMax}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                      <Activity className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>PE: {peCurrent}/{peMax}</span>
                    </div>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>

      {/* Botão Criar Novo Personagem */}
      <div className="pt-2 pb-4">
        <button
          type="button"
          onClick={() => setIsWizardOpen(true)}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Criar Novo Personagem (Guiado)
        </button>
      </div>

      <CharacterWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        campaignId={campaignId}
        redirectPrefix={`/jogador/${campaignId}`}
      />
    </div>
  );
}
