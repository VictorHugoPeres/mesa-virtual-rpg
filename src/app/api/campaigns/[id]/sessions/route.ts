import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessions = await prisma.session.findMany({
      where: { campaignId: id },
      orderBy: { sessionNumber: "desc" },
      include: {
        _count: { select: { diceLogs: true } },
      },
    });

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("Erro ao listar sessões:", err);
    return NextResponse.json({ error: "Erro interno ao listar sessões" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, title, notes } = body;

    if (action === "finish") {
      // 1. Busca a sessão ativa atual
      const activeSession = await prisma.session.findFirst({
        where: { campaignId: id, status: "ACTIVE" },
        orderBy: { sessionNumber: "desc" },
      });

      let currentNum = 1;

      if (activeSession) {
        currentNum = activeSession.sessionNumber || activeSession.number || 1;
        await prisma.session.update({
          where: { id: activeSession.id },
          data: {
            status: "COMPLETED",
            endedAt: new Date(),
            title: title || activeSession.title,
            notes: typeof notes === "string" ? notes : activeSession.notes,
          },
        });
      }

      // 2. Cria automaticamente a próxima sessão como ACTIVE
      const nextNum = currentNum + 1;
      const newSession = await prisma.session.create({
        data: {
          campaignId: id,
          sessionNumber: nextNum,
          number: nextNum,
          title: `Sessão ${nextNum}`,
          status: "ACTIVE",
          notes: "",
          startedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        finishedSessionId: activeSession?.id,
        newSession,
      });
    }

    return NextResponse.json({ error: "Ação não suportada" }, { status: 400 });
  } catch (err) {
    console.error("Erro ao finalizar sessão:", err);
    return NextResponse.json({ error: "Erro interno ao gerenciar sessão" }, { status: 500 });
  }
}
