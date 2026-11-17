import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AUDIO_EXTENSIONS = /\.(mp3|ogg|wav|aac|flac|m4a)($|\?)/i;
const AUDIO_CATEGORIES = ["SFX", "AUDIO", "MUSIC", "BGM", "BGM_COMBATE", "BGM_TENSAO", "BGM_EXPLORACAO", "BGM_AMBIENTE", "BGM_OUTROS"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");
    const type = searchParams.get("type"); // "image" | "audio"

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

    let filtered = mediaList;

    if (type === "image") {
      filtered = mediaList.filter((m) => {
        const cat = (m.category || "").toUpperCase();
        if (AUDIO_CATEGORIES.includes(cat) || cat.startsWith("BGM_")) return false;
        if (AUDIO_EXTENSIONS.test(m.url)) return false;
        return true;
      });
    } else if (type === "audio") {
      filtered = mediaList.filter((m) => {
        const cat = (m.category || "").toUpperCase();
        if (AUDIO_CATEGORIES.includes(cat) || cat.startsWith("BGM_")) return true;
        if (AUDIO_EXTENSIONS.test(m.url)) return true;
        return false;
      });
    }

    return NextResponse.json({ media: filtered });
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
