"use client";

import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";

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
    <header className="sticky top-0 z-30 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-default)] px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Link
          href={`/jogador/${campaignId}`}
          className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title="Trocar Personagem"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-sm font-black text-[var(--text-primary)] leading-tight truncate max-w-[190px]">
            {characterName}
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
            <span className="text-blue-400 font-semibold">{sheet.specialization}</span>
            <span>•</span>
            <span>{sheet.origin}</span>
            <span>•</span>
            <span>Nvl {sheet.level}</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/70 border border-blue-800/60 px-2 py-0.5 rounded-full inline-block">
          {sheet.grade || "4° Grau"}
        </span>
      </div>
    </header>
  );
}
