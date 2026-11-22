"use client";

import { BrandLogo } from "@/components/BrandLogo";

interface TelaoStandbyProps {
  campaignName: string;
}

export function TelaoStandby({ campaignName }: TelaoStandbyProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute -inset-8 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 shadow-2xl backdrop-blur-xl">
          <BrandLogo variant="hero" size="xl" />
        </div>
      </div>

      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white/90 drop-shadow-md mb-3">
        {campaignName}
      </h1>

      <p className="text-xs sm:text-sm md:text-base text-zinc-500 uppercase tracking-widest font-semibold">
        Modo Telão · Projeção Ativa
      </p>

      <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-ping" />
        <span>Sincronizado e pronto para projeção</span>
      </div>
    </div>
  );
}

