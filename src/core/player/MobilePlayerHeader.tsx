"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { BrandLogo } from "@/components/BrandLogo";

interface MobilePlayerHeaderProps {
  campaignId: string;
  characterName: string;
  sheet: FMCharacterData;
}

export function MobilePlayerHeader({
  campaignId,
  characterName,
  sheet,
}: MobilePlayerHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#0B0C0E] border-b border-[#23272F] px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Link
          href={`/jogador/${campaignId}`}
          className="p-1.5 rounded-lg bg-[#14161A] border border-[#23272F] text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
          title="Trocar Personagem"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <BrandLogo variant="compact" size="sm" />
        </Link>
        <div>
          <h2 className="text-sm font-black text-zinc-100 leading-tight truncate max-w-[190px]">
            {characterName}
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <span className="text-rose-400 font-semibold">{sheet.specialization}</span>
            <span>•</span>
            <span>{sheet.origin}</span>
            <span>•</span>
            <span>Nvl {sheet.level}</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <span className="text-[10px] uppercase font-bold text-zinc-300 bg-[#14161A] border border-[#23272F] px-2 py-0.5 rounded-full inline-block">
          {sheet.grade || "4° Grau"}
        </span>
      </div>
    </header>
  );
}
