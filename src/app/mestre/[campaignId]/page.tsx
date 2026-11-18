import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Swords, User } from "lucide-react";
import { NewCharacterModal } from "@/components/NewCharacterModal";
import { CampaignMasterToolbar } from "@/components/CampaignMasterToolbar";
import { CampaignCharacterCard } from "@/components/CampaignCharacterCard";
import { InitiativePanel } from "@/core/initiative/InitiativePanel";
import { SessionNotes } from "@/core/notes/SessionNotes";
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
      sessions: { orderBy: { number: "desc" } },
    },
  });

  if (!campaign) return notFound();

  // Garante que haja pelo menos uma sessão para as anotações
  let latestSession = campaign.sessions[0];
  if (!latestSession) {
    latestSession = await prisma.session.create({
      data: {
        campaignId: campaign.id,
        number: 1,
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
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às Campanhas
        </Link>

        <CampaignMasterToolbar campaignId={campaign.id} />
      </div>

      {/* Header da campanha */}
      <header className="pb-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3 mb-1">
          <Swords className="w-7 h-7 text-red-500" />
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
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

        {/* Coluna 3: Anotações da Sessão Atual com Autosave */}
        <section className="lg:col-span-1">
          <SessionNotes
            sessionId={latestSession.id}
            initialNotes={latestSession.notes}
            sessionNumber={latestSession.number}
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
