import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { MobilePlayerWorkspace } from "@/core/player/MobilePlayerWorkspace";

interface PageProps {
  params: Promise<{ campaignId: string; characterId: string }>;
}

export const dynamic = "force-dynamic";

export default async function MobileCharacterPage({ params }: PageProps) {
  const { campaignId, characterId } = await params;

  const character = await prisma.character.findFirst({
    where: { id: characterId, campaignId },
  });

  if (!character) {
    notFound();
  }

  let sheet;
  try {
    sheet = parseCharacterData(character.data);
  } catch (err) {
    console.error("Erro ao fazer parse da ficha:", err);
    notFound();
  }

  return (
    <MobilePlayerWorkspace
      campaignId={campaignId}
      characterId={character.id}
      characterName={character.name}
      initialSheet={sheet}
    />
  );
}
