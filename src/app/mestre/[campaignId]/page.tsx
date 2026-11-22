import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { NewCharacterModal } from "@/components/NewCharacterModal";
import { CampaignMasterToolbar } from "@/components/CampaignMasterToolbar";
import { CampaignCharacterCard } from "@/components/CampaignCharacterCard";
import { InitiativePanel } from "@/core/initiative/InitiativePanel";
import { CampaignNotesPanel } from "@/core/notes/CampaignNotesPanel";
import { MasterBestiaryWrapper } from "@/components/MasterBestiaryWrapper";
import { MasterAudioSection } from "@/core/audio/MasterAudioSection";
import { MasterMapWrapper } from "@/core/map/MasterMapWrapper";

export const dynamic = "force-dynamic";

export default async function MasterPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      characters: true,
      sessions: { orderBy: { sessionNumber: "desc" } },
    },
  });

  if (!campaign) return notFound();

  // Garante que haja uma sessão ativa para as anotações
  let activeSession = campaign.sessions.find((s) => s.status === "ACTIVE") || campaign.sessions[0];
  if (!activeSession) {
    activeSession = await prisma.session.create({
      data: {
        campaignId: campaign.id,
        sessionNumber: 1,
        number: 1,
        title: "Sessão 1 — Início da campanha",
        status: "ACTIVE",
        notes: "Sessão 1 — Início da campanha.",
      },
    });
  }

  const systemLabel =
    campaign.systemId === "feiticeiros-e-maldicoes"
      ? "Feiticeiros e Maldições"
      : campaign.systemId;

  // Separa jogadores das ameaças do bestiário
  const playerCharacters = campaign.characters.filter((c) => c.type !== "THREAT");

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto space-y-6">
      {/* Topo / Breadcrumb + Barra de Ferramentas */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          <BrandLogo variant="compact" size="sm" />
          <span className="font-semibold text-xs tracking-wide">Campanhas</span>
        </Link>

        <CampaignMasterToolbar campaignId={campaign.id} />
      </div>

      {/* Header da campanha */}
      <header className="pb-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3 mb-1">
          <BrandLogo variant="full" size="lg" />
          <div className="h-6 w-px bg-white/10" />
          <h1 className="text-2xl font-bold tracking-tight text-white">{campaign.name}</h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Sistema:{" "}
          <span className="text-[var(--accent-purple)] font-medium">
            {systemLabel}
          </span>
          {" · "}
          {campaign.sessions.length}{" "}
          {campaign.sessions.length === 1 ? "sessão" : "sessões"}
        </p>
      </header>

      {/* Mesa de Som e Player de Música Ambiente */}
      <MasterAudioSection campaignId={campaign.id} />

      {/* 1. Tracker de Iniciativa e Combate */}
      <InitiativePanel
        campaignId={campaign.id}
        characters={campaign.characters}
      />

      {/* 2. Grid com Personagens e Anotações da Sessão */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna 1 & 2: Personagens da Campanha */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--accent-blue)]" />
              Personagens Jogadores ({playerCharacters.length})
            </h2>
            <NewCharacterModal campaignId={campaign.id} />
          </div>

          {playerCharacters.length === 0 ? (
            <div className="p-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] text-center">
              <p className="text-[var(--text-muted)] text-sm">
                Nenhum personagem cadastrado nesta campanha.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {playerCharacters.map((char) => (
                <CampaignCharacterCard
                  key={char.id}
                  campaignId={campaign.id}
                  char={char}
                />
              ))}
            </div>
          )}
        </section>

        {/* Coluna 3: Anotações da Sessão Atual & Notas Gerais da Campanha */}
        <section className="lg:col-span-1">
          <CampaignNotesPanel
            campaignId={campaign.id}
            initialGeneralNotes={campaign.generalNotes || ""}
            activeSession={{
              id: activeSession.id,
              sessionNumber: activeSession.sessionNumber || activeSession.number || 1,
              title: activeSession.title || `Sessão ${activeSession.sessionNumber || activeSession.number || 1}`,
              notes: activeSession.notes || "",
              startedAt: activeSession.startedAt,
            }}
          />
        </section>
      </div>

      {/* Gaveta do Bestiário de Ameaças */}
      <MasterBestiaryWrapper
        campaignId={campaign.id}
        characters={campaign.characters}
      />

      {/* Workspace do Tabuleiro Tático */}
      <MasterMapWrapper campaignId={campaign.id} />

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[var(--border-default)] text-center text-xs text-[var(--text-muted)]">
        Painel do Mestre — Feiticeiros e Maldições RPG
      </footer>
    </main>
  );
}
