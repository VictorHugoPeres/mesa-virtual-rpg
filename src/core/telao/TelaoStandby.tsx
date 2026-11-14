"use client";

import { Swords } from "lucide-react";

interface TelaoStandbyProps {
  campaignName: string;
}

export function TelaoStandby({ campaignName }: TelaoStandbyProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-red-600/10 rounded-full blur-2xl" />
        <div className="relative p-5 rounded-2xl bg-[#0d0d14] border border-[#222233] shadow-2xl">
          <Swords className="w-16 h-16 text-red-500/80 animate-pulse" />
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white/90 drop-shadow-md mb-3">
        {campaignName}
      </h1>

      <p className="text-sm md:text-base text-zinc-500 uppercase tracking-widest font-semibold">
        Mesa Virtual RPG · Modo Telão
      </p>

      <div className="mt-8 flex items-center gap-2 text-xs text-zinc-600">
        <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-ping" />
        <span>Sincronizado e pronto para projeção</span>
      </div>
    </div>
  );
}
