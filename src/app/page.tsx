import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Swords, Users, Calendar, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      characters: { select: { id: true, name: true } },
      sessions: { select: { id: true, number: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center justify-center gap-3">
          <Swords className="w-8 h-8 text-red-500" />
          Mesa Virtual RPG
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Plataforma modular para mesas presenciais híbridas
        </p>
      </header>

      {/* Lista de Campanhas */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Campanhas</h2>
          <button
            disabled
            title="Em breve: Criar nova campanha"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       bg-[var(--bg-card)] border border-[var(--border-default)]
                       text-[var(--text-muted)] cursor-not-allowed opacity-50"
          >
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <Swords className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Nenhuma campanha encontrada.</p>
            <p className="text-xs mt-1">
              Execute <code className="bg-[var(--bg-card)] px-1.5 py-0.5 rounded">npm run db:seed</code> para criar dados de exemplo.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => {
              const systemLabel =
                campaign.systemId === "feiticeiros-e-maldicoes"
                  ? "Feiticeiros e Maldições"
                  : campaign.systemId;

              return (
                <Link
                  key={campaign.id}
                  href={`/mestre/${campaign.id}`}
                  className="group block p-5 rounded-xl border border-[var(--border-default)]
                             bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]
                             hover:border-[var(--border-accent)] transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-red-400 transition-colors">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Sistema:{" "}
                        <span className="text-[var(--accent-purple)] font-medium">
                          {systemLabel}
                        </span>
                      </p>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] mt-1">
                      {new Date(campaign.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex gap-6 mt-4 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[var(--accent-blue)]" />
                      {campaign.characters.length}{" "}
                      {campaign.characters.length === 1
                        ? "personagem"
                        : "personagens"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[var(--accent-green)]" />
                      {campaign.sessions.length}{" "}
                      {campaign.sessions.length === 1 ? "sessão" : "sessões"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-[var(--text-muted)]">
        Etapa 1A — Estrutura Base &middot; Next.js + Prisma + SQLite
      </footer>
    </main>
  );
}
