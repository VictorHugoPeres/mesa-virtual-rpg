import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Swords, User, ScrollText } from "lucide-react";
import { NewCharacterModal } from "@/components/NewCharacterModal";
import { CampaignMasterToolbar } from "@/components/CampaignMasterToolbar";
import { CampaignCharacterCard } from "@/components/CampaignCharacterCard";

export const dynamic = "force-dynamic";

export default async function MestrePage({
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

  const systemLabel =
    campaign.systemId === "feiticeiros-e-maldicoes"
      ? "Feiticeiros e Maldições"
      : campaign.systemId;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* Topo / Breadcrumb + Barra de Ferramentas */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)]
                     hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às Campanhas
        </Link>

        <CampaignMasterToolbar campaignId={campaign.id} />
      </div>

      {/* Header da campanha */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
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

      {/* Grid com personagens */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--accent-blue)]" />
            Personagens ({campaign.characters.length})
          </h2>
          <NewCharacterModal campaignId={campaign.id} />
        </div>

        {campaign.characters.length === 0 ? (
          <p className="text-[var(--text-muted)] text-sm">
            Nenhum personagem cadastrado nesta campanha.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {campaign.characters.map((char) => (
              <CampaignCharacterCard
                key={char.id}
                campaignId={campaign.id}
                char={char}
              />
            ))}
          </div>
        )}
      </section>

      {/* Última sessão */}
      {campaign.sessions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-[var(--accent-green)]" />
            Última Sessão
          </h2>
          <div className="p-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)]">
            <p className="text-sm font-medium mb-1">
              Sessão #{campaign.sessions[0].number}
            </p>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
              {campaign.sessions[0].notes || "Sem anotações."}
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-[var(--text-muted)]">
        Painel do Mestre — Feiticeiros e Maldições
      </footer>
    </main>
  );
}
