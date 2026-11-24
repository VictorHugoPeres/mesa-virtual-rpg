import { prisma } from "@/lib/prisma";
import { NewCampaignModal } from "@/components/NewCampaignModal";
import { CampaignCard } from "@/components/CampaignCard";
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
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
