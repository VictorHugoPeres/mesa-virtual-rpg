import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");
    const characterId = searchParams.get("characterId");
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "30", 10));

    const where: { campaignId?: string; characterId?: string } = {};
    if (campaignId) where.campaignId = campaignId;
    if (characterId) where.characterId = characterId;

    const rolls = await prisma.diceLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ rolls });
  } catch (error) {
    console.error("Erro ao buscar rolagens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico de rolagens." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      mode,
      campaignId,
      characterId,
      roller,
      formula,
      rawRoll,
      modifier,
      total,
      label,
      isCritical,
      isFumble,
    } = body;

    if (!mode || !roller || !formula || total === undefined) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes para registrar rolagem." },
        { status: 400 }
      );
    }

    const log = await prisma.diceLog.create({
      data: {
        mode: String(mode),
        campaignId: campaignId ? String(campaignId) : null,
        characterId: characterId ? String(characterId) : null,
        roller: String(roller),
        formula: String(formula),
        rawRoll: typeof rawRoll === "string" ? rawRoll : JSON.stringify(rawRoll),
        modifier: parseInt(modifier, 10) || 0,
        total: parseInt(total, 10) || 0,
        label: label ? String(label) : null,
        isCritical: Boolean(isCritical),
        isFumble: Boolean(isFumble),
      },
    });

    return NextResponse.json({ roll: log }, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar rolagem:", error);
    return NextResponse.json(
      { error: "Erro interno ao salvar rolagem." },
      { status: 500 }
    );
  }
}
