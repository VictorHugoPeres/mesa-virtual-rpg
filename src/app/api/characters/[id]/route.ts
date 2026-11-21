import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { syncBus } from "@/core/sync/eventEmitter";
import {
  parseCharacterData,
  FMCharacterDataSchema,
} from "@/systems/feiticeiros-e-maldicoes";
import { CombatState, combatToTvData } from "@/core/initiative/initiativeTypes";
import { generateId } from "@/lib/id";

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

    if (existing.campaignId) {
      // 1. Emite CHARACTER_UPDATE para celular e PC
      syncBus.emit(`campaign:${existing.campaignId}`, {
        id: generateId("char"),
        type: "CHARACTER_UPDATE",
        campaignId: existing.campaignId,
        payload: {
          characterId: id,
          name: updatedName,
          data: validatedData,
        },
        timestamp: Date.now(),
      });

      // 2. Sincroniza combatState se o personagem estiver no combate ativo
      try {
        const campaign = await prisma.campaign.findUnique({
          where: { id: existing.campaignId },
          select: { activeCombat: true },
        });

        if (campaign?.activeCombat) {
          const combatState: CombatState = JSON.parse(campaign.activeCombat);
          let combatChanged = false;

          combatState.participants = combatState.participants.map((p) => {
            if (p.characterId === id || p.name.toLowerCase() === updatedName.toLowerCase()) {
              combatChanged = true;
              return {
                ...p,
                name: updatedName,
                currentHp: validatedData.hp.current,
                maxHp: validatedData.hp.max,
                currentEnergy: validatedData.energy.current,
                maxEnergy: validatedData.energy.max,
                defense: validatedData.defense?.total ?? p.defense,
              };
            }
            return p;
          });

          if (combatChanged) {
            await prisma.campaign.update({
              where: { id: existing.campaignId },
              data: { activeCombat: JSON.stringify(combatState) },
            });

            const tvData = combatToTvData(combatState);
            syncBus.emit(`campaign:${existing.campaignId}`, {
              id: generateId("init"),
              type: "INITIATIVE_UPDATE",
              campaignId: existing.campaignId,
              payload: tvData,
              timestamp: Date.now(),
            });
          }
        }
      } catch (combatSyncErr) {
        console.warn("Erro ao sincronizar participante com combate ativo:", combatSyncErr);
      }
    }

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
