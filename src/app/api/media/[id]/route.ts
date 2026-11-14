import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await prisma.mediaAsset.findUnique({ where: { id } });

    if (!media) {
      return NextResponse.json({ error: "Mídia não encontrada" }, { status: 404 });
    }

    // Se for arquivo local em /uploads/, tenta remover do disco
    if (media.url.startsWith("/uploads/")) {
      const fileName = path.basename(media.url);
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      try {
        await fs.unlink(filePath);
      } catch (fileErr) {
        console.warn("Arquivo físico não encontrado ou já removido:", fileErr);
      }
    }

    await prisma.mediaAsset.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao deletar mídia:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
