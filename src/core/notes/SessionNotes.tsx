"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollText, Check, Loader2, AlertCircle } from "lucide-react";

interface SessionNotesProps {
  sessionId: string;
  initialNotes: string;
  sessionNumber: number;
}

export function SessionNotes({
  sessionId,
  initialNotes,
  sessionNumber,
}: SessionNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    setSaveStatus("saving");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
        });

        if (res.ok) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2500);
        } else {
          setSaveStatus("error");
        }
      } catch (err) {
        console.error("Erro ao salvar notas:", err);
        setSaveStatus("error");
      }
    }, 700);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [notes, sessionId]);

  return (
    <section className="p-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-[var(--accent-green)]" />
          <h2 className="text-base font-semibold">
            Anotações da Sessão #{sessionNumber}
          </h2>
        </div>

        <div className="text-xs flex items-center gap-1.5 font-medium transition-all">
          {saveStatus === "saving" && (
            <span className="text-amber-400 flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Salvando...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Salvo no banco
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Erro ao salvar
            </span>
          )}
          {saveStatus === "idle" && (
            <span className="text-[var(--text-muted)]">Salvo automaticamente</span>
          )}
        </div>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={6}
        placeholder="Escreva aqui ideias, pistas, segredos, eventos da sessão, lembretes de regras ou tesouros..."
        className="w-full bg-[var(--bg-input,#121218)] border border-[var(--border-default)] rounded-lg p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors resize-y leading-relaxed font-sans"
      />
    </section>
  );
}
