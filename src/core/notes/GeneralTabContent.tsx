"use client";

interface GeneralTabContentProps {
  generalNotes: string;
  setGeneralNotes: (notes: string) => void;
}

export function GeneralTabContent({
  generalNotes,
  setGeneralNotes,
}: GeneralTabContentProps) {
  return (
    <>
      <div className="pb-2 border-b border-[var(--border-default)]">
        <h3 className="font-bold text-xs text-blue-300">
          Lore, Ganchos & Segredos Permanentes
        </h3>
        <p className="text-[10px] text-[var(--text-muted)]">
          Estas anotações não são arquivadas ao finalizar sessões; permanecem intactas ao longo de toda a campanha.
        </p>
      </div>

      <textarea
        value={generalNotes}
        onChange={(e) => setGeneralNotes(e.target.value)}
        rows={7}
        placeholder="Informações perenes do cenário, NPCs importantes, segredos do mestre, ganchos da campanha..."
        className="w-full bg-[var(--bg-input,#121218)] border border-[var(--border-default)] rounded-lg p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors resize-y leading-relaxed font-sans"
      />
    </>
  );
}
