import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncBus } from "@/core/sync/eventEmitter";
import { SyncEvent, InitiativeDisplayData } from "@/core/sync/syncTypes";
import { CombatState, EMPTY_COMBAT, combatToTvData } from "@/core/initiative/initiativeTypes";
import { parseCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { generateId } from "@/lib/id";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { activeCombat: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    let parsed: CombatState = EMPTY_COMBAT;
    if (campaign.activeCombat) {
      try {
        parsed = JSON.parse(campaign.activeCombat);
      } catch {
        parsed = EMPTY_COMBAT;
      }
    }

    return NextResponse.json({ combatState: parsed });
  } catch (err) {
    console.error("Erro ao buscar combate:", err);
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
    const combatState: CombatState = body.combatState ?? EMPTY_COMBAT;

    const serialized = JSON.stringify(combatState);

    await prisma.campaign.update({
      where: { id },
      data: { activeCombat: serialized },
    });

    // Sanitiza para o Telão e emite evento SSE
    const tvData: InitiativeDisplayData = combatToTvData(combatState);

    const event: SyncEvent<InitiativeDisplayData> = {
      id: generateId("init"),
      type: "INITIATIVE_UPDATE",
      campaignId: id,
      payload: tvData,
      timestamp: Date.now(),
    };

    syncBus.emit(`campaign:${id}`, event);

    // Sincroniza participantes que possuem characterId de volta para a ficha do personagem
    for (const p of combatState.participants) {
      if (p.characterId) {
        try {
          const char = await prisma.character.findUnique({
            where: { id: p.characterId },
          });

          if (char) {
            const sheet = parseCharacterData(char.data);
            let sheetChanged = false;

            if (sheet.hp.current !== p.currentHp) {
              sheet.hp.current = p.currentHp;
              sheetChanged = true;
            }
            if (p.currentEnergy !== undefined && sheet.energy.current !== p.currentEnergy) {
              sheet.energy.current = p.currentEnergy;
              sheetChanged = true;
            }

            if (sheetChanged) {
              await prisma.character.update({
                where: { id: p.characterId },
                data: { data: JSON.stringify(sheet) },
              });

              syncBus.emit(`campaign:${id}`, {
                id: generateId("char"),
                type: "CHARACTER_UPDATE",
                campaignId: id,
                payload: {
                  characterId: p.characterId,
                  name: char.name,
                  data: sheet,
                },
                timestamp: Date.now(),
              });
            }
          }
        } catch (charSyncErr) {
          console.warn("Erro ao sincronizar participante com ficha:", charSyncErr);
        }
      }
    }

    return NextResponse.json({ success: true, combatState, tvData });
  } catch (err) {
    console.error("Erro ao salvar combate:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
