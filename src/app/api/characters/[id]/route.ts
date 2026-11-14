import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  parseCharacterData,
  FMCharacterDataSchema,
} from "@/systems/feiticeiros-e-maldicoes";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const character = await prisma.character.findUnique({
      where: { id },
      include: { campaign: true },
    });

    if (!character) {
      return NextResponse.json(
        { error: "Personagem não encontrado." },
        { status: 404 }
      );
    }

    const sheet = parseCharacterData(character.data);
    return NextResponse.json({ character, sheet });
  } catch (error) {
    console.error("Erro ao buscar personagem:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar personagem." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.character.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Personagem não encontrado." },
        { status: 404 }
      );
    }

    // Valida os dados da ficha com Zod
    const validatedData = FMCharacterDataSchema.parse(body.data);
    const updatedName = body.name ? String(body.name).trim() : existing.name;
    const updatedType = body.type ? String(body.type) : existing.type;

    const character = await prisma.character.update({
      where: { id },
      data: {
        name: updatedName,
        type: updatedType,
        data: JSON.stringify(validatedData),
      },
    });

    return NextResponse.json({ success: true, character });
  } catch (error) {
    console.error("Erro ao atualizar personagem:", error);
    return NextResponse.json(
      { error: "Erro ao validar ou salvar dados da ficha." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.character.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir personagem:", error);
    return NextResponse.json(
      { error: "Erro ao excluir personagem." },
      { status: 500 }
    );
  }
}
