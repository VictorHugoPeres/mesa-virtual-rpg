import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; mapId: string }> }
) {
  try {
    const { mapId } = await params;
    const map = await prisma.tacticalMap.findUnique({
      where: { id: mapId },
    });

    if (!map) {
      return NextResponse.json({ error: "Mapa não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ map });
  } catch (err) {
    console.error("Erro ao buscar mapa:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mapId: string }> }
) {
  try {
    const { mapId } = await params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.imageUrl !== undefined) updateData.imageUrl = String(body.imageUrl).trim();
    if (body.gridEnabled !== undefined) updateData.gridEnabled = Boolean(body.gridEnabled);
    if (body.gridSize !== undefined) updateData.gridSize = Number(body.gridSize);
    if (body.gridColor !== undefined) updateData.gridColor = String(body.gridColor);
    if (body.gridOpacity !== undefined) updateData.gridOpacity = Number(body.gridOpacity);
    if (body.metersPerGrid !== undefined) updateData.metersPerGrid = Number(body.metersPerGrid);
    if (body.cameraState !== undefined) {
      updateData.cameraState = typeof body.cameraState === "string"
        ? body.cameraState
        : JSON.stringify(body.cameraState);
    }
    if (body.elementsData !== undefined) {
      updateData.elementsData = typeof body.elementsData === "string"
        ? body.elementsData
        : JSON.stringify(body.elementsData);
    }
    if (body.fogData !== undefined) {
      updateData.fogData = typeof body.fogData === "string"
        ? body.fogData
        : JSON.stringify(body.fogData);
    }

    const updated = await prisma.tacticalMap.update({
      where: { id: mapId },
      data: updateData,
    });

    return NextResponse.json({ map: updated });
  } catch (err) {
    console.error("Erro ao atualizar mapa:", err);
    return NextResponse.json({ error: "Erro ao atualizar mapa" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; mapId: string }> }
) {
  try {
    const { mapId } = await params;
    await prisma.tacticalMap.delete({
      where: { id: mapId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao excluir mapa:", err);
    return NextResponse.json({ error: "Erro ao excluir mapa" }, { status: 500 });
  }
}
