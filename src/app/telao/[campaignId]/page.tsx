import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TelaoView } from "@/core/telao/TelaoView";
import {
  ProjectionData,
  InitiativeDisplayData,
  AudioBGMEventData,
  TacticalMapSyncData,
} from "@/core/sync/syncTypes";
import { combatToTvData } from "@/core/initiative/initiativeTypes";

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
      activeCombat: true,
      activeAudio: true,
      activeMap: true,
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

  let initialCombat: InitiativeDisplayData | null = null;
  if (campaign.activeCombat) {
    try {
      const parsed = JSON.parse(campaign.activeCombat);
      initialCombat = combatToTvData(parsed);
    } catch {
      initialCombat = null;
    }
  }

  let initialAudio: AudioBGMEventData | null = null;
  if (campaign.activeAudio) {
    try {
      initialAudio = JSON.parse(campaign.activeAudio);
    } catch {
      initialAudio = null;
    }
  }

  let initialMap: TacticalMapSyncData | null = null;
  if (campaign.activeMap) {
    try {
      initialMap = JSON.parse(campaign.activeMap);
    } catch {
      initialMap = null;
    }
  }

  return (
    <TelaoView
      campaignId={campaign.id}
      campaignName={campaign.name}
      initialProjection={initialProjection}
      initialCombat={initialCombat}
      initialAudio={initialAudio}
      initialMap={initialMap}
    />
  );
}
