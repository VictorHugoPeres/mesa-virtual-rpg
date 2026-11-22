"use client";

import { Flag, Calendar, Edit3 } from "lucide-react";

interface SessionTabContentProps {
  sessionTitle: string;
  setSessionTitle: (title: string) => void;
  isEditingTitle: boolean;
  setIsEditingTitle: (editing: boolean) => void;
  startDateStr: string;
  sessionNumber: number;
  sessionNotes: string;
  setSessionNotes: (notes: string) => void;
  onOpenFinishModal: () => void;
}

export function SessionTabContent({
  sessionTitle,
  setSessionTitle,
  isEditingTitle,
  setIsEditingTitle,
  startDateStr,
  sessionNumber,
  sessionNotes,
  setSessionNotes,
  onOpenFinishModal,
}: SessionTabContentProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-default)]">
        <div className="flex-1 truncate">
          {isEditingTitle ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                autoFocus
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                className="px-2 py-0.5 rounded bg-[var(--bg-input,#121218)] border border-amber-500/50 text-xs font-bold text-white w-full"
              />
              <button
                type="button"
                onClick={() => setIsEditingTitle(false)}
                className="text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-700/50 cursor-pointer"
              >
                OK
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              <h3 className="font-bold text-xs text-white truncate">
                {sessionTitle}
              </h3>
              <Edit3 className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 shrink-0" />
            </div>
          )}
          {startDateStr && (
            <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
              <Calendar className="w-2.5 h-2.5" /> Iniciada em {startDateStr}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenFinishModal}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold cursor-pointer transition-all"
          title="Finalizar esta sessão e iniciar a próxima"
        >
          <Flag className="w-3 h-3" /> Finalizar Sessão #{sessionNumber}
        </button>
      </div>

      <textarea
        value={sessionNotes}
        onChange={(e) => setSessionNotes(e.target.value)}
        rows={7}
        placeholder="Anotações desta sessão (combates, pistas encontradas, decisões dos jogadores)..."
        className="w-full bg-[var(--bg-input,#121218)] border border-[var(--border-default)] rounded-lg p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition-colors resize-y leading-relaxed font-sans"
      />
    </>
  );
}
