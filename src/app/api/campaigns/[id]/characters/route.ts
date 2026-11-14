import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  createDefaultCharacter,
  Specialization,
  Origin,
} from "@/systems/feiticeiros-e-maldicoes";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;
    const body = await req.json();

    const name = String(body.name || "").trim();
    const type = body.type === "NPC" ? "NPC" : "PC";
    const specialization = (body.specialization || "Lutador") as Specialization;
    const origin = (body.origin || "Inato") as Origin;

    if (!name) {
      return NextResponse.json(
        { error: "O nome do personagem é obrigatório." },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campanha não encontrada." },
        { status: 404 }
      );
    }

    const initialSheet = createDefaultCharacter(name, type, specialization, origin);
    initialSheet.campaign = campaign.name;

    const character = await prisma.character.create({
      data: {
        name,
        type,
        campaignId,
        data: JSON.stringify(initialSheet),
      },
    });

    return NextResponse.json({ character }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar personagem:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar personagem." },
      { status: 500 }
    );
  }
}
