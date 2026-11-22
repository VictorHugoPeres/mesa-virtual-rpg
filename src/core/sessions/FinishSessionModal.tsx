"use client";

import { useState } from "react";
import { Flag, X, Check, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { useDialog } from "@/core/ui";

interface FinishSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  sessionNumber: number;
  initialTitle: string;
  initialNotes: string;
  startedAt?: string | Date;
  onSuccess: (newSession: any) => void;
}

export function FinishSessionModal({
  isOpen,
  onClose,
  campaignId,
  sessionNumber,
  initialTitle,
  initialNotes,
  startedAt,
  onSuccess,
}: FinishSessionModalProps) {
  const { toast } = useDialog();
  const [title, setTitle] = useState(initialTitle || `Sessão ${sessionNumber}`);
  const [notes, setNotes] = useState(initialNotes || "");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const startDateStr = startedAt
    ? new Date(startedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Data não registrada";

  async function handleFinish() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "finish",
          title: title.trim() || `Sessão ${sessionNumber}`,
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Falha ao finalizar sessão");
      }

      const data = await res.json();
      toast.success(`Sessão #${sessionNumber} concluída! Sessão #${data.newSession?.sessionNumber ?? (sessionNumber + 1)} iniciada.`);
      onSuccess(data.newSession);
      onClose();
    } catch (err) {
      console.error("Erro ao encerrar sessão:", err);
      toast.error("Erro ao finalizar sessão no servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-2xl shadow-2xl p-5 text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Finalizar Sessão #{sessionNumber}</h3>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-zinc-500" /> Iniciada em: {startDateStr}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário de Revisão */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 mb-1">
              Título / Resumo da Sessão
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: A Batalha na Floresta Sombria"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white focus:outline-none focus:border-amber-500 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-300 mb-1">
              Anotações & Acontecimentos desta Sessão
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Resumo dos eventos da mesa, itens obtidos, ganchos deixados em aberto..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white focus:outline-none focus:border-amber-500 text-xs resize-y leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-amber-500/20 text-amber-200/90 flex items-start gap-2.5 text-[11px]">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Ao concluir, esta sessão será arquivada no <strong>Diário de Sessões</strong> com suas rolagens. A <strong>Sessão #{sessionNumber + 1}</strong> será aberta como ATIVA com histórico limpo. Personagens, fichas e mapas continuam preservados.
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs border border-white/10 cursor-pointer"
          >
            Voltar
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleFinish}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Concluir Sessão #{sessionNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
