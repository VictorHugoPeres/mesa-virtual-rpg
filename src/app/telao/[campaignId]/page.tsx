import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TelaoView } from "@/core/telao/TelaoView";
import { ProjectionData } from "@/core/sync/syncTypes";

export const dynamic = "force-dynamic";

export default async function TelaoPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: {
      id: true,
      name: true,
      activeProjection: true,
    },
  });

  if (!campaign) return notFound();

  let initialProjection: ProjectionData | null = null;
  if (campaign.activeProjection) {
    try {
      initialProjection = JSON.parse(campaign.activeProjection);
    } catch {
      initialProjection = null;
    }
  }

  return (
    <TelaoView
      campaignId={campaign.id}
      campaignName={campaign.name}
      initialProjection={initialProjection}
    />
  );
}
