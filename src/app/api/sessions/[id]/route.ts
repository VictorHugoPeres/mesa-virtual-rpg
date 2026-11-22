import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { notes, title, status, endedAt } = body;

    const data: {
      notes?: string;
      title?: string;
      status?: string;
      endedAt?: Date | null;
    } = {};

    if (typeof notes === "string") data.notes = notes;
    if (typeof title === "string") data.title = title;
    if (typeof status === "string") data.status = status;
    if (endedAt !== undefined) data.endedAt = endedAt ? new Date(endedAt) : null;

    const session = await prisma.session.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, session });
  } catch (err) {
    console.error("Erro ao atualizar anotações da sessão:", err);
    return NextResponse.json({ error: "Erro interno ao salvar notas" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (err) {
    console.error("Erro ao buscar sessão:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
