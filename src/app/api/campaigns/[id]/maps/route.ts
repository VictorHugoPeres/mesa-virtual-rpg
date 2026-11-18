import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const maps = await prisma.tacticalMap.findMany({
      where: { campaignId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ maps });
  } catch (err) {
    console.error("Erro ao listar mapas táticos:", err);
    return NextResponse.json({ error: "Erro interno ao listar mapas" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, imageUrl, gridSize, gridColor, gridOpacity, metersPerGrid } = body;

    if (!title?.trim() || !imageUrl?.trim()) {
      return NextResponse.json(
        { error: "Título e Imagem do mapa são obrigatórios" },
        { status: 400 }
      );
    }

    const map = await prisma.tacticalMap.create({
      data: {
        campaignId: id,
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        gridEnabled: body.gridEnabled ?? true,
        gridSize: Number(gridSize) || 50,
        gridColor: gridColor || "#ffffff",
        gridOpacity: typeof gridOpacity === "number" ? gridOpacity : 0.2,
        metersPerGrid: Number(metersPerGrid) || 1.5,
        cameraState: JSON.stringify(body.cameraState || { zoom: 1, panX: 0, panY: 0 }),
        elementsData: "[]",
      },
    });

    return NextResponse.json({ map }, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar mapa tático:", err);
    return NextResponse.json({ error: "Erro interno ao criar mapa" }, { status: 500 });
  }
}
