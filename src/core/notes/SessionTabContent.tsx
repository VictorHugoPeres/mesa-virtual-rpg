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
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#23272F]">
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
                className="px-2 py-0.5 rounded bg-[#0B0C0E] border border-[#23272F] text-xs font-semibold text-white w-full focus:outline-none focus:border-rose-500/40"
              />
              <button
                type="button"
                onClick={() => setIsEditingTitle(false)}
                className="text-[10px] text-zinc-300 font-semibold px-2 py-0.5 rounded bg-[#1A1D24] border border-[#23272F] cursor-pointer"
              >
                OK
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              <h3 className="font-semibold text-xs text-zinc-200 group-hover:text-white truncate">
                {sessionTitle}
              </h3>
              <Edit3 className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
            </div>
          )}
          {startDateStr && (
            <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-2.5 h-2.5" /> Iniciada em {startDateStr}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenFinishModal}
          className="shrink-0 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-rose-500/40 text-zinc-300 hover:text-rose-300 text-[11px] font-medium cursor-pointer transition-all select-none active:scale-95"
          title="Finalizar esta sessão e iniciar a próxima"
        >
          <Flag className="w-3 h-3 text-zinc-400 group-hover:text-rose-400" /> Finalizar Sessão #{sessionNumber}
        </button>
      </div>

      <textarea
        value={sessionNotes}
        onChange={(e) => setSessionNotes(e.target.value)}
        rows={7}
        placeholder="Anotações desta sessão (combates, pistas encontradas, decisões dos jogadores)..."
        className="w-full bg-[#0B0C0E] border border-[#23272F] rounded-lg p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500/40 transition-colors resize-y leading-relaxed font-sans"
      />
    </>
  );
}
