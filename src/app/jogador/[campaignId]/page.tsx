import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MobileCharacterSelector } from "@/core/player/MobileCharacterSelector";

interface PageProps {
  params: Promise<{ campaignId: string }>;
}

export const dynamic = "force-dynamic";

export default async function MobileCampaignPage({ params }: PageProps) {
  const { campaignId } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { id: true, name: true },
  });

  if (!campaign) {
    notFound();
  }

  // Lista exclusivamente personagens jogadores (PC)
  const characters = await prisma.character.findMany({
    where: { campaignId, type: "PC" },
    select: { id: true, name: true, type: true, data: true },
    orderBy: { name: "asc" },
  });

  return (
    <MobileCharacterSelector
      campaignId={campaign.id}
      campaignName={campaign.name}
      characters={characters}
    />
  );
}
