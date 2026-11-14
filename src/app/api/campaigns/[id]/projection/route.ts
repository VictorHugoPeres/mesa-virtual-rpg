import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncBus } from "@/core/sync/eventEmitter";
import { SyncEvent, ProjectionData } from "@/core/sync/syncTypes";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { activeProjection: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    let parsed: ProjectionData | null = null;
    if (campaign.activeProjection) {
      try {
        parsed = JSON.parse(campaign.activeProjection);
      } catch {
        parsed = null;
      }
    }

    return NextResponse.json({ activeProjection: parsed });
  } catch (err) {
    console.error("Erro ao buscar projeção:", err);
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
    const projection: ProjectionData | null = body.projection ?? null;

    const serialized = projection ? JSON.stringify(projection) : null;

    await prisma.campaign.update({
      where: { id },
      data: { activeProjection: serialized },
    });

    // Emite evento para os clientes SSE
    const event: SyncEvent<ProjectionData | null> = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "PROJECTION_UPDATE",
      campaignId: id,
      payload: projection,
      timestamp: Date.now(),
    };

    syncBus.emit(`campaign:${id}`, event);

    return NextResponse.json({ success: true, activeProjection: projection });
  } catch (err) {
    console.error("Erro ao salvar projeção:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
