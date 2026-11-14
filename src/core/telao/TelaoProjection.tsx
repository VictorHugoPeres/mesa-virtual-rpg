"use client";

import { ProjectionData } from "../sync/syncTypes";

interface TelaoProjectionProps {
  projection: ProjectionData;
}

export function TelaoProjection({ projection }: TelaoProjectionProps) {
  if (!projection.mediaUrl) return null;

  const categoryLabels: Record<string, string> = {
    SCENE: "Cena / Cenário",
    NPC: "Personagem / NPC",
    MAP: "Mapa / Local",
    HANDOUT: "Documento / Pista",
  };

  const categoryLabel = projection.category
    ? categoryLabels[projection.category] || projection.category
    : null;

  return (
    <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden select-none animate-in fade-in duration-700">
      {/* Imagem projetada em destaque preenchendo a tela sem distorção */}
      <img
        src={projection.mediaUrl}
        alt={projection.title || "Projeção do Mestre"}
        className="w-full h-full object-contain max-h-[96vh] drop-shadow-2xl transition-all duration-500"
      />

      {/* Legenda/Título elegante translúcido no rodapé (se houver título) */}
      {projection.title && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-center shadow-2xl animate-in slide-in-from-bottom duration-300">
          <p className="text-lg md:text-xl font-bold text-white tracking-wide">
            {projection.title}
          </p>
          {categoryLabel && (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              {categoryLabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
