import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SheetView } from "@/systems/feiticeiros-e-maldicoes/components/SheetView";

export const dynamic = "force-dynamic";

export default async function CharacterSheetPage({
  params,
}: {
  params: Promise<{ campaignId: string; id: string }>;
}) {
  const { campaignId, id } = await params;

  const character = await prisma.character.findUnique({
    where: { id },
    include: { campaign: true },
  });

  if (!character || character.campaignId !== campaignId) {
    return notFound();
  }

  return (
    <SheetView
      characterId={character.id}
      campaignId={campaignId}
      initialName={character.name}
      initialType={character.type}
      initialDataRaw={character.data}
    />
  );
}
