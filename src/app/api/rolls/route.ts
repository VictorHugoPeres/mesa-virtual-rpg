import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { syncBus } from "@/core/sync/eventEmitter";
import { SyncEvent, DiceRollEventData, InitiativeDisplayData } from "@/core/sync/syncTypes";
import { CombatState, combatToTvData } from "@/core/initiative/initiativeTypes";
import { parseCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { generateId } from "@/lib/id";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");
    const characterId = searchParams.get("characterId");
    const sessionId = searchParams.get("sessionId");
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));

    const where: { campaignId?: string; characterId?: string; sessionId?: string } = {};
    if (campaignId) where.campaignId = campaignId;
    if (characterId) where.characterId = characterId;

    let activeSessionId: string | null = null;
    if (campaignId) {
      const activeSession = await prisma.session.findFirst({
        where: { campaignId, status: "ACTIVE" },
        select: { id: true },
      });
      activeSessionId = activeSession?.id || null;
    }

    if (sessionId && sessionId !== "all") {
      where.sessionId = sessionId;
    } else if (!sessionId && activeSessionId) {
      where.sessionId = activeSessionId;
    }

    const rolls = await prisma.diceLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ rolls, activeSessionId });
  } catch (error) {
    console.error("Erro ao buscar rolagens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico de rolagens." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      mode,
      campaignId,
      characterId,
      roller,
      formula,
      rawRoll,
      modifier,
      total,
      label,
      isCritical,
      isFumble,
      showOnTv = true,
      targetName,
      targetDefense,
      isHit,
      applyDamageToTarget, // { targetId: string, damage: number }
    } = body;

    if (!mode || !roller || !formula || total === undefined) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes para registrar rolagem." },
        { status: 400 }
      );
    }

    let activeSessionId: string | null = null;
    if (campaignId) {
      const active = await prisma.session.findFirst({
        where: { campaignId: String(campaignId), status: "ACTIVE" },
        select: { id: true },
      });
      activeSessionId = active?.id || null;
    }

    const log = await prisma.diceLog.create({
      data: {
        mode: String(mode),
        campaignId: campaignId ? String(campaignId) : null,
        sessionId: activeSessionId,
        characterId: characterId ? String(characterId) : null,
        roller: String(roller),
        formula: String(formula),
        rawRoll: typeof rawRoll === "string" ? rawRoll : JSON.stringify(rawRoll),
        modifier: parseInt(modifier, 10) || 0,
        total: parseInt(total, 10) || 0,
        label: label ? String(label) : null,
        isCritical: Boolean(isCritical),
        isFumble: Boolean(isFumble),
      },
    });

    let appliedDamageAmount: number | undefined = undefined;

    // 1. Aplicação de dano automático no alvo do combate ativo
    if (campaignId && applyDamageToTarget && applyDamageToTarget.targetId && applyDamageToTarget.damage > 0) {
      try {
        const campaign = await prisma.campaign.findUnique({
          where: { id: String(campaignId) },
          select: { activeCombat: true },
        });

        if (campaign?.activeCombat) {
          const combatState: CombatState = JSON.parse(campaign.activeCombat);
          let targetParticipant: any = null;

          combatState.participants = combatState.participants.map((p) => {
            if (p.id === applyDamageToTarget.targetId) {
              const newHp = Math.max(0, p.currentHp - applyDamageToTarget.damage);
              targetParticipant = { ...p, currentHp: newHp };
              return targetParticipant;
            }
            return p;
          });

          if (targetParticipant) {
            appliedDamageAmount = applyDamageToTarget.damage;

            // Salva combate atualizado
            await prisma.campaign.update({
              where: { id: String(campaignId) },
              data: { activeCombat: JSON.stringify(combatState) },
            });

            // Sincroniza Telão e Mestre
            const tvData: InitiativeDisplayData = combatToTvData(combatState);
            syncBus.emit(`campaign:${campaignId}`, {
              id: generateId("init"),
              type: "INITIATIVE_UPDATE",
              campaignId: String(campaignId),
              payload: tvData,
              timestamp: Date.now(),
            });

            // Se o alvo for um Personagem (PC ou com characterId), atualiza a ficha no banco
            if (targetParticipant.characterId) {
              try {
                const char = await prisma.character.findUnique({
                  where: { id: targetParticipant.characterId },
                });
                if (char) {
                  const sheet = parseCharacterData(char.data);
                  sheet.hp.current = targetParticipant.currentHp;
                  await prisma.character.update({
                    where: { id: targetParticipant.characterId },
                    data: { data: JSON.stringify(sheet) },
                  });

                  syncBus.emit(`campaign:${campaignId}`, {
                    id: generateId("char"),
                    type: "CHARACTER_UPDATE",
                    campaignId: String(campaignId),
                    payload: {
                      characterId: targetParticipant.characterId,
                      name: char.name,
                      data: sheet,
                    },
                    timestamp: Date.now(),
                  });
                }
              } catch (cErr) {
                console.warn("Erro ao atualizar ficha do alvo:", cErr);
              }
            }
          }
        }
      } catch (dmgErr) {
        console.warn("Erro ao aplicar dano automático no combate:", dmgErr);
      }
    }

    // 2. Dispara notificação no Telão e SSE
    if (showOnTv && campaignId) {
      const syncEvent: SyncEvent<DiceRollEventData> = {
        id: generateId("roll"),
        type: "DICE_ROLL",
        campaignId,
        payload: {
          roller: log.roller,
          formula: log.formula,
          rawRoll: log.rawRoll,
          modifier: log.modifier,
          total: log.total,
          label: log.label,
          isCritical: log.isCritical,
          isFumble: log.isFumble,
          mode: log.mode,
          targetName: targetName ? String(targetName) : undefined,
          targetDefense: targetDefense !== undefined ? Number(targetDefense) : undefined,
          isHit: isHit !== undefined ? Boolean(isHit) : undefined,
          appliedDamage: appliedDamageAmount,
        },
        timestamp: Date.now(),
      };

      syncBus.emit(`campaign:${campaignId}`, syncEvent);
    }

    // 3. Iniciativa Automática: se a rolagem for de iniciativa e houver combate ativo na campanha
    if (campaignId && label && label.toLowerCase().includes("iniciativa")) {
      try {
        const campaign = await prisma.campaign.findUnique({
          where: { id: String(campaignId) },
          select: { activeCombat: true },
        });

        if (campaign?.activeCombat) {
          const combatState: CombatState = JSON.parse(campaign.activeCombat);
          let found = false;
          const rollTotal = parseInt(String(total), 10) || 0;

          combatState.participants = combatState.participants.map((p) => {
            const matchesId = characterId && p.characterId === String(characterId);
            const matchesName = roller && p.name.toLowerCase() === String(roller).toLowerCase();
            if (matchesId || matchesName) {
              found = true;
              return { ...p, initiative: rollTotal, initiativeRolled: true };
            }
            return p;
          });

          if (found) {
            combatState.participants.sort((a, b) => {
              if (b.initiative !== a.initiative) {
                return b.initiative - a.initiative;
              }
              return (b.initiativeBonus || 0) - (a.initiativeBonus || 0);
            });

            await prisma.campaign.update({
              where: { id: String(campaignId) },
              data: { activeCombat: JSON.stringify(combatState) },
            });

            const tvData: InitiativeDisplayData = combatToTvData(combatState);
            syncBus.emit(`campaign:${campaignId}`, {
              id: generateId("init"),
              type: "INITIATIVE_UPDATE",
              campaignId: String(campaignId),
              payload: tvData,
              timestamp: Date.now(),
            });
          }
        }
      } catch (initErr) {
        console.warn("Erro ao sincronizar iniciativa automática:", initErr);
      }
    }

    return NextResponse.json({ roll: log }, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar rolagem:", error);
    return NextResponse.json(
      { error: "Erro interno ao salvar rolagem." },
      { status: 500 }
    );
  }
}
