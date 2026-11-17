import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncBus } from "@/core/sync/eventEmitter";
import { SyncEvent, AudioBGMEventData } from "@/core/sync/syncTypes";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { activeAudio: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    let parsed: AudioBGMEventData | null = null;
    if (campaign.activeAudio) {
      try {
        parsed = JSON.parse(campaign.activeAudio);
      } catch {
        parsed = null;
      }
    }

    return NextResponse.json({ activeAudio: parsed });
  } catch (err) {
    console.error("Erro ao buscar áudio:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const audioData: AudioBGMEventData | null = body.audioData ?? null;

    const serialized = audioData ? JSON.stringify(audioData) : null;

    await prisma.campaign.update({
      where: { id },
      data: { activeAudio: serialized },
    });

    // Emite evento para os ouvintes SSE
    const event: SyncEvent<AudioBGMEventData | null> = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "AUDIO_UPDATE",
      campaignId: id,
      payload: audioData,
      timestamp: Date.now(),
    };

    syncBus.emit(`campaign:${id}`, event);

    return NextResponse.json({ success: true, activeAudio: audioData });
  } catch (err) {
    console.error("Erro ao salvar estado de áudio:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
