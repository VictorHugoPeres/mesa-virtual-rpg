import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const systemId = String(body.systemId || "feiticeiros-e-maldicoes");

    if (!name) {
      return NextResponse.json(
        { error: "O nome da campanha é obrigatório." },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        systemId,
      },
    });

    // Cria automaticamente a primeira sessão vazia
    await prisma.session.create({
      data: {
        number: 1,
        campaignId: campaign.id,
        notes: "Sessão 1 — Início da campanha.",
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar campanha:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar campanha." },
      { status: 500 }
    );
  }
}
