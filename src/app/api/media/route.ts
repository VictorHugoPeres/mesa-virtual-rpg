import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");

    if (!campaignId) {
      return NextResponse.json(
        { error: "campaignId obrigatório" },
        { status: 400 }
      );
    }

    const mediaList = await prisma.mediaAsset.findMany({
      where: { campaignId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ media: mediaList });
  } catch (err) {
    console.error("Erro ao listar mídias:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, title, url, category, notes } = body;

    if (!campaignId || !title || !url) {
      return NextResponse.json(
        { error: "campaignId, title e url são obrigatórios" },
        { status: 400 }
      );
    }

    const created = await prisma.mediaAsset.create({
      data: {
        campaignId,
        title: title.trim(),
        url: url.trim(),
        category: category || "SCENE",
        notes: notes ? notes.trim() : null,
      },
    });

    return NextResponse.json({ media: created }, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar mídia:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
