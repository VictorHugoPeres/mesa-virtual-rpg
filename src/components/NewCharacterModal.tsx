"use client";

import { useState } from "react";
import { UserPlus, X, Wand2, FileText, Sparkles, ChevronRight } from "lucide-react";
import { Portal } from "@/core/ui";
import { QuickCharacterForm } from "./QuickCharacterForm";
import { CharacterWizardModal } from "@/systems/feiticeiros-e-maldicoes/components/wizard/CharacterWizardModal";

export function NewCharacterModal({ campaignId }: { campaignId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"choice" | "quick">("choice");
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  function handleOpen() {
    setMode("choice");
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setMode("choice");
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold
                   bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-sm cursor-pointer select-none active:scale-95"
      >
        <UserPlus className="w-4 h-4" />
        Novo Personagem
      </button>

      {/* Modal de Escolha Inicial ou Ficha Rápida */}
      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
              <h3 className="text-base font-bold">Novo Personagem</h3>
              <button
                onClick={handleClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {mode === "choice" ? (
              <div className="p-6 space-y-4">
                <p className="text-xs text-[var(--text-secondary)]">
                  Como você deseja criar o novo personagem para a campanha?
                </p>

                {/* Opção 1: Criador Guiado */}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setIsWizardOpen(true);
                  }}
                  className="w-full p-4 rounded-xl border border-blue-500/50 bg-blue-950/20 hover:bg-blue-950/40 text-left transition-all flex items-start gap-3.5 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[var(--text-primary)]">
                        Criador Guiado (Passo a Passo)
                      </span>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-700/60 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Recomendado
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Ideal para iniciantes. Questionário em 7 etapas com cards para Origem, Classe, Atributos, Perícias, Feitiços e Equipamentos com cálculos automáticos.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-blue-400 shrink-0 self-center transition-colors" />
                </button>

                {/* Opção 2: Ficha Rápida em Branco */}
                <button
                  type="button"
                  onClick={() => setMode("quick")}
                  className="w-full p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] hover:border-gray-500 text-left transition-all flex items-start gap-3.5 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-all shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[var(--text-primary)]">
                        Ficha Rápida em Branco
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Para mestres ou veteranos que preferem preencher diretamente todos os campos na ficha aberta.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] shrink-0 self-center transition-colors" />
                </button>
              </div>
            ) : (
              <QuickCharacterForm
                campaignId={campaignId}
                onClose={handleClose}
                onBackToOptions={() => setMode("choice")}
              />
            )}
          </div>
          </div>
        </Portal>
      )}

      {/* Modal do Criador Guiado */}
      <CharacterWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        campaignId={campaignId}
      />
    </>
  );
}
