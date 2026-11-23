import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncBus } from "@/core/sync/eventEmitter";
import { SyncEvent, TacticalMapSyncData } from "@/core/sync/syncTypes";
import { MapElement } from "@/core/map/elements/elementTypes";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mapId: string }> }
) {
  try {
    const { id: campaignId, mapId } = await params;
    const body = await req.json();
    const { elementId, characterId, x, y, senderId } = body;

    if (!elementId || !characterId || typeof x !== "number" || typeof y !== "number") {
      return NextResponse.json(
        { error: "Parâmetros elementId, characterId, x e y são obrigatórios" },
        { status: 400 }
      );
    }

    // 1. Busca o mapa no SQLite
    const map = await prisma.tacticalMap.findUnique({
      where: { id: mapId },
    });

    if (!map || map.campaignId !== campaignId) {
      return NextResponse.json({ error: "Mapa não encontrado nesta campanha" }, { status: 404 });
    }

    // 2. Parse dos elementos existentes
    let elements: MapElement[] = [];
    try {
      elements = map.elementsData ? JSON.parse(map.elementsData) : [];
      if (!Array.isArray(elements)) elements = [];
    } catch {
      elements = [];
    }

    // 3. Localiza o token alvo
    const targetIndex = elements.findIndex((el) => el.id === elementId);
    if (targetIndex === -1) {
      return NextResponse.json({ error: "Token não encontrado no mapa" }, { status: 404 });
    }

    const targetElement = elements[targetIndex];

    // 4. Validação de segurança: apenas o dono do personagem pode mover seu próprio token
    if (targetElement.characterId !== characterId) {
      return NextResponse.json(
        { error: "Permissão negada: você só pode mover o token do seu próprio personagem" },
        { status: 403 }
      );
    }

    // 5. Atualização atômica da posição
    const updatedElement: MapElement = {
      ...targetElement,
      x: Math.round(x),
      y: Math.round(y),
    };
    elements[targetIndex] = updatedElement;
    const elementsDataStr = JSON.stringify(elements);

    // 6. Persiste no banco de dados
    await prisma.tacticalMap.update({
      where: { id: mapId },
      data: { elementsData: elementsDataStr },
    });

    // 7. Se for o mapa atualmente projetado, atualiza também a projeção ativa da campanha
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { activeMap: true },
      });

      if (campaign?.activeMap) {
        const activeMapObj: TacticalMapSyncData = JSON.parse(campaign.activeMap);
        let activeChanged = false;

        if (activeMapObj.id === mapId) {
          activeMapObj.elementsData = elementsDataStr;
          activeChanged = true;
        } else if (activeMapObj.secondaryMapData?.id === mapId) {
          activeMapObj.secondaryMapData.elementsData = elementsDataStr;
          activeChanged = true;
        }

        if (activeChanged) {
          await prisma.campaign.update({
            where: { id: campaignId },
            data: { activeMap: JSON.stringify(activeMapObj) },
          });
        }
      }
    } catch (err) {
      console.warn("Aviso: Falha ao atualizar activeMap da campanha:", err);
    }

    // 8. Emite evento em tempo real via SSE (syncBus)
    const event: SyncEvent<{ mapId: string; elementsData: string; senderId?: string }> = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: "MAP_ELEMENTS_UPDATE",
      campaignId,
      payload: {
        mapId,
        elementsData: elementsDataStr,
        senderId,
      },
      timestamp: Date.now(),
    };

    syncBus.emit(`campaign:${campaignId}`, event);

    return NextResponse.json({
      success: true,
      element: updatedElement,
    });
  } catch (err) {
    console.error("Erro ao mover token via PATCH:", err);
    return NextResponse.json({ error: "Erro interno ao mover token" }, { status: 500 });
  }
}
