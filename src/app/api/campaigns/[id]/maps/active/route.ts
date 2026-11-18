import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncBus } from "@/core/sync/eventEmitter";
import { SyncEvent, TacticalMapSyncData } from "@/core/sync/syncTypes";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { activeMap: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    let parsed: TacticalMapSyncData | null = null;
    if (campaign.activeMap) {
      try {
        parsed = JSON.parse(campaign.activeMap);
      } catch {
        parsed = null;
      }
    }

    return NextResponse.json({ activeMap: parsed });
  } catch (err) {
    console.error("Erro ao buscar mapa ativo:", err);
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
    const mapData: TacticalMapSyncData | null = body.mapData ?? null;

    const serialized = mapData ? JSON.stringify(mapData) : null;

    await prisma.campaign.update({
      where: { id },
      data: { activeMap: serialized },
    });

    // Emite evento em tempo real para os clientes SSE
    const event: SyncEvent<TacticalMapSyncData | null> = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "MAP_UPDATE",
      campaignId: id,
      payload: mapData,
      timestamp: Date.now(),
    };

    syncBus.emit(`campaign:${id}`, event);

    return NextResponse.json({ success: true, activeMap: mapData });
  } catch (err) {
    console.error("Erro ao salvar mapa ativo:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
