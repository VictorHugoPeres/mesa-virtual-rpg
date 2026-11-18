import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const campaignId = formData.get("campaignId") as string | null;
    const title = formData.get("title") as string | null;
    const category = (formData.get("category") as string | null) || "SCENE";
    const notes = formData.get("notes") as string | null;

    if (!file || !campaignId || !title) {
      return NextResponse.json(
        { error: "file, campaignId e title são obrigatórios" },
        { status: 400 }
      );
    }

    // Sanitiza e gera nome único para o arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".png";
    const baseName = path.basename(file.name, ext);
    const sanitizedBase = baseName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-") // troca espaços e caracteres especiais por -
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const cleanFileName = `${Date.now()}-${sanitizedBase || "midia"}${ext.toLowerCase()}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Garante que o diretório existe
    await fs.mkdir(uploadDir, { recursive: true });

    const destination = path.join(uploadDir, cleanFileName);
    await fs.writeFile(destination, buffer);

    const publicUrl = `/uploads/${cleanFileName}`;

    const media = await prisma.mediaAsset.create({
      data: {
        campaignId,
        title: title.trim(),
        url: publicUrl,
        category,
        notes: notes ? notes.trim() : null,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (err) {
    console.error("Erro no upload de mídia:", err);
    return NextResponse.json(
      { error: "Falha ao processar upload" },
      { status: 500 }
    );
  }
}
