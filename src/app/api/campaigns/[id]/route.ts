import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        sessions: { orderBy: { sessionNumber: "desc" } },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch (err) {
    console.error("Erro ao buscar campanha:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { generalNotes, name } = body;

    const data: { generalNotes?: string; name?: string } = {};
    if (typeof generalNotes === "string") data.generalNotes = generalNotes;
    if (typeof name === "string") data.name = name;

    const campaign = await prisma.campaign.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, campaign });
  } catch (err) {
    console.error("Erro ao atualizar campanha:", err);
    return NextResponse.json({ error: "Erro ao atualizar dados da campanha" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Remove em transação segura todas as entidades vinculadas antes da campanha
    await prisma.$transaction([
      prisma.diceLog.deleteMany({ where: { campaignId: id } }),
      prisma.tacticalMap.deleteMany({ where: { campaignId: id } }),
      prisma.mediaAsset.deleteMany({ where: { campaignId: id } }),
      prisma.character.deleteMany({ where: { campaignId: id } }),
      prisma.session.deleteMany({ where: { campaignId: id } }),
      prisma.campaign.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao excluir campanha:", err);
    return NextResponse.json({ error: "Erro ao excluir campanha" }, { status: 500 });
  }
}
