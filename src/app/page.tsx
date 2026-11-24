import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Calendar } from "lucide-react";
import { NewCampaignModal } from "@/components/NewCampaignModal";
import { BrandLogo, D20Icon } from "@/components/BrandLogo";

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
      {/* Header com a Logo Oficial D20 */}
      <header className="mb-10 text-center flex flex-col items-center">
        <BrandLogo variant="hero" size="xl" />
      </header>

      {/* Lista de Campanhas */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-100">Campanhas</h2>
          <NewCampaignModal />
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <D20Icon size={48} className="mx-auto mb-4 opacity-25 text-rose-500" />
            <p className="text-sm font-medium text-zinc-400">Nenhuma campanha encontrada.</p>
            <p className="text-xs mt-1 text-zinc-500">
              Clique em Nova Campanha para começar sua primeira mesa.
            </p>
          </div>
        ) : (
          <div className="grid gap-3.5">
            {campaigns.map((campaign) => {
              const systemLabel =
                campaign.systemId === "feiticeiros-e-maldicoes"
                  ? "Feiticeiros e Maldições"
                  : campaign.systemId;

              return (
                <Link
                  key={campaign.id}
                  href={`/mestre/${campaign.id}`}
                  className="group block p-5 rounded-xl border border-white/[0.08]
                             bg-[#111216] hover:bg-[#16171d] hover:border-white/15
                             transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                        {campaign.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                        Sistema:{" "}
                        <span className="text-zinc-300 font-medium">
                          {systemLabel}
                        </span>
                      </p>
                    </div>
                    <span className="text-xs text-zinc-500 mt-1 font-mono">
                      {new Date(campaign.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex gap-6 mt-4 text-xs sm:text-sm text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-zinc-500" />
                      {campaign.characters.length}{" "}
                      {campaign.characters.length === 1
                        ? "personagem"
                        : "personagens"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-zinc-500" />
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
    </main>
  );
}
