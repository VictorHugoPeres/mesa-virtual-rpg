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
      <div className="pb-2 border-b border-[#23272F]">
        <h3 className="font-semibold text-xs text-zinc-200">
          Lore, Ganchos & Segredos Permanentes
        </h3>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Estas anotações não são arquivadas ao finalizar sessões; permanecem intactas ao longo de toda a campanha.
        </p>
      </div>

      <textarea
        value={generalNotes}
        onChange={(e) => setGeneralNotes(e.target.value)}
        rows={7}
        placeholder="Informações perenes do cenário, NPCs importantes, segredos do mestre, ganchos da campanha..."
        className="w-full bg-[#0B0C0E] border border-[#23272F] rounded-lg p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500/40 transition-colors resize-y leading-relaxed font-sans"
      />
    </>
  );
}
